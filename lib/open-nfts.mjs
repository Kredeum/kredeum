import { ContractFactory } from "ethers";
import { ethers } from "ethers";
import { networks, configContracts, abis, getProvider } from "./config.mjs";

const LIMIT = 99;

class OpenNFTs {
  network; // network config
  provider; // network provider
  address; // contract address
  contract; // callable contract
  owner; // optional NFT owner
  limit = LIMIT; // limit query results

  contractFactory;

  supportsMetadata;
  supportsEnumerable;
  // _version0;
  // _version1;

  constructor() {}

  // SET owner
  setOwner(_owner) {
    this.owner = _owner;
  }

  // SET limit
  setLimit(_limit) {
    this.limit = _limit;
  }

  // GET contract address with chain name
  getChainContractAddress() {
    return `${this.network?.chainName}/${this.address}`;
  }

  // GET explorer
  getExplorer() {
    return this.network?.blockExplorerUrls[0] || "";
  }

  // GET OpenSea
  getOpenSeaUrl() {
    return this.network?.openSea || "";
  }

  // SET contract
  _setContract(_chainId, _address) {
    const newNetwork = networks.find((_network) => Number(_network.chainId) === Number(_chainId));

    if (newNetwork && newNetwork !== this.network) {
      this.network = newNetwork;
      this.provider = getProvider(newNetwork);
    }

    if (_address) {
      this.address = _address;
    } else {
      const configContract = configContracts.find(
        (_contract) => _contract.network === this.network?.chainName
      );
      this.address = configContract?.address;
    }
  }

  async initContract(_chainId, _address) {
    console.log("initContract", _chainId, _address);

    this._setContract(_chainId, _address);

    const checkContract = new ethers.Contract(this.address, abis["ERC165"], this.provider);

    let abi = abis["ERC721"];

    const waitMetadata = checkContract.supportsInterface("0x5b5e139f");
    const waitEnumerable = checkContract.supportsInterface("0x780e9d63");
    [this.supportsMetadata, this.supportsEnumerable] = await Promise.all([
      waitMetadata,
      waitEnumerable
    ]);

    if (this.supportsMetadata) abi = abi.concat(abis["ERC721Metadata"]);
    if (this.supportsEnumerable) abi = abi.concat(abis["ERC721Enumerable"]);
    abi = abi.concat(abis["KredeumV2"]);

    this.contract = new ethers.Contract(this.address, abi, this.provider);

    if (!this.contractFactory) {
      this.contractFactory = new ethers.Contract(
        "0xf783B0aad3120cB14De9f5C785561e1a0b985920",
        ["function clone()"],
        this.provider
      );
    }

    const ret = {
      network: this.network?.chainName,
      contract: this.address,
      openSea: this.getOpenSeaUrl(),
      explorer: this.getExplorer()
    };
    console.log("initContract", ret);
    return ret;
  }

  getSubgraphUrl() {
    return this.network.subgraph?.active && this.network.subgraph?.url;
  }

  getCovalent() {
    return this.network.covalent?.active;
  }

  async fetchJson(_url, _config = {}) {
    let json = {};
    if (_url) {
      try {
        const res = await fetch(_url, _config);
        // console.log(res);
        json = await res.json();
      } catch (e) {
        console.error("OpenNFTs.fetchJson ERROR", e, _url, json);
      }
    } else {
      console.error("OpenNFTs.fetchJson URL not defined");
    }
    return json;
  }

  async fetchGQL(_url, _query) {
    console.log(`OpenNFTs.fetchGQL\n${_url}\n${_query}`);

    const config = { method: "POST", body: JSON.stringify({ query: _query }) };
    const answerGQL = await this.fetchJson(_url, config);
    console.log(answerGQL);

    if (answerGQL.errors) console.error("OpenNFTs.fetchGQL ERROR", answerGQL.errors);
    return answerGQL.data;
  }

