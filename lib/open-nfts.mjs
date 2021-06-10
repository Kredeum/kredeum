import { ethers } from "ethers";
import { configNetworks, configContracts, abis, getProvider, defaultChain } from "./config.mjs";

class ClassOpenNfts {
  #configNetwork;
  #configContract;
  #supportsMetadata;
  #supportsEnumerable;
  // _version0;
  // _version1;
  #provider;
  #okConfig;
  #subgraphUrl;
  smartContract;
  ok;

  supportsSubgraph() {
    return this.subgraphUrl;
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
      // SET subgraphUrl
      this.subgraphUrl = this.configContract.subgraphUrl || this.configNetwork.subgraphUrl || false;
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

  async getToken(_owner, _index) {
    const token = {};
    try {
      token.tokenID = _owner
        ? (await this.smartContract.tokenOfOwnerByIndex(_owner, _index)).toString()
        : (await this.smartContract.tokenByIndex(_index)).toString();
      token.ownerOf = await this.smartContract.ownerOf(token.tokenID);
      token.contract = this.smartContract.address;

      if (this.supportsMetadata) {
        token.tokenURI = await this.smartContract.tokenURI(token.tokenID);
        token.metadata = await this.fetchJson(token.tokenURI);

        token.name = token.metadata.name;
        token.description = token.metadata.description;
        token.image = token.metadata.image;
      }
    } catch (e) {
      console.error("OpenNfts.getToken ERROR", e, token);
    }
    // console.log("OpenNfts.getToken #" + token?.tokenID, token);
    return token;
  }

  async listTokensFromContract(_owner) {
    let tokens = [];

    try {
      const nbTokens = _owner
        ? (await this.smartContract.balanceOf(_owner)).toNumber()
        : (await this.smartContract.totalSupply()).toNumber();
      // console.log("OpenNfts.listTokensFromContract nbTokens", nbTokens);

      for (let index = 0; index < nbTokens; index++) {
        // console.log("OpenNfts.listTokensFromContract", index + 1);
        tokens[index] = await this.getToken(_owner, index);
      }
    } catch (e) {
      console.error("OpenNfts.listTokensFromContract ERROR", e);
    }

    console.log("OpenNfts.listTokensFromContract", tokens.length);
    // console.log("OpenNfts.listTokensFromContract", tokens);
    return tokens;
  }

  async listTokensFromTheGraph(_owner) {
    let tokens = [];

    const smartContractAddress = this.smartContract.address.toLowerCase();
    const whereOwner = _owner ? `where: { owner: "${_owner.toLowerCase()}" }` : "";
    const query = `{
      tokenContract( id: "${smartContractAddress}" ) {
        tokens( first:99 ${whereOwner} ) {
          id
          tokenID
          tokenURI
          name
          description
          image
          metadata
        }
      }
    }`;
    // console.log(query);
    const answerGQL = await this.fetchGQL(this.subgraphUrl, query);
    const respTokens = answerGQL?.tokenContract?.tokens || [];
    // console.log(respTokens[0]);
    // console.log("OpenNfts.listTokensFromTheGraph nbTokens", respTokens.length);

    for (let index = 0; index < respTokens.length; index++) {
      const token = respTokens[index];
      let metadata;
      try {
        metadata = token.metadata && JSON.parse(token.metadata);
      } catch (e) {
        console.error("OpenNfts.listTokensFromTheGraph ERROR", e);
      }
      if (!metadata) {
        metadata = await this.fetchJson(token.tokenURI);
      }
      tokens[index] = {
        id: token.id,
        tokenID: token.tokenID,
        tokenURI: token.tokenURI,
        ownerOf: token.owner?.id || "",
        metadata: metadata || {},
        name: token.name || metadata.name || "",
        description: token.description || metadata.description || "",
        image: token.image || metadata.image || "",
        contract: this.smartContract.address
      };
    }

    console.log("OpenNfts.listTokensFromTheGraph", tokens.length);
    // console.log("OpenNfts.listTokensFromTheGraph", tokens);
    return tokens;
  }

  async listTokens(_owner) {
    const tokens = new Map();

    let tokenList;

    if (this.subgraphUrl) tokenList = await this.listTokensFromTheGraph(_owner);
    else if (this.supportsEnumerable) {
      tokenList = await this.listTokensFromContract(_owner);
    } else {
      console.error("No way to explore NFT contract: no network subgraph and contract not enumerable");
    }

    if (tokenList) {
      tokenList.sort((a, b) => b.tokenID - a.tokenID);
      tokenList.forEach((_token) => {
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
        tokens.set(_token.tokenID + ":" + _token.contract, _token);
      });
    }

    console.log("OpenNfts.listTokens", tokens.size);
    // console.log("OpenNfts.listTokens", tokens);
    return tokens;
  }

  async listContracts(_owner) {
    let contracts = [];

    if (_owner) {
      const ownerOf = _owner.toLowerCase();
      const query = `
        {
          ownerPerTokenContracts(
            where: {
              owner: "${ownerOf}"
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
      const answerGQL = await this.fetchGQL(this.subgraphUrl, query);
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
