import type { Collection, Nft } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchCov, fetchGQL } from "./kfetch";
import { collectionGetContract } from "./kcollection-get";
import { nftGetFromContract, nftGetMetadata } from "./knft-get";

import { getNetwork, getChecksumAddress, getSubgraphUrl, getCovalent, nftUrl3 } from "./kconfig";

const LIMIT = 10;

const nftsListFromCovalent = async (
  chainId: number,
  collection: Collection,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log(
  //   "listNFTnftsListFromCovalentsFromTheGraph",
  //   chainId,
  //   collection.address,
  //   _owner,
  //   _limit
  // );
  // console.log("nftsListFromTheGraph", chainId, collection.address, _owner, _limit);

  const nfts: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network && collection && _owner) {
    const match = `{contract_address:"${getChecksumAddress(collection.address)}"}`;
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
          collection: getChecksumAddress(collection.address),
          tokenID: _token.token_id,
          tokenURI: _token.token_url,
          metadata: _token.external_data,
          owner: getChecksumAddress(_token.owner || _owner),
          minter: getChecksumAddress(_token.original_owner),
          nid: nftUrl3(chainId, collection.address, _token.token_id)
        };
        // console.log("nftsListFromCovalent nid", nft.nid, nft);
        nfts.set(nft.nid, nft);
      }
    }
  }
  // console.log("nftsListFromCovalent", nfts.length);
  // console.log("nftsListFromCovalent", nfts);

  return nfts;
};

const nftsListFromTheGraph = async (
  chainId: number,
  collection: Collection,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log("nftsListFromTheGraph", chainId, collection.address, _owner, _limit);

  const nfts: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network && collection) {
    const collectionAddress = collection.address.toLowerCase();
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
    // console.log("nftsListFromTheGraph nbTokens", nftsJson.length);
    // console.log(nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, _limit); index++) {
      const _token = nftsJson[index];

      const nft = {
        chainId,
        collection: getChecksumAddress(collection.address),
        tokenID: _token.tokenID,
        tokenURI: _token.tokenURI,
        owner: getChecksumAddress(_token.owner?.id),
        nid: nftUrl3(chainId, collection.address, _token.tokenID)
        // metadata: _token.metadata && JSON.parse(_token.metadata),
        // name: _token.name,
        // description: _token.description,
        // image: _token.image
      };
      // console.log("nftsListFromTheGraph nid", nft.nid, nft);
      nfts.set(nft.nid, nft);
    }
  }
  // console.log("nftsListFromTheGraph", nfts.length);
  // console.log("nftsListFromTheGraph", nfts);
  return nfts;
};

const nftsListFromContract = async (
  chainId: number,
  collection: Collection,
  _provider: Provider,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log("nftsListFromContract", chainId, collection.address, _owner, _limit);

  const nfts: Map<string, Nft> = new Map();

  if (chainId && collection) {
    try {
      const contract = await collectionGetContract(chainId, collection, _provider);

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
          const nft = await nftGetFromContract(chainId, contract, index, _owner);
          // console.log("nftsListFromContract nid", nft.nid, nft);
          nfts.set(nft.nid || "", nft);
        }
      }
    } catch (e) {
      console.error("nftsListFromContract ERROR", e);
    }
  }
  // console.log("nftsListFromContract", nfts);
  return nfts;
};

const nftsListTokenIds = async (
  chainId: number,
  collection: Collection,
  _owner?: string,
  _limit: number = LIMIT,
  _provider?: Provider
): Promise<Map<string, Nft>> => {
  // console.log("nftsListTokenIds", chainId, collection.address, _owner, _limit);

  let nftsTokenIds: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network) {
    nftsTokenIds = await nftsListFromContract(chainId, collection, _provider, _owner, _limit);
    if (nftsTokenIds.size === 0) {
      if (getSubgraphUrl(chainId)) {
        nftsTokenIds = await nftsListFromTheGraph(chainId, collection, _owner, _limit);
      } else if (getCovalent(chainId)) {
        nftsTokenIds = await nftsListFromCovalent(chainId, collection, _owner, _limit);
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

  // console.log(`nftsListTokenIds from ${collection}`, nftsTokenIds);
  return nftsTokenIds;
};

const nftsListWithMetadata = async (
  chainId: number,
  collection: Collection,
  nfts: Map<string, Nft>,
  _owner?: string,
  _limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  const nftsWithMetadata: Map<string, Nft> = new Map();

  const nftsFromIds = [...nfts.values()];

  for (let index = 0; index < Math.min(nftsFromIds.length, _limit); index++) {
    const nft = await nftGetMetadata(chainId, nftsFromIds[index], collection);
    // console.log("nftsListWithMetadata nid", nft.nid, nft);
    nftsWithMetadata.set(nft.nid || "", nft);
  }

  // console.log(`nftsListWithMetadata from ${collection}`, nftsWithMetadata);
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

const nftsListFromCache = (): Map<string, Nft> => {
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

const nftsList = async (
  chainId: number,
  collection: Collection,
  _owner?: string,
  _limit: number = LIMIT,
  _provider?: Provider
): Promise<Map<string, Nft>> => {
  // console.log("nftsList", chainId, collection, _owner, _limit);

  const nftsTokenIds: Map<string, Nft> = await nftsListTokenIds(
    chainId,
    collection,
    _owner,
    _limit,
    _provider
  );
  const nftsWithMetadata: Map<string, Nft> = await nftsListWithMetadata(
    chainId,
    collection,
    nftsTokenIds,
    _owner,
    _limit
  );

  // console.log("nftsList", nftsWithMetadata);

  return nftsWithMetadata;
};

export {
  nftsList,
  nftsListTokenIds,
  nftsListWithMetadata,
  nftsListFromCache,
  nftsListFromContract,
  nftsListFromCovalent,
  nftsListFromTheGraph,
  clearCache
};
