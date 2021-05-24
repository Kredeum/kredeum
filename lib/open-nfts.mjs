import { ethers } from "ethers";
import contracts from "../config/contracts.json";
import networks from "../config/networks.json";

class OpenNfts {
  network;
  contract;

  get network() {
    return this.network;
  }

  get contract() {
    return this.contract;
  }

  constructor(chainId) {
    this.network = networks.find((nw) => Number(nw.chainId) === Number(chainId));

    if (this.network) {
      this.network.KRE = contracts.v1.instances[this.network.chainName][0].address;
      if (this.network.KRE) {
        const provider = new ethers.providers.JsonRpcProvider(this.network.rpcUrls[0]);
        this.contract = new ethers.Contract(this.network.KRE, contracts.v1.abi, provider);
      }
    }
  }

  async fetchJson(uri, config = {}) {
    let json = {};
    try {
      json = await (await fetch(uri, config)).json();
    } catch (e) {
      console.error("OpenNfts.fetchJson ERROR", uri, e);
    }
    return json;
  }

  async getToken(index) {
    const nft = {};
    try {
      nft.tokenId = (await this.contract.tokenByIndex(index)).toString();
      nft.ownerOf = await this.contract.ownerOf(nft.tokenId);
      nft.tokenURI = await this.contract.tokenURI(nft.tokenId);
      nft.tokenJson = await this.fetchJson(nft.tokenURI);
      nft.contract = this.contract.address;
    } catch (e) {
      console.error("nft.getToken ERROR", e, nft);
    }
    // console.log("nft.getToken #" + nft?.tokenId, nft);
    return nft;
  }

  async listTheGraph() {
    let tokens = [];

    const query = `{ tokens(first: 999) {id owner {id} uri json} }`;

    const config = { method: "POST", body: JSON.stringify({ query }) };

    const answerGQL = (await this.fetchJson(this.network.openNfts.subgraphUrl, config)).data;
    // console.log("nft.listTheGraph answerGQL", answerGQL);

    tokens = await Promise.all(
      answerGQL?.tokens.map(async (token) => {
        // console.log("token", token);

        const nft = {};
        const [tokenId, contract] = token.id.split(":");
        nft.tokenId = Number(tokenId).toString();
        nft.contract = contract;
        nft.ownerOf = token.owner.id;
        nft.tokenURI = token.uri;
        // nft.tokenJson = await this.fetchJson(nft.tokenURI);
        try {
          if (token.json) {
            nft.tokenJson = JSON.parse(token.json);
          } else {
            nft.tokenJson = await this.fetchJson(nft.tokenURI);
          }
        } catch (e) {
          console.error(e);
        }
        // console.log("nft", nft);
        return nft;
      })
    );

    console.log("3 nft.listTheGraph", tokens);
    return tokens;
  }

  async listContract() {
    const totalSupply = (await this.contract.totalSupply()).toNumber();
    // console.log("listContract totalSupply", totalSupply);

    const nftPromises = [];
    for (let index = 0; index < totalSupply; index++) {
      nftPromises[totalSupply - 1 - index] = this.getToken(index);
    }
    const tokens = await Promise.all(nftPromises);

    return tokens;
  }

  async list() {
    const nftList = new Map();
    let tokens;

    if (this.network?.openNfts?.subgraphUrl) tokens = await this.listTheGraph();
    else tokens = await this.listContract();
    //console.log('tokens', tokens);

    tokens.forEach((nfti) => {
      let cid = nfti.tokenJson?.cid;
      if (!cid) {
        const img = nfti.tokenJson?.image;
        if (img) {
          const cid1 = img.match(/^ipfs:\/\/(.*)$/i);
          const cid2 = img.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
          cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
          // console.log('cid nft#' + nfti.tokenId, cid, '<=', img);
        }
      }
      if (cid) {
        nfti.cid = cid;
        nftList.set(nfti.tokenId + ":" + nfti.contract, nfti);
      }
    });

    //console.log('nftList', nftList);
    return nftList;
  }

  async Mint(signer, urlJson) {
    const address = await signer.getAddress();

    console.log("nft.Mint", address, urlJson);
    console.log(this.contract.address);

    //  const tx1 = await this.contract.connect(signer).addUser(address, urlJson);
    const tx1 = await this.contract.connect(signer).mintNFT(address, urlJson);
    console.log(`${this.network?.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    //console.log(res.events);

    const tokenId = res.events[0].args[2].toString();
    return tokenId;
  }
}

export default OpenNfts;
