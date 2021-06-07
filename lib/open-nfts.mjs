import { ethers } from "ethers";
import { configNetworks, configContracts, abis, getProvider } from "./config.mjs";

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
  async getDefaultContract() {
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
      configNetworks.find((_network) => _network.chainName === config.defaultChain);

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
      console.error("Wrong network !", this.configContract.network, this.configNetwork.chainName);
    }
  }

  async initialize() {
    // Check contract
    const checkContract = new ethers.Contract(this.configContract.address, abis["ERC165"], this.provider);

    const waitCheck0 = checkContract.supportsInterface("0xffffffff"); // FALSE
    const waitCheck1 = checkContract.supportsInterface("0x01ffc9a7"); // ERC165
    const waitCheck2 = checkContract.supportsInterface("0x80ac58cd"); // ERC721
    const [check0, check1, check2] = await Promise.all([waitCheck0, waitCheck1, waitCheck2]);

    // checkContract ok
    if (!check0 && check1 && check2) {
      let abi = abis["ERC721"];

      const waitMetadata = checkContract.supportsInterface("0x5b5e139f");
      const waitEnumerable = checkContract.supportsInterface("0x780e9d63");
      // const waitVersion0 = checkContract.supportsInterface("0x4b68d431");
      // const waitVersion1 = checkContract.supportsInterface("0xeacabe14");
      [
        // this._version0,
        // this._version1
        this.supportsMetadata,
        this.supportsEnumerable
      ] = await Promise.all([
        // waitVersion0,
        // waitVersion1,
        waitMetadata,
        waitEnumerable
      ]);

      if (this.supportsMetadata) abi = abi.concat(abis["ERC721Metadata"]);
      if (this.supportsEnumerable) abi = abi.concat(abis["ERC721Enumerable"]);
      // if (this._version0) abi = abi.concat(abis["KREDEUMv0"]);
      // if (this._version1) abi = abi.concat(abis["KREDEUMv1"]);
      abi = abi.concat(abis["KREDEUMv1"]);

      // console.log("contract abi", abi);
      this.smartContract = new ethers.Contract(this.configContract.address, abi, this.provider);
      this.ok = true;
    }
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
    console.log(`OpenNfts.fetchGQL\n${_url}\n${_query}`);

    const config = { method: "POST", body: JSON.stringify({ query: _query }) };
    const answerGQL = await this.fetchJson(_url, config);
    console.log(answerGQL);

    if (answerGQL.errors) console.error("OpenNfts.fetchJson ERROR", answerGQL.errors);
    return answerGQL.data;
  }

  async getToken(_owner, _index) {
    const token = {};
    try {
      token.tokenID = (await this.smartContract.tokenOfOwnerByIndex(_owner, _index)).toString();
      token.ownerOf = await this.smartContract.ownerOf(token.tokenID);
      token.contract = this.smartContract.address;
      if (await this.supportsEnumerable) {
      }

      if (await this.supportsMetadata) {
        token.tokenURI = await this.smartContract.tokenURI(token.tokenID);
        token.metadata = await this.fetchJson(token.tokenURI);

        token.name = token.metadata.name;
        token.description = token.metadata.description;
        token.image = token.metadata.image;
      }
    } catch (e) {
      console.error("OpenNfts.getToken ERROR", e);
    }
    // console.log("OpenNfts.getToken #" + token?.tokenID, token);
    return token;
  }

  async listTokensFromContract(_owner) {
    let tokens = [];

    if (_owner) {
      try {
        const nbTokens = (await this.smartContract.balanceOf(_owner)).toNumber();
        // console.log("listTokensFromContract balanceOf(_owner)", nbTokens);

        for (let index = 0; index < nbTokens; index++) {
          tokens[index] = await this.getToken(_owner, index);
        }
      } catch (e) {
        console.error("OpenNfts listContract ERROR", e);
      }
    }

    return tokens;
  }

  async listTokensFromTheGraph(_owner) {
    let tokens = [];

    if (_owner) {
      const ownerOf = _owner.toLowerCase();
      const smartContractAddress = this.smartContract.address.toLowerCase();
      // owner: "${ownerOf}"
      const query = `
          {
            ownerPerTokenContracts(
              where: {
                contract: "${smartContractAddress}"
              }
            )  
            {
              contract {
                id
                tokens (first: 99) {
                  id
                  tokenID
                  tokenURI
                  name
                  description
                  image
                  metadata
                  owner{
                    id
                  }
                }
              }
              numTokens
            }
          }
    `;
      // console.log(query);
      const answerGQL = await this.fetchGQL(this.subgraphUrl, query);
      const respTokens = answerGQL?.ownerPerTokenContracts[0]?.contract.tokens || [];
      console.log(respTokens[0]);

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
    }
    // console.log("OpenNfts.listTokensFromTheGraph", tokens);
    return tokens;
  }

  async listTokens(_owner) {
    const tokens = new Map();

    if (_owner) {
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
    }

    // console.log("tokenList", tokenList);
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
