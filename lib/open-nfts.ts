import { ethers, utils, Signer, BigNumber } from "ethers";
import {
  abis,
  getNetwork,
  getProvider,
  getSubgraphUrl,
  getCovalent,
  nftUrl,
  nftsUrl
} from "./kconfig";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchCov, fetchGQL, fetchJson } from "./kfetch";
import type { Network, Contract } from "./kconfig";
import type { NftMetadata, NftData } from "./ktypes";

const LIMIT = 99;

async function getOpenNFTs(chainId: string, _contract: string): Promise<any> {
  console.log(`getOpenNFTs ${chainId} ${_contract}`);

  let smartcontract: any;
  const provider = getProvider(getNetwork(chainId));

  try {
    const checkContract = new ethers.Contract(_contract, abis.ERC165, provider);
    let abi = abis.ERC721;

    const waitMetadata = checkContract.supportsInterface("0x5b5e139f");
    const waitEnumerable = checkContract.supportsInterface("0x780e9d63");
    const [supportsMetadata, supportsEnumerable] = await Promise.all([
      waitMetadata,
      waitEnumerable
    ]);
    if (supportsMetadata) abi = abi.concat(abis.ERC721Metadata);
    if (supportsEnumerable) abi = abi.concat(abis.ERC721Enumerable);
    abi = abi.concat(abis.KredeumV2);

    smartcontract = new ethers.Contract(_contract, abi, provider);
  } catch (e) {
    console.error(`ERROR getOpenNFTs ${_contract}\n`, e);
  }

  return smartcontract;
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

function cidExtract(_uri: string): string {
  let cid: string = "";
  if (_uri) {
    const cid1 = _uri.match(/^ipfs:\/\/(.*)$/i);
    const cid2 = _uri.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
    cid = (cid1 && cid1[1]) || (cid2 && cid2[1]) || "";
  }
  // console.log('cid' cid, '<=', _image);
  return cid;
}

function addNftDataSync(chainId: string, _contract: string, _token: NftData): NftData {
  console.log(`addNftDataSync ${chainId} ${_contract}`, _token);

  const network = getNetwork(chainId);
  const contract = _token.contract || _contract || "";

  const chainName = _token.chainName || network?.chainName || "";
  const metadata: NftMetadata = _token.metadata || {};
  const image = _token.image || metadata.image || "";
  const tokenID = _token.tokenID || "";

  const nftData: NftData = {
    tokenID: _token.tokenID || "",
    tokenURI: _token.tokenURI || "",

    contract,
    chainId,
    chainName,

    // metadata,
    image,

    name: _token.name || metadata.name || "",
    description: _token.description || metadata.description || "",

    creator: _token.creator || metadata.creator || "",
    minter: _token.minter || metadata.minter || "",
    owner: _token.owner || metadata.owner || "",

    cid: _token.cid || metadata.cid || cidExtract(_token.tokenURI) || cidExtract(image) || "",
    nid: _token.nid || nftUrl(chainId, contract, tokenID)
  };

  console.log("addNftDataSync", _token, "=>", nftData);
  return nftData;
}

async function addNftData(chainId: string, _contract: string, _token: NftData): Promise<NftData> {
  console.log("_token", _token);
  console.log("_token.tokenURI", _token.tokenURI);
  _token.metadata =
    _token.metadata || _token.tokenURI
      ? ((await fetchJson(_token.tokenURI)) as NftMetadata) || {}
      : {};
  console.log("_token.metadata", _token.metadata);
  return addNftDataSync(chainId, _contract, _token);
}

async function getNFTFromContract(
  chainId: string,
  _smartcontract: any,
  _index: number,
  _owner?: string
): Promise<NftData> {
  let tokenID, tokenURI, owner;

  try {
    if (_owner) {
      tokenID = (await _smartcontract.tokenOfOwnerByIndex(_owner, _index)).toString();
      owner = _owner;
    } else {
      tokenID = (await _smartcontract.tokenByIndex(_index)).toString();
      owner = await _smartcontract.ownerOf(tokenID);
    }
    if (_smartcontract.tokenURI) {
      tokenURI = await _smartcontract.tokenURI(tokenID);
    }
  } catch (e) {
    console.error("OpenNFTs.getNFTFromContract ERROR", e, tokenID, tokenURI, owner);
  }
  console.log("getNFTFromContract #" + tokenID, tokenURI, owner);
  return { tokenID, tokenURI, owner, chainId };
}

async function listNFTsFromContract(
  chainId: string,
  _contract: string,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Array<NftData>> {
  console.log("listNFTsFromContract", chainId, _contract, _owner, _limit);

  let nfts = [];
  const network = getNetwork(chainId);

  if (network && _contract) {
    try {
      const smartcontract = await getOpenNFTs(chainId, _contract);
      if (smartcontract) {
        const nbTokens = _owner
          ? (await smartcontract.balanceOf(_owner)).toNumber()
          : smartcontract.totalSupply
          ? (await smartcontract.totalSupply()).toNumber()
          : "0";

        console.log("listNFTsFromContract totalSupply", nbTokens);

        for (let index = 0; index < Math.min(nbTokens, _limit); index++) {
          nfts[index] = await getNFTFromContract(chainId, smartcontract, index, _owner);
          console.log("listNFTsFromContract item", index + 1, nfts[index]);
        }
      }
    } catch (e) {
      console.error("OpenNFTs.listNFTsFromContract ERROR", e);
    }
  }

  // console.log("listNFTsFromContract", nfts.length);
  console.log("listNFTsFromContract", nfts);
  return nfts;
}

async function listNFTsFromCovalent(
  chainId: string,
  _contract: string,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Array<NftData>> {
  console.log(
    "OpenNFTs.listNFTlistNFTsFromCovalentsFromTheGraph",
    chainId,
    _contract,
    _owner,
    _limit
  );

  let nfts: Array<NftData> = [];
  const network = getNetwork(chainId);

  if (network && _contract && _owner) {
    const match = `{contract_address:"${utils.getAddress(_contract)}"}`;
    const path =
      `/${chainId}/address/${_owner}/balances_v2/` +
      `?nft=true&no-nft-fetch=false` +
      // `&limit=${_limit}` + // not working with match...
      `&match=${encodeURIComponent(match)}`;

    console.log("listNFTsFromCovalent", path);
    const answerCov = await fetchCov(path);
    console.log("listNFTsFromCovalent", answerCov);

    if (answerCov.error) {
      console.error("answerCov.error", answerCov.error);
    } else {
      const nftsJson = answerCov?.data?.items[0]?.nft_data || [];
      // console.log(answerCov?.data?.items[0]);
      // console.log(nftsJson[0]);
      // console.log(nftsJson);
      // console.log("listNFTsFromCovalent nbTokens", nftsJson.length);

      for (let index = 0, n = 0; index < Math.min(nftsJson.length, _limit); index++) {
        const _token = nftsJson[index];

        if (n < _limit) {
          nfts.push({
            chainId,
            tokenID: _token.token_id,
            tokenURI: _token.token_url,
            owner: _token.owner || _owner || "",
            metadata: _token.external_data,
            minter: _token.original_owner || ""
          });
        }
      }
    }
  }
  // console.log("listNFTsFromCovalent", nfts.length);
  // console.log("listNFTsFromCovalent", nfts);

  return nfts;
}

async function listNFTsFromTheGraph(
  chainId: string,
  _contract: string,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Array<NftData>> {
  console.log("listNFTsFromTheGraph", chainId, _contract, _owner, _limit);

  let nfts: Array<NftData> = [];
  const network = getNetwork(chainId);

  if (network && _contract) {
    const contractAddress = _contract.toLowerCase();
    const whereOwner = _owner ? `where: { owner: "${_owner.toLowerCase()}" }` : "";

    const query = `{
      tokenContract( id: "${contractAddress}" ) {
        tokens( first:${_limit} ${whereOwner} ) {
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

    console.log(query);
    const answerGQL = await fetchGQL(getSubgraphUrl(chainId) || "", query);
    const nftsJson = answerGQL?.tokenContract?.nfts || [];
    console.log(nftsJson[0]);
    // console.log("listNFTsFromTheGraph nbTokens", nftsJson.length);
    // console.log(nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, _limit); index++) {
      const _token = nftsJson[index];

      nfts.push({
        chainId,
        tokenID: _token.tokenID,
        tokenURI: _token.tokenURI,
        owner: _token.owner?.id || ""
        // metadata: _token.metadata && JSON.parse(_token.metadata),
        // name: _token.name,
        // description: _token.description,
        // image: _token.image
      });
    }
  }
  // console.log("listNFTsFromTheGraph", nfts.length);
  // console.log("listNFTsFromTheGraph", nfts);
  return nfts;
}

async function listNFTs(
  chainId: string,
  _contract: string,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Array<NftData>> {
  console.log("listNFTs", chainId, _contract, _owner, _limit);

  let nfts: Array<NftData> = [];
  const network = getNetwork(chainId);

  if (network) {
    nfts = (await listNFTsFromContract(chainId, _contract, _owner, _limit)) as Array<NftData>;
    if (nfts.length === 0) {
      if (getSubgraphUrl(chainId)) {
        nfts = (await listNFTsFromTheGraph(chainId, _contract, _owner, _limit)) as Array<NftData>;
      } else if (getCovalent(chainId)) {
        nfts = (await listNFTsFromCovalent(chainId, _contract, _owner, _limit)) as Array<NftData>;
      } else {
        console.error("No NFTs found:-(");
      }
    }

    if (nfts.length) {
      nfts.sort((a, b) => (BigNumber.from(b.tokenID).gt(BigNumber.from(a.tokenID)) ? 1 : -1));
      for (let index = 0; index < Math.min(nfts.length, _limit); index++) {
        console.log(`OpenNFTs.listNFTs addNftData`, index, nfts[index]);
        const token: NftData = await addNftData(chainId, _contract, nfts[index]);
        if (!_owner || utils.getAddress(token.owner) === utils.getAddress(_owner)) {
          nfts[index] = token;
        }

        if (typeof localStorage !== "undefined") {
          const tokenJson = JSON.stringify(token, null, 2);
          localStorage.setItem(token.nid, tokenJson);
        }
      }
    }
  }
  // console.log("listNFTs", nfts.length);
  console.log(`OpenNFTs.listNFTs from ${_contract}`, nfts);
  return nfts;
}

function listNFTsFromCache(
  chainId: string,
  _contract?: string,
  _limit: number = LIMIT
): Array<NftData> {
  console.log("listNFTsFromCache", chainId, _contract, _limit);

  const nfts: Array<NftData> = [];
  const { chainName } = getNetwork(chainId);

  if (chainName) {
    for (let index = 0; index < Math.min(localStorage.length, _limit); index++) {
      const key = localStorage.key(index);
      if (key?.startsWith(nftUrl(chainId, _contract || "", "", ""))) {
        const json = localStorage.getItem(key);
        json && nfts.push(JSON.parse(json));
      }
    }
    nfts.sort((a, b) => (BigNumber.from(b.tokenID) > BigNumber.from(a.tokenID) ? 1 : 0));
  }

  console.log(`OpenNFTs.listNFTsFromCache ${nfts.length}`);
  return nfts;
}

async function Mint(
  chainId: string,
  _contract: string,
  _minter: Signer,
  _urlJson: string
): Promise<NftData | undefined> {
  const minter = await _minter.getAddress();
  console.log("OpenNFTs.Mint", chainId, _contract, minter, _urlJson);

  const network = getNetwork(chainId);

  let token: NftData | undefined;
  const smartcontract = await getOpenNFTs(chainId, _contract);

  if (smartcontract) {
    // const txOptions = {
    //   maxPriorityFeePerGas: utils.parseUnits("50", "gwei"),
    //   maxFeePerGas: utils.parseUnits("50", "gwei"),
    //   type: 2
    // };

    const tx1 = await smartcontract.connect(_minter).mintNFT(minter, _urlJson);
    console.log(`${network.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    //console.log(res.events);

    if (res.events) {
      token = await addNftData(chainId, minter, {
        chainId,
        tokenID: res.events[0]?.args[2]?.toString(),
        tokenURI: _urlJson,
        creator: minter,
        minter: minter,
        owner: minter
      });
    }
  }

  return token;
}

export {
  Mint,
  listNFTs,
  listNFTsFromCache,
  listNFTsFromContract,
  listNFTsFromCovalent,
  listNFTsFromTheGraph,
  addNftData,
  getOpenNFTs
};