  async fetchCov(_path) {
    const loginPass = "ckey_b4886e3ef70d409594349eff5c6:";
    const url = `https://api.covalenthq.com/v1${_path}&key=${loginPass}`;
    const config = {
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(loginPass)}`,
        Accept: "application/json"
      }
    };
    const json = await this.fetchJson(url, config);
    // console.log(url, "\n", json);
    return json;
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
  // NID = NFT ID = "0xaaa...aaa_nnn@chain"
  // CID = IPDS ID = "bax..."
  // PID = WP IP = "123"
  ////////////////////////////////////////////////////////

  cidExtract(_uri) {
    let cid;
    if (_uri) {
      const cid1 = _uri.match(/^ipfs:\/\/(.*)$/i);
      const cid2 = _uri.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
      cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
    }
    // console.log('cid' cid, '<=', _image);
    return cid;
  }

  addTokenDataSync(_token) {
    const contract = _token.contract || this.address || "";
    const chainName = _token.chainName || this.network.chainName || "";
    const metadata = _token.metadata || {};
    const image = _token.image || metadata.image || "";

    return {
      tokenID: _token.tokenID || "",
      tokenURI: _token.tokenURI || "",

      contract,
      chainName,

      // metadata,
      image,

      name: _token.name || metadata.name || "",
      description: _token.description || metadata.description || "",

      creator: _token.creator || metadata.creator || "",
      minter: _token.minter || metadata.minter || "",
      owner: _token.owner || metadata.owner || "",

      cid:
        _token.cid ||
        metadata.cid ||
        this.cidExtract(_token.tokenURI) ||
        this.cidExtract(image) ||
        "",
      nid: _token.nid || `${chainName}/${contract?.toLowerCase()}/${_token.tokenID}`
    };
  }

  async addTokenData(_token) {
    _token.metadata = _token.metadata || (await this.fetchJson(_token.tokenURI)) || {};
    return this.addTokenDataSync(_token);
  }

  async getNFTFromContract(_index) {
    let tokenID, tokenURI, owner;

    try {
      if (this.owner) {
        tokenID = (await this.contract.tokenOfOwnerByIndex(this.owner, _index)).toString();
        owner = this.owner;
      } else {
        tokenID = (await this.contract.tokenByIndex(_index)).toString();
        owner = await this.contract.ownerOf(tokenID);
      }
      if (this.supportsMetadata) {
        tokenURI = await this.contract.tokenURI(tokenID);
      }
    } catch (e) {
      console.error("OpenNFTs.getNFTFromContract ERROR", e, tokenID, tokenURI, owner);
    }
    // console.log("OpenNFTs.getNFTFromContract #" + tokenID, tokenURI, owner);
    return { tokenID, tokenURI, owner };
  }

  async listNFTsFromContract() {
    console.log("OpenNFTs.listNFTsFromContract");

    let tokens = [];

    try {
      const nbTokens = this.owner
        ? (await this.contract.balanceOf(this.owner)).toNumber()
        : (await this.contract.totalSupply()).toNumber();
      // console.log("OpenNFTs.listNFTsFromContract totalSupply", nbTokens);

      for (let index = 0; index < Math.min(nbTokens, this.limit); index++) {
        tokens[index] = await this.getNFTFromContract(index);
        // console.log("OpenNFTs.listNFTsFromContract item", index + 1, tokens[index]);
      }
    } catch (e) {
      console.error("OpenNFTs.listNFTsFromContract ERROR", e);
    }

    // console.log("OpenNFTs.listNFTsFromContract", tokens.length);
    // console.log("OpenNFTs.listNFTsFromContract", tokens);
    return tokens;
  }

  async listNFTsFromCovalent() {
    console.log("OpenNFTs.listNFTsFromCovalent", this.owner, this.limit);

    let tokens = [];
    let path;
    const chainId = parseInt(this.network.chainId);
    const contract = this.address.toLowerCase();

    if (this.owner) {
      const match = `{contract_address:"${contract}"}`;
      path =
        `/${chainId}/address/${this.owner}/balances_v2/` +
        `?nft=true` +
        `&no-nft-fetch=false` +
        // `&limit=${this.limit}` + // not working with match...
        `&match=${encodeURIComponent(match)}`;

      console.log("listNFTsFromCovalent", path);
      const answerCov = await this.fetchCov(path);
      console.log("listNFTsFromCovalent", answerCov);

      if (answerCov.error) {
        console.error("answerCov.error", answerCov.error_message);
      } else {
        const tokensJson = answerCov?.data?.items[0]?.nft_data || [];
        // console.log(answerCov?.data?.items[0]);
        // console.log(tokensJson[0]);
        // console.log(tokensJson);
        // console.log("OpenNFTs.listNFTsFromCovalent nbTokens", tokensJson.length);

        for (let index = 0; index < Math.min(tokensJson.length, this.limit); index++) {
          const _token = tokensJson[index];

          tokens.push({
            tokenID: _token.token_id,
            tokenURI: _token.token_url,
            owner: _token.owner || this.owner || "",
            metadata: _token.external_data,
            minter: _token.original_owner || ""
          });
        }
      }
    }
    // console.log("OpenNFTs.listNFTsFromCovalent", tokens.length);
    // console.log("OpenNFTs.listNFTsFromCovalent", tokens);

    return tokens;
  }

  async listNFTsFromTheGraph() {
    console.log("OpenNFTs.listNFTsFromTheGraph", this.owner, this.limit);

    let tokens = [];

    const currentContractAddress = this.address.toLowerCase();
    const whereOwner = this.owner
      ? `where: 
    { owner: "${this.owner.toLowerCase()}" }`
      : "";
    const query = `{
      tokenContract( id: "${currentContractAddress}" ) {
        tokens( first:${this.limit} ${whereOwner} ) {
          id
          owner{
            id
          }
          tokenID
          tokenURI
        }
      }
    }`;
    // metadata
    // name
    // description
    // image

    // console.log(query);
    const answerGQL = await this.fetchGQL(this.getSubgraphUrl(), query);
    const tokensJson = answerGQL?.tokenContract?.tokens || [];
    // console.log(tokensJson[0]);
    // console.log("OpenNFTs.listNFTsFromTheGraph nbTokens", tokensJson.length);
    // console.log(tokensJson);

    for (let index = 0; index < tokensJson.length; index++) {
      const _token = tokensJson[index];

      tokens.push({
        tokenID: _token.tokenID,
        tokenURI: _token.tokenURI,
        owner: _token.owner?.id || ""
        // metadata: _token.metadata && JSON.parse(_token.metadata),
        // name: _token.name,
        // description: _token.description,
        // image: _token.image
      });
    }

    // console.log("OpenNFTs.listNFTsFromTheGraph", tokens.length);
    // console.log("OpenNFTs.listNFTsFromTheGraph", tokens);
    return tokens;
  }

  async listNFTs(_owner, _type) {
    console.log("OpenNFTs.listNFTs", _owner, _type, this);
    let tokens = [];

    switch (_type) {
      case "subgraph":
        tokens = await this.listNFTsFromTheGraph(this.owner, this.limit);
        break;
      case "covalent":
        tokens = await this.listNFTsFromCovalent(this.owner, this.limit);
        break;
      case "contracts":
        tokens = await this.listNFTsFromContract(this.owner, this.limit);
        break;
      default:
        if (this.getSubgraphUrl()) {
          tokens = await this.listNFTsFromTheGraph(this.owner, this.limit);
        } else if (this.getCovalent()) {
          tokens = await this.listNFTsFromCovalent(this.owner, this.limit);
        } else if (this.supportsEnumerable) {
          tokens = await this.listNFTsFromContract(this.owner, this.limit);
        } else {
          console.error("No way to list NFTs :-(");
        }
    }

    tokens.sort((a, b) => b.tokenID - a.tokenID);
    for (let index = 0; index < Math.min(tokens.length, this.limit); index++) {
      const token = await this.addTokenData(tokens[index]);
      if (_owner === "undefined" || token?.owner?.toLowerCase() === _owner?.toLowerCase()) {
        tokens[index] = token;
      }

      if (typeof localStorage !== "undefined") {
        const tokenJson = JSON.stringify(token, null, 2);
        localStorage.setItem(`nft://${token.nid}`, tokenJson);
      }
    }

    // console.log("OpenNFTs.listNFTs", tokens.length);
    // console.log("OpenNFTs.listNFTs", tokens);
    return tokens;
  }

  listNFTsFromCache(_owner) {
    const chainContract = this.getChainContractAddress()?.toLowerCase();
    console.log("OpenNFTs.listNFTsFromCache", _owner, chainContract);

    const tokens = [];

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key.startsWith("nft://") && key.includes(chainContract)) {
        const token = JSON.parse(localStorage.getItem(key));
        if (_owner === "undefined" || token?.owner?.toLowerCase() === _owner?.toLowerCase()) {
          tokens.push(token);
        }
      }
    }
    tokens.sort((a, b) => b.tokenID - a.tokenID);
    console.log("OpenNFTs.listNFTsFromCache", tokens.length);
    return tokens.length > 0 && tokens;
  }

  async listContractsFromCovalent() {
    let contracts = [];
    let path;

    if (this.owner) {
      const chainId = parseInt(this.network.chainId);
      const match = `{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}`;

      path =
        `/${chainId}/address/${this.owner}/balances_v2/` +
        `?nft=true` +
        `&no-nft-fetch=false` +
        `&match=${encodeURIComponent(match)}`;

      const answerCov = await this.fetchCov(path);
      // console.log(path, answerCov);

      const contractsJson = answerCov?.data?.items || [];
      // console.log(contractsJson[0]);
      // console.log("OpenNFTs.listContractsFromCovalent nbContracts", contractsJson.length);

      for (let index = 0; index < contractsJson.length; index++) {
        const contract = contractsJson[index];

        contracts.push({
          address: contract.contract_address,
          name: contract.contract_name,
          symbol: contract.contract_ticker_symbol,
          totalSupply: contract.balance
        });
      }
    }
    // console.log("OpenNFTs.listContractsFromCovalent nbContracts ERC721", contracts.length);
    // console.log("OpenNFTs.listContractsFromCovalent", contracts);

    return contracts;
  }

  async listContractsFromTheGraph() {
    console.log("OpenNFTs.listContractsFromTheGraph");
    let contracts = [];

    if (this.owner) {
      const owner = this.owner.toLowerCase();
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
      const answerGQL = await this.fetchGQL(this.getSubgraphUrl(), query);
      const currentContracts = answerGQL?.ownerPerTokenContracts || [];
      // console.log(currentContracts[0]);

      let index2 = 0;
      for (let index = 0; index < currentContracts.length; index++) {
        const currentContractResponse = currentContracts[index];
        const contract = currentContractResponse.contract;
        if (currentContractResponse.numTokens > 0) {
          contracts[index2] = {
            address: contract.id,
            name: contract.name,
            symbol: contract.symbol,
            totalSupply: Math.max(currentContractResponse.numTokens, 0).toString()
          };
          index2++;
        }
      }
    }
    // console.log("OpenNFTs.listcontractsFromTheGraph", contracts);
    return contracts;
  }

  listContractsFromConfig() {
    console.log("OpenNFTs.listContractsFromConfig");
    let contracts = configContracts.filter(
      (_contract) => _contract.network === this.network?.chainName
    );

    console.log("OpenNFTs.listContractsFromConfig", contracts);
    return contracts;
  }

  listContractsFromFactory() {
    console.log("OpenNFTs.listContractsFromFactory");
    const contracts = [];
    return contracts;
  }

  async listContracts() {
    console.log("OpenNFTs.listContracts");
    let contracts;

    contracts = await this.listContractsFromFactory();

    if (contracts.length === 0) {
      if (this.getSubgraphUrl()) {
        contracts = await this.listContractsFromTheGraph();
      } else if (this.getCovalent()) {
        contracts = await this.listContractsFromCovalent();
      } else {
        contracts = this.listContractsFromConfig();
      }
    }

    if (typeof localStorage !== "undefined") {
      console.log(contracts);
      contracts?.forEach((contract) => {
        localStorage.setItem(
          `nfts://${this.network.chainName}/${contract.address.toLowerCase()}`,
          JSON.stringify(contract, null, 2)
        );
      });
    }
    return contracts;
  }

  listContractsFromCache() {
    console.log("OpenNFTs.listContractsFromCache");
    const contracts = [];

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key.startsWith("nfts://")) {
        const contract = JSON.parse(localStorage.getItem(key));
        contracts.push(contract);
      }
    }
    return contracts;
  }

  async Clone(_signer) {
    const address = await _signer.getAddress();

    console.log("OpenNFTs.Clone", address, this.address);

    const tx1 = await this.contractFactory.connect(_signer).clone();
    console.log(`${this.network?.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const tx2 = await tx1.wait();
    console.log(tx2.status);
  }

  async Mint(_signer, _urlJson) {
    const address = await _signer.getAddress();

    console.log("OpenNFTs.Mint", _urlJson, address, this.address);

    //  const tx1 = await this.contract.connect(_signer).addUser(address, _urlJson);
    const tx1 = await this.contract.connect(_signer).mintNFT(address, _urlJson);
    console.log(`${this.network?.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    //console.log(res.events);

    const token = await this.addTokenData({
      tokenID: res.events[0]?.args[2]?.toString(),
      tokenURI: _urlJson,
      creator: address,
      minter: address,
      owner: address
    });

    return token;
  }
}

export default OpenNFTs;
