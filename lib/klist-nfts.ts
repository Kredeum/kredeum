import { Contract, Signer } from "ethers";
import { fetchCov, fetchGQL, fetchJson } from "./kfetch";
import {
  abis,
  getNetwork,
  getChecksumAddress,
  getProvider,
  getSubgraphUrl,
  getCovalent,
  nftUrl3
} from "./kconfig";

import type { ERC165Upgradeable } from "../solidity/artifacts/types/ERC165Upgradeable";
import type { OpenNFTs } from "../solidity/artifacts/types/OpenNFTs";
import type { Nft } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

const LIMIT = 10;

const getCollection = async (
  chainId: number,
  collection: string,
  _providerOrSigner?: Provider | Signer
): Promise<OpenNFTs | undefined> => {
  // console.log(`getCollection ${collection}`);

  let contract: OpenNFTs | undefined = undefined;
  _providerOrSigner = _providerOrSigner || getProvider(chainId);

  try {
    const checkContract = new Contract(
      collection,
      abis.ERC165,
      _providerOrSigner
    ) as ERC165Upgradeable;

    if (checkContract) {
      const waitOpenNFTsV2: Promise<boolean> = checkContract.supportsInterface("0xd94a1db2");
      const waitMetadata: Promise<boolean> = checkContract.supportsInterface("0x5b5e139f");
      const waitEnumerable: Promise<boolean> = checkContract.supportsInterface("0x780e9d63");
      const [supportsOpenNFTsV2, supportsMetadata, supportsEnumerable] = await Promise.all([
        waitOpenNFTsV2,
        waitMetadata,
        waitEnumerable
      ]);
      let abi = abis.ERC721;
      if (supportsMetadata) abi = abi.concat(abis.ERC721Metadata);
      if (supportsEnumerable) abi = abi.concat(abis.ERC721Enumerable);
      if (supportsOpenNFTsV2) abi = abi.concat(abis.OpenNFTsV2);

      contract = new Contract(collection, abi, _providerOrSigner) as OpenNFTs;
    }
  } catch (e) {
    console.error(`ERROR getCollection : ${chainId} ${collection}\n`, e);
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
// tokenURI    = "https://ipfs.io/ipfs/bafaaaaa...aaaa"
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
  let cid = "";
  if (_uri) {
    const cid1 = _uri.match(/^ipfs:\/\/(.*)$/i);
    const cid2 = _uri.match(/^.*\/ipfs\/([^/]*)(.*)$/i);
    cid = (cid1 && cid1[1]) || (cid2 && cid2[1]) || "";
  }
  // console.log('cid' cid, '<=', _image);
  return cid;
};

const addNftMetadataSync = (chainId: number, _token: Nft, _collection?: string): Nft => {
  // console.log(`addNftMetadataSync ${chainId} ${_collection}`, _token);
  let nftData: Nft;

  if (chainId && _token) {
    type Metadata = {
      name?: string;
      description?: string;
      creator?: string;
      minter?: string;
      owner?: string;
      image?: string;
      cid?: string;
    };

    const network = getNetwork(chainId);
    const collection: string = getChecksumAddress(_token.collection || _collection);

    const chainName: string = _token.chainName || network?.chainName || "";
    const metadata: Metadata = (_token.metadata as Metadata) || {};
    const image: string = _token.image || metadata.image || "";
    const tokenID: string = _token.tokenID || "";

    nftData = {
      tokenID: _token.tokenID || "",
      tokenURI: _token.tokenURI || "",

      collection,
      chainId,
      chainName,

      metadata,
      image,

      name: _token.name || metadata.name || "",
      description: _token.description || metadata.description || "",

      creator: getChecksumAddress(_token.creator || metadata.creator),
      minter: getChecksumAddress(_token.minter || metadata.minter),
      owner: getChecksumAddress(_token.owner || metadata.owner),

      cid: _token.cid || metadata.cid || cidExtract(image) || "",
      cidJson: _token.cidJson || cidExtract(_token.tokenURI) || "",
      nid: _token.nid || nftUrl3(chainId, collection, tokenID)
    };
    // STORE in cache if exists
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(nftData.nid || "", JSON.stringify(nftData, null, 2));
    }
  }

  // console.log("addNftMetadataSync", _token, "=>", nftData);
  return nftData;
};

