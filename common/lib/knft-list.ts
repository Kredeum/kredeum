import type { CollectionType, NftType } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { collectionContractGet } from "./kcollection-get";
import { nftGetFromContractEnumerable } from "./knft-get";
import { nftGetMetadata } from "./knft-get-metadata";

import { alchemyGet, alchemyNftList } from "lib/api-alchemy";
import { covalentGet, covalentNftList } from "lib/api-covalent";
import { thegraphGet, thegraphNftList } from "lib/api-thegraph";

import { getNetwork, isProviderOnChainId } from "./kconfig";
import { ERC721Enumerable } from "types/ERC721Enumerable";
import { FETCH_LIMIT } from "lib/kfetch";

const nftListFromContract = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("nftListFromContract", chainId, address, account, limit);

  const nfts: Map<string, NftType> = new Map();
  if (
    !(chainId && address && (await isProviderOnChainId(provider, chainId)) && collection?.supports?.IERC721Enumerable)
  )
    return nfts;

  try {
    const contract = (await collectionContractGet(chainId, address, provider)) as ERC721Enumerable;

    if (contract) {
      let nbTokens = limit;
      if (account) {
        nbTokens = Number(await contract.balanceOf(account));
      } else {
        if (contract.totalSupply) {
          nbTokens = Number(await contract.totalSupply());
        }
      }

      for (let index = 0; index < Math.min(nbTokens, limit); index++) {
        const nft: NftType | undefined = await nftGetFromContractEnumerable(
          chainId,
          address,
          index,
          provider,
          collection,
          account
        );
        if (nft) {
          nfts.set(nft.nid || "", nft);
        }
      }
    }
  } catch (e) {
    console.error("nftListFromContract ERROR", e);
  }

  // console.log("nftListFromContract", nfts);
  return nfts;
};

const nftListTokenIds = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("nftListTokenIds", chainId, collection.address, account, limit);

  let nftsTokenIds: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (network) {
    nftsTokenIds = await nftListFromContract(chainId, address, provider, collection, account, limit);
    // console.log("nftListTokenIds nftListFromContract", nftsTokenIds);
    if (nftsTokenIds.size === 0) {
      if (alchemyGet(chainId)) {
        nftsTokenIds = await alchemyNftList(chainId, collection, account, limit);
      } else if (thegraphGet(chainId)) {
        nftsTokenIds = await thegraphNftList(chainId, collection, account, limit);
        // console.log("nftListTokenIds thegraphNftList", nftsTokenIds);
      } else if (covalentGet(chainId)) {
        nftsTokenIds = await covalentNftList(chainId, collection, account, limit);
        // console.log("nftListTokenIds covalentNftList", nftsTokenIds);
      } else {
        console.error("No NFTs found:-(");
      }
    }
  }

  // VERIFY account, not needed ?
  // if (nftsTokenIds.length) {
  //   for (let index = 0; index < Math.min(nftsTokenIds.length, limit); index++) {
  //     if (!account || getChecksumAddress(token.account) === getChecksumAddress(account)) {
  //       nftsTokenIds[index] = token;
  //     }
  //   }
  // }
  // nftsTokenIds.sort((a, b) => (BigNumber.from(b.tokenID).gt(BigNumber.from(a.tokenID)) ? 1 : -1));

  // console.log("nftListTokenIds", nftsTokenIds);
  return nftsTokenIds;
};

const _nftListWithMetadata = async (
  nfts: Map<string, NftType>,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("_nftListWithMetadata", chainId, collection);

  const nftsWithMetadata: Map<string, NftType> = new Map();

  const nftsFromIds = [...nfts.values()];

  for (let index = 0; index < Math.min(nftsFromIds.length, limit); index++) {
    const nft = await nftGetMetadata(nftsFromIds[index]);
    // console.log("_nftListWithMetadata nid", nft.nid, nft);
    if (nft) {
      nftsWithMetadata.set(nft.nid || "", nft);
    }
  }

  // console.log(`_nftListWithMetadata from ${collection}`, nftsWithMetadata);
  return nftsWithMetadata;
};

// const nftListFromCache = (chainId?: number, collection?: string, account?: string): Map<string, NftType> =>
//   storeNftsList(chainId, collection, account);

const nftList = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("nftList", chainId, collection, account, limit);

  const nftsTokenIds: Map<string, NftType> = await nftListTokenIds(
    chainId,
    address,
    provider,
    collection,
    account,
    limit
  );
  const nftsWithMetadata: Map<string, NftType> = await _nftListWithMetadata(nftsTokenIds, account, limit);

  // console.log("nftList", nftsWithMetadata);

  return nftsWithMetadata;
};

export { nftList, nftListTokenIds, nftListFromContract, covalentNftList, thegraphNftList };
