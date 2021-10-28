import { ethers, Contract, utils, Signer, BigNumber } from "ethers";
import { abis, getNetwork, getProvider, getSubgraphUrl, getCovalent, nftUrl } from "./kconfig";

import type { OpenNFTs } from "../solidity/artifacts/types/OpenNFTs";
import type {
  Provider,
  TransactionResponse,
  TransactionReceipt
} from "@ethersproject/abstract-provider";

import { fetchCov, fetchGQL, fetchJson } from "./kfetch";
import type { Nft } from "./ktypes";

const LIMIT = 10;

const getOpenNFTs = async (
  chainId: number,
  collection: string,
  _providerOrSigner?: Provider | Signer
): Promise<OpenNFTs> => {
  // console.log(`getOpenNFTs ${collection}`);

  let contract: OpenNFTs;
  _providerOrSigner = _providerOrSigner || getProvider(chainId);

  try {
    const checkContract = new Contract(collection, abis.ERC165, _providerOrSigner);
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

    contract = new Contract(collection, abi, _providerOrSigner) as OpenNFTs;
  } catch (e) {
    console.error(`ERROR getOpenNFTs ${collection}\n`, e);
  }

  return contract;
};

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

const cidExtract = (_uri: string): string => {
  let cid: string = "";
  if (_uri) {
    const cid1 = _uri.match(/^ipfs:\/\/(.*)$/i);
    const cid2 = _uri.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
    cid = (cid1 && cid1[1]) || (cid2 && cid2[1]) || "";
  }
  // console.log('cid' cid, '<=', _image);
  return cid;
};

const addNftDataSync = (chainId: number, _collection: string, _token: Nft): Nft => {
  // console.log(`addNftDataSync ${chainId} ${_collection}`, _token);

  const network = getNetwork(chainId);
  const collection = _token.collection || _collection || "";

  const chainName = _token.chainName || network?.chainName || "";
  const metadata = _token.metadata || {};
  const image = _token.image || metadata.image || "";
  const tokenID = _token.tokenID || "";

  const nftData: Nft = {
    tokenID: _token.tokenID || "",
    tokenURI: _token.tokenURI || "",

    collection,
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
    nid: _token.nid || nftUrl(chainId, collection, tokenID)
  };

  // console.log("addNftDataSync", _token, "=>", nftData);
  return nftData;
};

const addNftData = async (chainId: number, _collection: string, _token: Nft): Promise<Nft> => {
  // console.log("_token", _token);
  // console.log("_token.tokenURI", _token.tokenURI);
  _token.metadata =
    _token.metadata || _token.tokenURI ? (await fetchJson(_token.tokenURI)) || {} : {};
  // console.log("_token.metadata", _token.metadata);
  return addNftDataSync(chainId, _collection, _token);
};

