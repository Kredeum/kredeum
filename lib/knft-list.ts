import type { Collection, Nft } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchCov, fetchGQL } from "./kfetch";
import { collectionGetContract } from "./kcollection-get";
import { nftGetFromContractEnumerable, nftGetMetadata } from "./knft-get";

import { getNetwork, getChecksumAddress, getSubgraphUrl, getCovalent, nftUrl3 } from "./kconfig";

const LIMIT = 10;

const nftListFromCovalent = async (
  chainId: number,
  collection: Collection,
  owner?: string,
  limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  console.log("nftListFromCovalent", chainId, collection, owner, limit);

  const nfts: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network && collection && owner) {
    const match = `{contract_address:"${getChecksumAddress(collection.address)}"}`;
    const path =
      `/${Number(chainId)}/address/${owner}/balances_v2/` +
      "?nft=true&no-nft-fetch=false" +
      // `&limit=${limit}` + // not working with match...
      `&match=${encodeURIComponent(match)}`;

    type NftsCov = {
      token_id: string;
      token_url: string;
      owner: string;
      external_data: string;
      original_owner: string;
    };
    type AnswerNftsCov = {
      items?: [{ nft_data: [NftsCov] }];
    };

    try {
      const nftsJson = ((await fetchCov(path)) as AnswerNftsCov)?.items;
      const tokens = nftsJson[0].nft_data;

      for (let index = 0; index < Math.min(tokens.length, limit); index++) {
        const _token = tokens[index];
        console.log("nftListFromCovalent TOKEN", _token);

        if (index < limit) {
          const nft = {
            chainId,
            collection: getChecksumAddress(collection.address),
            tokenID: _token.token_id,
            tokenURI: _token.token_url,
            external_data: _token.external_data,
            owner: getChecksumAddress(_token.owner || owner),
            minter: getChecksumAddress(_token.original_owner),
            nid: nftUrl3(chainId, collection.address, _token.token_id)
          };
          console.log("nftListFromCovalent nid", nft.nid, nft);
          nfts.set(nft.nid, nft);
        }
      }
    } catch (e) {
      console.error("ERROR nftListFromCovalent", e);
    }
  }
  // console.log("nftListFromCovalent", nfts.length);
  // console.log("nftListFromCovalent", nfts);

  return nfts;
};

const nftListFromTheGraph = async (
  chainId: number,
  collection: Collection,
  owner?: string,
  limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log("nftListFromTheGraph", chainId, collection.address, owner, limit);

  const nfts: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network && collection) {
    const collectionAddress = collection.address.toLowerCase();
    const whereOwner = owner ? `where: { owner: "${owner.toLowerCase()}" }` : "";

    const query = `{
      tokenContract( id: "${collectionAddress}" ) {
        tokens( first:${limit} ${whereOwner} ) {
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
    // console.log("nftListFromTheGraph nbTokens", nftsJson.length);
    // console.log(nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, limit); index++) {
      const _token = nftsJson[index];

      if (index < limit) {
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
        // console.log("nftListFromTheGraph nid", nft.nid, nft);
        nfts.set(nft.nid, nft);
      }
    }
  }
  // console.log("nftListFromTheGraph", nfts.length);
  // console.log("nftListFromTheGraph", nfts);
  return nfts;
};

const nftListFromContract = async (
  chainId: number,
  collection: Collection,
  provider: Provider,
  owner?: string,
  limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log("nftListFromContract", chainId, collection.address, owner, limit);

  const nfts: Map<string, Nft> = new Map();

  if (chainId && collection?.supports?.ERC721Enumerable) {
    try {
      const contract = await collectionGetContract(chainId, collection, provider);

      if (contract) {
        let nbTokens = limit;
        if (owner) {
          nbTokens = Number(await contract.balanceOf(owner));
        } else {
          if (contract.totalSupply) {
            nbTokens = Number(await contract.totalSupply());
          }
        }

        for (let index = 0; index < Math.min(nbTokens, limit); index++) {
          const nft: Nft = await nftGetFromContractEnumerable(chainId, collection, index, provider, owner);
          nfts.set(nft.nid || "", nft);
        }
      }
    } catch (e) {
      console.error("nftListFromContract ERROR", e);
    }
  }
  // console.log("nftListFromContract", nfts);
  return nfts;
};

const nftListTokenIds = async (
  chainId: number,
  collection: Collection,
  provider: Provider,
  owner?: string,
  limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log("nftListTokenIds", chainId, collection.address, owner, limit);

  let nftsTokenIds: Map<string, Nft> = new Map();
  const network = getNetwork(chainId);

  if (network) {
    nftsTokenIds = await nftListFromContract(chainId, collection, provider, owner, limit);
    // console.log("nftListTokenIds nftListFromContract", nftsTokenIds);
    if (nftsTokenIds.size === 0) {
      if (getSubgraphUrl(chainId)) {
        nftsTokenIds = await nftListFromTheGraph(chainId, collection, owner, limit);
        // console.log("nftListTokenIds nftListFromTheGraph", nftsTokenIds);
      } else if (getCovalent(chainId)) {
        nftsTokenIds = await nftListFromCovalent(chainId, collection, owner, limit);
        // console.log("nftListTokenIds nftListFromCovalent", nftsTokenIds);
      } else {
        console.error("No NFTs found:-(");
      }
    }
  }

  // VERIFY owner, not needed ?
  // if (nftsTokenIds.length) {
  //   for (let index = 0; index < Math.min(nftsTokenIds.length, limit); index++) {
  //     if (!owner || getChecksumAddress(token.owner) === getChecksumAddress(owner)) {
  //       nftsTokenIds[index] = token;
  //     }
  //   }
  // }
  // nftsTokenIds.sort((a, b) => (BigNumber.from(b.tokenID).gt(BigNumber.from(a.tokenID)) ? 1 : -1));

  // console.log("nftListTokenIds", nftsTokenIds);
  return nftsTokenIds;
};

const nftListWithMetadata = async (
  chainId: number,
  collection: Collection,
  nfts: Map<string, Nft>,
  owner?: string,
  limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  const nftsWithMetadata: Map<string, Nft> = new Map();

  const nftsFromIds = [...nfts.values()];

  for (let index = 0; index < Math.min(nftsFromIds.length, limit); index++) {
    const nft = await nftGetMetadata(chainId, nftsFromIds[index], collection);
    // console.log("nftListWithMetadata nid", nft.nid, nft);
    nftsWithMetadata.set(nft.nid || "", nft);
  }

  // console.log(`nftListWithMetadata from ${collection}`, nftsWithMetadata);
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

const nftListFromCache = (): Map<string, Nft> => {
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

const nftList = async (
  chainId: number,
  collection: Collection,
  provider: Provider,
  owner?: string,
  limit: number = LIMIT
): Promise<Map<string, Nft>> => {
  // console.log("nftList", chainId, collection, owner, limit);

  const nftsTokenIds: Map<string, Nft> = await nftListTokenIds(chainId, collection, provider, owner, limit);
  const nftsWithMetadata: Map<string, Nft> = await nftListWithMetadata(chainId, collection, nftsTokenIds, owner, limit);

  // console.log("nftList", nftsWithMetadata);

  return nftsWithMetadata;
};

export {
  nftList,
  nftListTokenIds,
  nftListWithMetadata,
  nftListFromCache,
  nftListFromContract,
  nftListFromCovalent,
  nftListFromTheGraph,
  clearCache
};