const addNftMetadata = async (chainId: number, _token: Nft, _collection?: string): Promise<Nft> => {
  // console.log("addNftMetadata chainId _token", chainId, _token);
  let nftDataSync: Nft;

  if (chainId && _token) {
    const metadataUrl = (_token.metadata as string) || _token.tokenURI;

    if (metadataUrl) {
      const metadataAnswer = await fetchJson(metadataUrl);

      if (metadataAnswer.error) {
        console.error("metadataAnswer ERROR", metadataAnswer.error);
      } else {
        _token.metadata = metadataAnswer;
      }
    }
    nftDataSync = addNftMetadataSync(chainId, _token, _collection);
  }
  // console.log("addNftMetadata nftDataSync", nftDataSync);
  return nftDataSync;
};

const getNFTFromContract = async (
  chainId: number,
  _smartcontract: OpenNFTs,
  _index: number,
  _owner?: string
): Promise<Nft> => {
  let tokenID = "";
  let tokenURI = "";
  let owner = "";
  let collection = "";
  let contractName = "";

  // console.log("getNFTFromContract", chainId, _index, _owner);

  try {
    collection = getChecksumAddress(_smartcontract.address);
    // console.log("getNFTFromContract collection", collection);

    if (_smartcontract.name) {
      contractName = await _smartcontract.name();
      // console.log("getNFTFromContract contractName", contractName);
    }
    if (_owner) {
      if (_smartcontract.tokenOfOwnerByIndex) {
        tokenID = (await _smartcontract.tokenOfOwnerByIndex(_owner, _index)).toString();
        // console.log("getNFTFromContract tokenOfOwnerByIndex tokenID", tokenID);
        owner = _owner;
      }
    } else if (_smartcontract.tokenByIndex) {
      tokenID = (await _smartcontract.tokenByIndex(_index)).toString();
      // console.log("getNFTFromContract tokenByIndex tokenID", tokenID);
      owner = await _smartcontract.ownerOf(tokenID);
    }
    if (_smartcontract.tokenURI) {
      tokenURI = await _smartcontract.tokenURI(tokenID);
      // console.log("getNFTFromContract tokenURI", tokenURI);
    }
  } catch (e) {
    console.error(
      "getNFTFromContract ERROR",
      e,
      tokenID,
      tokenURI,
      owner,
      collection,
      contractName,
      chainId,
      _index,
      _owner
    );
  }
  const nid = nftUrl3(chainId, collection, tokenID);
  // console.log("getNFTFromContract #" + tokenID, chainId, collection, tokenURI, owner);
  return { chainId, collection, contractName, tokenID, tokenURI, owner, nid };
};

