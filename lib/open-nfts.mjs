import { ethers } from "ethers";
import { configNetworks, configContracts, abis, getProvider, defaultChain } from "./config.mjs";

class ClassOpenNfts {
  // private #fields not supported by firefox but ES2019
  configNetwork;
  configContract;
  supportsMetadata;
  supportsEnumerable;
  // _version0;
  // _version1;
  provider;
  okConfig;
  subgraph;
  smartContract;
  ok;

  supportsSubgraph() {
    return this.subgraph?.url;
  }
  getAdmin() {
    return this.configNetwork.admin;
  }
  getExplorer() {
    return this.configNetwork.blockExplorerUrls[0];
  }
  getAddress() {
    return this.smartContract.address;
  }
  getNetwork() {
    return this.configNetwork.chainName;
  }
  getOpenSea() {
    return this.configNetwork.openSea;
  }
  async getSmartContract() {
    return {
      address: this.smartContract.address,
      name: await this.smartContract.name(),
      symbol: await this.smartContract.symbol(),
      totalSupply: await this.smartContract.totalSupply()
    };
  }

  constructor(_chainId, _contract_address) {
    // SET configNetwork
    this.configNetwork =
      configNetworks.find((_network) => Number(_network.chainId) === Number(_chainId)) ||
      configNetworks.find((_network) => _network.chainName === defaultChain);

    // SET configContract
    if (_contract_address) {
      this.configContract = configContracts.find(
        (_contract) => _contract.address.toLowerCase() === _contract_address.toLowerCase()
      ) || {
        address: _contract_address,
        network: this.configNetwork?.chainName
      };
    } else {
      this.configContract = configContracts.find((_contract) => _contract.network === this.configNetwork?.chainName);
    }

    // console.log("configContract", this.configContract);
    // console.log("configNetwork", this.configNetwork);

    if (this.configContract?.network && this.configContract?.network === this.configNetwork?.chainName) {
      // SET subgraph.url
      this.subgraph = {
        url: this.configContract.subgraph?.url || this.configNetwork.subgraph?.url || false
      };
      this.provider = getProvider(this.configNetwork);
      this.okConfig = true;
    } else {
      console.error("Wrong network !", this.configContract?.network, this.configNetwork?.chainName);
    }
  }

  async initialize() {
    // Check contract
    const checkContract = new ethers.Contract(this.configContract.address, abis["ERC165"], this.provider);

    let abi = abis["ERC721"];

    const waitMetadata = checkContract.supportsInterface("0x5b5e139f");
    const waitEnumerable = checkContract.supportsInterface("0x780e9d63");
    [this.supportsMetadata, this.supportsEnumerable] = await Promise.all([waitMetadata, waitEnumerable]);

    if (this.supportsMetadata) abi = abi.concat(abis["ERC721Metadata"]);
    if (this.supportsEnumerable) abi = abi.concat(abis["ERC721Enumerable"]);
    abi = abi.concat(abis["KREDEUMv1"]);

    // console.log("contract abi", abi);
    this.smartContract = new ethers.Contract(this.configContract.address, abi, this.provider);
    this.ok = true;
  }

  async fetchJson(_url, _config = {}) {
    let json = {};
    try {
      const res = await fetch(_url, _config);
      // console.log(res);
      json = await res.json();
    } catch (e) {
      console.error("OpenNfts.fetchJson ERROR", e, _url, json);
    }
    return json;
  }

  async fetchGQL(_url, _query) {
    // console.log(`OpenNfts.fetchGQL\n${_url}\n${_query}`);

    const config = { method: "POST", body: JSON.stringify({ query: _query }) };
    const answerGQL = await this.fetchJson(_url, config);
    // console.log(answerGQL);

    if (answerGQL.errors) console.error("OpenNfts.fetchGQL ERROR", answerGQL.errors);
    return answerGQL.data;
  }

  ////////////////////////////////////////////////////////
  // TOKEN
  ////////////////////////////////////////////////////////
  // SMARTCONTRACT DATA
  // contract  = "0xaaa...aaa"
  // tokenID   = "nnn"
  // owner     = "0xbbb...bbb"
  ////////////////////////////////////////////////////////
  // METADATA?
  // tokenURI    = "https://ipfs.io/iofs/bafaaaaa...aaaa"
  // metadata    = {...}
  // image       =
  // name        = "image name"
  // description = "description image"
  // minter?     = ""
  ////////////////////////////////////////////////////////
  // IPFS?
  // jsonCID     = "bafaaa...aaaaaa"
  // imageCID    = "bafaaa...aaaaaa"
  ////////////////////////////////////////////////////////
  // SUBGRAPHDATA?
  // id = "0xaaa...aaa_nnn"
  ////////////////////////////////////////////////////////

