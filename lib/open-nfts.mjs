import { ethers } from "ethers";
import networks from "../config/networks.json";
import contracts from "../config/contracts.json";
import abis from "../config/abis.json";

class OpenNfts {
  network;
  contract;
  subgraphUrl;
  supportsMetadata;
  supportsEnumerable;
  // _version0;
  // _version1;

  // get network() {
  //   return this.network;
  // }
  get contract() {
    return this.contract;
  }
  get supportsEnumerable() {
    return this.supportsEnumerable;
  }
  get supportsMetadata() {
    return this.supportsMetadata;
  }
  constructor() {}

  async init(_chainId, _contract_address) {
    let ret = false;
    const network =
      networks.find((_network) => Number(_network.chainId) === Number(_chainId)) ||
      networks.find((_network) => _network.chainName === "mumbai");
    console.log("NETWORK", network);

    let contractConfig;
    if (_contract_address) {
      contractConfig = contracts.find(
        (_contract) => _contract.address.toLowerCase() === _contract_address.toLowerCase()
      ) || {
        address: _contract_address,
        network: network?.chainName
      };
    } else {
      contractConfig = contracts.find((_contract) => _contract.network === network?.chainName);
    }

    console.log("contractConfig", contractConfig);
    console.log("network", network);
    if (contractConfig?.network && contractConfig?.network === network?.chainName) {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrls[0]);

      this.network = network;
      this.subgraphUrl = contractConfig.subgraphUrl || network.subgraphUrl || false;

      // check contract
      const contract = new ethers.Contract(contractConfig.address, abis["ERC165"], provider);

      const waitCheck0 = contract.supportsInterface("0xffffffff"); // FALSE
      const waitCheck1 = contract.supportsInterface("0x01ffc9a7"); // ERC165
      const waitCheck2 = contract.supportsInterface("0x80ac58cd"); // ERC721
      const [check0, check1, check2] = await Promise.all([waitCheck0, waitCheck1, waitCheck2]);

      // contract ok
      if (!check0 && check1 && check2) {
        let abi = abis["ERC721"];

        const waitMetadata = contract.supportsInterface("0x5b5e139f");
        const waitEnumerable = contract.supportsInterface("0x780e9d63");
        // const waitVersion0 = contract.supportsInterface("0x4b68d431");
        // const waitVersion1 = contract.supportsInterface("0xeacabe14");
        [
          // this._version0,
          // this._version1
          this.supportsMetadata,
          this._enumerable
        ] = await Promise.all([
          // waitVersion0,
          // waitVersion1,
          waitMetadata,
          waitEnumerable
        ]);

        if (this.supportsMetadata) abi = abi.concat(abis["ERC721Metadata"]);
        if (this._enumerable) abi = abi.concat(abis["ERC721Enumerable"]);
        // if (this._version0) abi = abi.concat(abis["KREDEUMv0"]);
        // if (this._version1) abi = abi.concat(abis["KREDEUMv1"]);
        abi = abi.concat(abis["KREDEUMv1"]);

        // console.log("contract abi", abi);
        this.contract = new ethers.Contract(contract.address, abi, provider);

        ret = true;
      }
    } else {
      console.error("Wrong network !", contractConfig.network, network.chainName);
    }
    return ret;
  }

  async fetchJson(_tokenURI, _config = {}) {
    let json = {};
    try {
      json = await (await fetch(_tokenURI, _config)).json();
    } catch (e) {
      console.error("OpenNfts.fetchJson ERROR", _tokenURI, e);
    }
    return json;
  }

  async getToken(_owner, _index) {
    const token = {};
    try {
      token.tokenID = (await this.contract.tokenOfOwnerByIndex(_owner, _index)).toString();
      token.ownerOf = await this.contract.ownerOf(token.tokenID);
      token.contract = this.contract.address;
      if (await this.supportsEnumerable) {
      }

      if (await this.supportsMetadata) {
        token.tokenURI = await this.contract.tokenURI(token.tokenID);
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

  async listTokensFromTheGraph(_owner) {
    let tokens = [];

    if (_owner) {
      const ownerOf = _owner.toLowerCase();
      const contract = this.contract.address.toLowerCase();
      // owner: "${ownerOf}"
      const query = `
          {
            ownerPerTokenContracts(
              where: {
                contract: "${contract}"
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
                }
              }
              numTokens
            }
          }
    `;
      const config = { method: "POST", body: JSON.stringify({ query }) };
      console.log(`OpenNfts.listTokensFromTheGraph\n${this.subgraphUrl}${query}`);

      const answerGQL = await this.fetchJson(this.subgraphUrl, config);
      // console.log(answerGQL);

      const respTokens = answerGQL.data.ownerPerTokenContracts[0].contract.tokens;
      // console.log(respTokens[0]);

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
          ownerOf: ownerOf,
          metadata: metadata || {},
          name: token.name || metadata.name || "",
          description: token.description || metadata.description || "",
          image: token.image || metadata.image || "",
          contract: contract
        };
      }
    }
    // console.log("OpenNfts.listTokensFromTheGraph", tokens);
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
      const config = { method: "POST", body: JSON.stringify({ query }) };
      const answerGQL = await this.fetchJson(this.subgraphUrl, config);
      // console.log(answerGQL);

      const respContracts = answerGQL.data.ownerPerTokenContracts;
      // console.log(respContracts[0]);

      for (let index = 0; index < respContracts.length; index++) {
        const contract = respContracts[index];
        contracts[index] = {
          id: contract.contract.id,
          name: contract.contract.name,
          symbol: contract.contract.symbol,
          numTokens: contract.numTokens
        };
      }
    }
    // console.log("OpenNfts.listcontractsFromTheGraph", contracts);
    return contracts;
  }

  async listTokensFromContract(_owner) {
    let tokens = [];

    if (_owner) {
      try {
        const nbTokens = (await this.contract.balanceOf(_owner)).toNumber();
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

  async listTokens(_owner) {
    const tokenList = new Map();

    if (_owner) {
      let tokens;

      if (this.subgraphUrl) tokens = await this.listTokensFromTheGraph(_owner);
      else if (await this.supportsEnumerable) tokens = await this.listTokensFromContract(_owner);

      if (tokens) {
        tokens.sort((a, b) => b.tokenID - a.tokenID);
        tokens.forEach((_token) => {
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
          tokenList.set(_token.tokenID + ":" + _token.contract, _token);
        });
      } else {
        console.error("No way to explore NFT contract: no network subgraph and contract not enumerable");
      }
    }

    // console.log("tokenList", tokenList);
    return tokenList;
  }

  async Mint(_signer, _urlJson) {
    const address = await _signer.getAddress();

    console.log("OpenNfts.Mint", address, _urlJson);
    console.log(this.contract.address);

    //  const tx1 = await this.contract.connect(_signer).addUser(address, _urlJson);
    const tx1 = await this.contract.connect(_signer).mintNFT(address, _urlJson);
    console.log(`${this.network?.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    //console.log(res.events);

    const tokenID = res.events[0].args[2].toString();
    return { chainId: this.network.chainId, address: this.contract.address, tokenID };
  }
}

export default OpenNfts;