const listNFTsFromCovalent = async (
  chainId: number,
  collection: string,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log(
  //   "listNFTlistNFTsFromCovalentsFromTheGraph",
  //   chainId,
  //   collection,
  //   _owner,
  //   _limit
  // );
  // console.log("listNFTsFromTheGraph", chainId, collection, _owner, _limit);

  const nfts: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network && collection && _owner) {
    const match = `{contract_address:"${getChecksumAddress(collection)}"}`;
    const path =
      `/${Number(chainId)}/address/${_owner}/balances_v2/` +
      "?nft=true&no-nft-fetch=false" +
      // `&limit=${_limit}` + // not working with match...
      `&match=${encodeURIComponent(match)}`;

    type NftsCov = {
      token_id: string;
      token_url: string;
      owner: string;
      external_data: string;
      original_owner: string;
    };
    type AnswerNftsCov = {
      items?: [nft_data: NftsCov];
    };
    const nftsJson: Array<NftsCov> = ((await fetchCov(path)) as AnswerNftsCov)?.items || [];

    for (let index = 0, n = 0; index < Math.min(nftsJson.length, _limit); index++) {
      const _token = nftsJson[index];

      if (n < _limit) {
        const nft = {
          chainId,
          collection: getChecksumAddress(collection),
          tokenID: _token.token_id,
          tokenURI: _token.token_url,
          metadata: _token.external_data,
          owner: getChecksumAddress(_token.owner || _owner),
          minter: getChecksumAddress(_token.original_owner),
          nid: nftUrl3(chainId, collection, _token.token_id)
        };
        // console.log("listNFTsFromCovalent nid", nft.nid, nft);
        nfts.set(nft.nid, nft);
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
): Promise<Map<string, Nft>> => {
  // console.log("listNFTsFromTheGraph", chainId, collection, _owner, _limit);

  const nfts: Map<string, Nft> = new Map();
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
    type NftsGQL = {
      tokenID: string;
      tokenURI: string;
      owner: { id: string };
    };
    type AnswerNftsGQL = {
      tokenContract: { nfts: Array<NftsGQL> };
    };
    // console.log(query);
    const answerGQL = (await fetchGQL(getSubgraphUrl(chainId) || "", query)) as AnswerNftsGQL;
    const nftsJson: Array<NftsGQL> = answerGQL?.tokenContract?.nfts || [];
    // console.log(nftsJson[0]);
    // console.log("listNFTsFromTheGraph nbTokens", nftsJson.length);
    // console.log(nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, _limit); index++) {
      const _token = nftsJson[index];

      const nft = {
        chainId,
        collection: getChecksumAddress(collection),
        tokenID: _token.tokenID,
        tokenURI: _token.tokenURI,
        owner: getChecksumAddress(_token.owner?.id),
        nid: nftUrl3(chainId, collection, _token.tokenID)
        // metadata: _token.metadata && JSON.parse(_token.metadata),
        // name: _token.name,
        // description: _token.description,
        // image: _token.image
      };
      // console.log("listNFTsFromTheGraph nid", nft.nid, nft);
      nfts.set(nft.nid, nft);
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
): Promise<Map<string, Nft>> => {
  // console.log("listNFTsFromContract", chainId, collection, _owner, _limit);

  const nfts: Map<string, Nft> = new Map();

  if (chainId && collection) {
    try {
      const contract = await getCollection(chainId, collection, _provider);
      if (contract) {
        let nbTokens = _limit;
        if (_owner) {
          nbTokens = Number(await contract.balanceOf(_owner));
        } else {
          if (contract.totalSupply) {
            nbTokens = Number(await contract.totalSupply());
          }
        }

        for (let index = 0; index < Math.min(nbTokens, _limit); index++) {
          const nft = await getNFTFromContract(chainId, contract, index, _owner);
          // console.log("listNFTsFromContract nid", nft.nid, nft);
          nfts.set(nft.nid || "", nft);
        }
      }
    } catch (e) {
      console.error("listNFTsFromContract ERROR", e);
    }
  }
  // console.log("listNFTsFromContract", nfts);
  return nfts;
};

const listNFTsTokenId = async (
  chainId: number,
  collection: string,
  _index: number,
  _owner?: string,
  _provider?: Provider
): Promise<Nft | undefined> => {
  // console.log("listNFTsTokenId", chainId, collection, _owner);

  let nft: Nft | undefined;

  if (chainId && collection) {
    const contract = await getCollection(chainId, collection, _provider);
    if (contract) {
      nft = await getNFTFromContract(chainId, contract, _index, _owner);
    }
  }
  return nft;
};

const listNFTsTokenIds = async (
  chainId: number,
  collection: string,
  _owner?: string,
  _limit: number = LIMIT,
  _provider?: Provider
): Promise<Map<string, Nft>> => {
  // console.log("listNFTs", chainId, collection, _owner, _limit);

  let nftsTokenIds: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network) {
    nftsTokenIds = await listNFTsFromContract(chainId, collection, _owner, _limit, _provider);
    if (nftsTokenIds.size === 0) {
      if (getSubgraphUrl(chainId)) {
        nftsTokenIds = await listNFTsFromTheGraph(chainId, collection, _owner, _limit);
      } else if (getCovalent(chainId)) {
        nftsTokenIds = await listNFTsFromCovalent(chainId, collection, _owner, _limit);
      } else {
        console.error("No NFTs found:-(");
      }
    }
  }

  // VERIFY owner, not needed ?
  // if (nftsTokenIds.length) {
  //   for (let index = 0; index < Math.min(nftsTokenIds.length, _limit); index++) {
  //     if (!_owner || getChecksumAddress(token.owner) === getChecksumAddress(_owner)) {
  //       nftsTokenIds[index] = token;
  //     }
  //   }
  // }
  // nftsTokenIds.sort((a, b) => (BigNumber.from(b.tokenID).gt(BigNumber.from(a.tokenID)) ? 1 : -1));

  // console.log(`listNFTsTokenIds from ${collection}`, nftsTokenIds);
  return nftsTokenIds;
};

const listNFTsWithMetadata = async (
  chainId: number,
  collection: string,
  nfts: Map<string, Nft>,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  const nftsWithMetadata: Map<string, Nft> = new Map();

  const nftsFromIds = [...nfts.values()];

  for (let index = 0; index < Math.min(nftsFromIds.length, _limit); index++) {
    const nft = await addNftMetadata(chainId, nftsFromIds[index], collection);
    // console.log("listNFTsWithMetadata nid", nft.nid, nft);
    nftsWithMetadata.set(nft.nid || "", nft);
  }

  // console.log(`listNFTsWithMetadata from ${collection}`, nftsWithMetadata);
  return nftsWithMetadata;
};

const clearCache = (chainId: number, collectionAddress = ""): void => {
  const chainName = getNetwork(chainId)?.chainName;
  if (chainName && collectionAddress) {
    const indexMax = localStorage.length;
    const keys: Array<string> = [];

    for (let index = 0; index < indexMax; index++) {
      const key = localStorage.key(index);
      const sig = `${chainName}/${collectionAddress}`;

      // Clear NFTs from the specified collection
      // and list of collections ?
      // if (key?.includes(sig) || key?.includes("nfts://")) {
      if (key?.includes(sig)) {
        keys.push(key);
      }
    }
    keys.forEach((_key) => localStorage.removeItem(_key));
  } else {
    localStorage.clear();
  }
};

const listNFTsFromCache = (): Map<string, Nft> => {
  const nfts: Map<string, Nft> = new Map();

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nft://")) {
      const json = localStorage.getItem(key);

      if (json) {
        nfts.set(key, JSON.parse(json) as Nft);
      }
    }
  }
  return nfts;
};

const listNFTs = async (
  chainId: number,
  collection: string,
  _owner?: string,
  _limit: number = LIMIT,
  _provider?: Provider
): Promise<Map<string, Nft>> => {
  // console.log("listNFTs", chainId, collection, _owner, _limit);

  const nftsTokenIds: Map<string, Nft> = await listNFTsTokenIds(
    chainId,
    collection,
    _owner,
    _limit,
    _provider
  );
  const nftsWithMetadata: Map<string, Nft> = await listNFTsWithMetadata(
    chainId,
    collection,
    nftsTokenIds,
    _owner,
    _limit
  );

  return nftsWithMetadata;
};

export {
  listNFTs,
  listNFTsTokenId,
  listNFTsTokenIds,
  listNFTsWithMetadata,
  listNFTsFromCache,
  listNFTsFromContract,
  listNFTsFromCovalent,
  listNFTsFromTheGraph,
  clearCache,
  addNftMetadata,
  cidExtract,
  getCollection
};