  async fetchCov(_path) {
    const loginPass = "ckey_666650029327412c99ce8e3c5ef";
    const url = `https://api.covalenthq.com/v1${_path}&key=${loginPass}`;
    const config = {
      method: "GET",
      headers: {
        Accept: "application/json"
        // Authorization: `Basic ${btoa(loginPass)}`
      }
    };
    return await this.fetchJson(url, config);
  }

  async getTokenFromContract(_owner, _index) {
    const token = {};
    try {
      if (_owner) {
        token.tokenID = (await this.smartContract.tokenOfOwnerByIndex(_owner, _index)).toString();
        token.owner = _owner;
      } else {
        token.tokenID = (await this.smartContract.tokenByIndex(_index)).toString();
        token.owner = await this.smartContract.ownerOf(token.tokenID);
      }
      token.contract = this.smartContract.address;

      if (this.supportsMetadata) {
        token.tokenURI = await this.smartContract.tokenURI(token.tokenID);
        this.addTokenMetadata(token, await this.fetchJson(token.tokenURI));
      }
    } catch (e) {
      console.error("OpenNfts.getTokenFromContract ERROR", e, token);
    }
    console.log("OpenNfts.getTokenFromContract #" + token?.tokenID, token);
    return token;
  }

  addTokenMetadata(token, metadata) {
    token.metadata = metadata || {};
    token.image = token.image || metadata.image || "";
    token.name = token.name || metadata.name || "";
    token.description = token.description || metadata.description || "";
    token.minter = metadata.minter || "";
  }

  async listTokensFromContract(_owner, _limit = 10) {
    let tokens = [];

    try {
      const nbTokens = _owner
        ? (await this.smartContract.balanceOf(_owner)).toNumber()
        : (await this.smartContract.totalSupply()).toNumber();
      console.log("OpenNfts.listTokensFromContract totalSupply", nbTokens);

      const nbTokensLimit = nbTokens <= _limit ? nbTokens : _limit;

      for (let index = 0; index < nbTokensLimit; index++) {
        console.log("OpenNfts.listTokensFromContract item", index + 1);
        tokens[index] = await this.getTokenFromContract(_owner, index);
      }
    } catch (e) {
      console.error("OpenNfts.listTokensFromContract ERROR", e);
    }

    console.log("OpenNfts.listTokensFromContract total", tokens.length);
    // console.log("OpenNfts.listTokensFromContract", tokens);
    return tokens;
  }

  async listTokensFromCovalent(_owner, _limit = 10) {
    console.log("listTokensFromCovalent(_owner, _limit = 10)", _owner, _limit);

    let tokens = [];
    let address, match, path;
    const chainId = parseInt(this.configNetwork.chainId);
    const contract = this.smartContract.address.toLowerCase();
    if (_owner) {
      address = _owner;
      match = `%7B%22contract_address%22%3A+%22${contract}%22%7D`;
      path = `/${chainId}/address/${address}/balances_v2/?nft=true&match=${match}`;
    } else {
      match = `%7B%22contract_address%22%3A+%22${contract}%22%7D`;
      path = `/${chainId}/address/${address}/balances_v2/?nft=true&match=${match}`;
    }

    const answerCov = await this.fetchCov(path);
    // console.log(path, answerCov);

    const tokensJson = answerCov?.data?.items[0]?.nft_data || [];
    // console.log(answerCov?.data?.items[0]);
    // console.log(tokensJson[0]);
    // console.log("OpenNfts.listTokensFromCovalent nbTokens", tokensJson.length);

    for (let index = 0; index < tokensJson.length; index++) {
      const _token = tokensJson[index];
      let token = {};
      const metadata = _token.external_data || (await this.fetchJson(_token.token_url));
      token.tokenID = _token.token_id;
      token.owner = _token.owner || "";
      token.contract = this.smartContract.address;
      this.addTokenMetadata(token, metadata);

      tokens.push(token);
    }

    // console.log("OpenNfts.listTokensFromCovalent", tokens);

    return tokens;
  }

  async listTokensFromTheGraph(_owner, _limit = 10) {
    let tokens = [];

    const smartContractAddress = this.smartContract.address.toLowerCase();
    const whereOwner = _owner ? `where: { owner: "${_owner.toLowerCase()}" }` : "";
    const query = `{
      tokenContract( id: "${smartContractAddress}" ) {
        tokens( first:${_limit} ${whereOwner} ) {
          id
          owner{
            id
          }
          tokenID
          tokenURI
          name
          description
          image
          metadata
        }
      }
    }`;
    console.log(query);
    const answerGQL = await this.fetchGQL(this.subgraph.url, query);
    const tokensJson = answerGQL?.tokenContract?.tokens || [];
    console.log(tokensJson[0]);
    // console.log("OpenNfts.listTokensFromTheGraph nbTokens", tokensJson.length);

    for (let index = 0; index < tokensJson.length; index++) {
      const token = tokensJson[index];
      let metadata;
      try {
        metadata = token.metadata && JSON.parse(token.metadata);
      } catch (e) {
        console.error("OpenNfts.listTokensFromTheGraph ERROR", e);
      }
      if (!metadata) {
        metadata = await this.fetchJson(token.tokenURI);
      }
      token.owner = token.owner?.id || "";
      token.contract = this.smartContract.address;
      this.addTokenMetadata(token, metadata);

      tokens.push(token);
    }

    console.log("OpenNfts.listTokensFromTheGraph", tokens.length);
    // console.log("OpenNfts.listTokensFromTheGraph", tokens);
    return tokens;
  }