const getNFTFromContract = async (
  chainId: number,
  _smartcontract: any,
  _index: number,
  _owner?: string
): Promise<Nft> => {
  let tokenID, tokenURI, owner, collection, contractName;

  try {
    collection = _smartcontract.address;
    contractName = await _smartcontract.name();
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
  console.log("getNFTFromContract #" + tokenID, chainId, collection, tokenURI, owner);
  return { chainId, collection, contractName, tokenID, tokenURI, owner };
};

const listNFTsFromCovalent = async (
  chainId: number,
  collection: string,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Array<Nft>> => {
  // console.log(
  //   "OpenNFTs.listNFTlistNFTsFromCovalentsFromTheGraph",
  //   chainId,
  //   collection,
  //   _owner,
  //   _limit
  // );

  let nfts: Array<Nft> = [];
  const network = getNetwork(chainId);

  if (network && collection && _owner) {
    const match = `{contract_address:"${utils.getAddress(collection)}"}`;
    const path =
      `/${Number(chainId)}/address/${_owner}/balances_v2/` +
      `?nft=true&no-nft-fetch=false` +
      // `&limit=${_limit}` + // not working with match...
      `&match=${encodeURIComponent(match)}`;

    // console.log("listNFTsFromCovalent", path);
    const answerCov = await fetchCov(path);
    // console.log("listNFTsFromCovalent", answerCov);

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
            collection,
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
};

const listNFTsFromTheGraph = async (
  chainId: number,
  collection: string,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Array<Nft>> => {
  // console.log("listNFTsFromTheGraph", chainId, collection, _owner, _limit);

  let nfts: Array<Nft> = [];
  const network = getNetwork(chainId);

  if (network && collection) {
    const collectionAddress = collection.toLowerCase();
    const whereOwner = _owner ? `where: { owner: "${_owner.toLowerCase()}" }` : "";

    const query = `{
      tokenContract( id: "${collectionAddress}" ) {
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
    // console.log(nftsJson[0]);
    // console.log("listNFTsFromTheGraph nbTokens", nftsJson.length);
    // console.log(nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, _limit); index++) {
      const _token = nftsJson[index];

      nfts.push({
        chainId,
        collection,
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
};

const listNFTsFromContract = async (
  chainId: number,
  collection: string,
  _owner?: string,
  _limit: number = LIMIT,
  _provider?: Provider
): Promise<Array<Nft>> => {
  console.log("listNFTsFromContract", chainId, collection, _owner, _limit);

  let nfts = [];

  if (chainId && collection) {
    try {
      const contract = await getOpenNFTs(chainId, collection, _provider);
      if (contract) {
        const nbTokens = _owner
          ? (await contract.balanceOf(_owner)).toNumber()
          : contract.totalSupply
          ? (await contract.totalSupply()).toNumber()
          : 0;

        // console.log("listNFTsFromContract totalSupply", nbTokens);

        for (let index = 0; index < Math.min(nbTokens, _limit); index++) {
          nfts[index] = await getNFTFromContract(chainId, contract, index, _owner);
          console.log("listNFTsFromContract item", index + 1, chainId, nfts[index]);
        }
      }
    } catch (e) {
      console.error("OpenNFTs.listNFTsFromContract ERROR", e);
    }
  }

  // console.log("listNFTsFromContract", nfts.length);
  // console.log("listNFTsFromContract", nfts);
  return nfts;
};

const listNFTs = async (
  chainId: number,
  collection: string,
  _owner?: string,
  _limit: number = LIMIT,
  _provider?: Provider
): Promise<Array<Nft>> => {
  console.log("listNFTs", chainId, collection, _owner, _limit);

  let nfts: Array<Nft> = [];
  const network = getNetwork(chainId);

  if (network) {
    nfts = (await listNFTsFromContract(
      chainId,
      collection,
      _owner,
      _limit,
      _provider
    )) as Array<Nft>;
    if (nfts.length === 0) {
      if (getSubgraphUrl(chainId)) {
        nfts = (await listNFTsFromTheGraph(chainId, collection, _owner, _limit)) as Array<Nft>;
      } else if (getCovalent(chainId)) {
        nfts = (await listNFTsFromCovalent(chainId, collection, _owner, _limit)) as Array<Nft>;
      } else {
        console.error("No NFTs found:-(");
      }
    }

    if (nfts.length) {
      nfts.sort((a, b) => (BigNumber.from(b.tokenID).gt(BigNumber.from(a.tokenID)) ? 1 : -1));
      for (let index = 0; index < Math.min(nfts.length, _limit); index++) {
        // console.log(`OpenNFTs.listNFTs addNftData`, index, nfts[index]);
        const token: Nft = await addNftData(chainId, collection, nfts[index]);
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
  // console.log(`OpenNFTs.listNFTs from ${collection}`, nfts);
  return nfts;
};

const listNFTsFromCache = (
  chainId: number,
  collection?: string,
  _owner?: string,
  _limit: number = LIMIT
): Array<Nft> => {
  // console.log("listNFTsFromCache", chainId, collection, _limit);

  const nfts: Array<Nft> = [];
  const { chainName } = getNetwork(chainId);

  if (chainName) {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key?.startsWith(nftUrl(chainId, collection || "", "", ""))) {
        const json = localStorage.getItem(key);
        const nft = JSON.parse(json);
        if (!_owner || utils.getAddress(nft?.owner) == utils.getAddress(_owner)) {
          nfts.push(nft);
        }
        if (nfts.length >= _limit) break;
      }
    }
    nfts.sort((a, b) => (BigNumber.from(b.tokenID) > BigNumber.from(a.tokenID) ? 1 : 0));
  }

  // console.log(`OpenNFTs.listNFTsFromCache ${nfts.length}`);
  return nfts;
};

const MintResponse = async (
  chainId: number,
  collection: string,
  _urlJson: string,
  _minter: Signer
): Promise<TransactionResponse> => {
  let txResp: TransactionResponse;

  const minter = await _minter.getAddress();
  // console.log("OpenNFTs.Mint", chainId, collection, _urlJson, minter);

  const network = getNetwork(chainId);

  let token: Nft | undefined;
  const contract = await getOpenNFTs(chainId, collection);

  if (contract) {
    // const txOptions = {
    //   maxPriorityFeePerGas: utils.parseUnits("50", "gwei"),
    //   maxFeePerGas: utils.parseUnits("50", "gwei"),
    //   type: 2
    // };

    txResp = await contract.connect(_minter).mintNFT(minter, _urlJson);
    console.log(`${network.blockExplorerUrls[0]}/tx/` + txResp.hash);
  }

  return txResp;
};

const MintReceipt = async (txResp: TransactionResponse): Promise<TransactionReceipt> => {
  return await txResp.wait();
};

const MintTokenID = (txReceipt: TransactionReceipt): string => {
  let tokenID: string = "";

  console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = [
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenID);"
    ];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(txReceipt.logs[0]);
    ({ tokenID } = log.args);
  }

  // const tokenID = res.events[0].args[2].toString();
  return tokenID;
};

const MintNft = async (
  chainId: number,
  collection: string,
  tokenID: string,
  urlJson: string,
  minterAddress: string
): Promise<Nft> => {
  const nft = await addNftData(chainId, collection, {
    chainId,
    collection,
    tokenID,
    tokenURI: urlJson,
    creator: minterAddress,
    minter: minterAddress,
    owner: minterAddress
  });
  return nft;
};

const Mint = async (
  chainId: number,
  collection: string,
  urlJson: string,
  minter: Signer
): Promise<Nft | undefined> => {
  const txResp = await MintResponse(chainId, collection, urlJson, minter);
  const txReceipt = await MintReceipt(txResp);
  const tokenID = MintTokenID(txReceipt);
  const nft = await MintNft(chainId, collection, tokenID, urlJson, await minter.getAddress());
  return nft;
};

export {
  MintResponse,
  MintReceipt,
  MintTokenID,
  MintNft,
  Mint,
  listNFTs,
  listNFTsFromCache,
  listNFTsFromContract,
  listNFTsFromCovalent,
  listNFTsFromTheGraph,
  addNftData,
  getOpenNFTs
};