  async listTokens(_owner, _limit = 10) {
    const tokens = [];

    let tokenList;

    if (this.subgraph?.url) tokenList = await this.listTokensFromTheGraph(_owner);
    else {
      tokenList = await this.listTokensFromCovalent(_owner);
    }
    // if (this.supportsEnumerable) {
    //   tokenList = await this.listTokensFromContract(_owner);
    // }

    if (tokenList) {
      let nbTokens = 0;
      tokenList.sort((a, b) => b.tokenID - a.tokenID);
      tokenList.forEach((_token) => {
        // console.log("OpenNfts.listTokens", _token);

        if (++nbTokens <= _limit) {
          let cid = _token.metadata?.cid;
          if (!cid) {
            const img = _token.image;
            if (img) {
              const cid1 = img.match(/^ipfs:\/\/(.*)$/i);
              const cid2 = img.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
              cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
              // console.log('cid token#' + _token.tokenID, cid, '<=', img);
            }
          }
          _token.cid = cid;
          tokens.push(_token);
        }
      });
    }

    console.log("OpenNfts.listTokens", tokens.length);
    // console.log("OpenNfts.listTokens", tokens);
    return tokens;
  }

  async listContractsFromCovalent(_owner) {
    let contracts = [];
    const chainId = parseInt(this.configNetwork.chainId);
    const path =
      `/${chainId}/address/${_owner}/balances_v2/?` +
      `nft=true&no-nft-fetch=true&` +
      `match={supports_erc:{$elemmatch:"erc721"}}`;

    const answerCov = await this.fetchCov(path);
    // console.log(path, answerCov);

    const contractsJson = answerCov?.data?.items || [];
    // console.log(contractsJson[0]);
    // console.log("OpenNfts.listContractsFromCovalent nbContracts", contractsJson.length);

    for (let index = 0; index < contractsJson.length; index++) {
      const contract = contractsJson[index];
      contracts.push({
        address: contract.contract_address,
        name: contract.contract_name,
        symbol: contract.contract_ticker_symbol,
        totalSupply: contract.balance
      });
    }

    console.log("OpenNfts.listContractsFromCovalent nbContracts ERC721", contracts.length);
    // console.log("OpenNfts.listContractsFromCovalent", contracts);

    return contracts;
  }

  async listContractsFromTheGraph(_owner) {
    let contracts = [];

    if (_owner) {
      const owner = _owner.toLowerCase();
      const query = `
        {
          ownerPerTokenContracts(
            where: {
              owner: "${owner}"
              }
          ) {
            contract {
              id
              name
              symbol
            }
            numTokens
          }
        }
    `;
      const answerGQL = await this.fetchGQL(this.subgraph?.url, query);
      const smartContracts = answerGQL?.ownerPerTokenContracts || [];
      // console.log(smartContracts[0]);

      for (let index = 0; index < smartContracts.length; index++) {
        const smartContractResponse = smartContracts[index];
        const smartContract = smartContractResponse.contract;
        contracts[index] = {
          address: smartContract.id,
          name: smartContract.name,
          symbol: smartContract.symbol,
          totalSupply: smartContractResponse.numTokens
        };
      }
    }
    // console.log("OpenNfts.listcontractsFromTheGraph", contracts);
    return contracts;
  }

  async listContracts(_owner) {
    let contracts;

    if (this.subgraph?.url) contracts = await this.listContractsFromTheGraph(_owner);
    else {
      contracts = await this.listContractsFromCovalent(_owner);
    }
    return contracts;
  }

  async Mint(_signer, _urlJson) {
    const address = await _signer.getAddress();

    console.log("OpenNfts.Mint", _urlJson, address, this.smartContract.address);

    //  const tx1 = await this.smartContract.connect(_signer).addUser(address, _urlJson);
    const tx1 = await this.smartContract.connect(_signer).mintNFT(address, _urlJson);
    console.log(`${this.configNetwork?.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    //console.log(res.events);

    const tokenID = res.events[0].args[2].toString();
    return { chainId: this.configNetwork.chainId, address: this.smartContract.address, tokenID };
  }
}

async function OpenNfts(chainId, contract_address) {
  const openNfts = new ClassOpenNfts(chainId, contract_address);
  if (openNfts.okConfig) await openNfts.initialize();
  return openNfts;
}

export default OpenNfts;
