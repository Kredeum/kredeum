import type { CollectionType, NftType } from "./ktypes";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchCov, fetchGQL, fetchAlch } from "./kfetch";
import { collectionContractGet } from "./kcollection-get";
import { nftGetFromContractEnumerable } from "./knft-get";
import { nftGetMetadata } from "./knft-get-metadata";

import {
  getNetwork,
  getChecksumAddress,
  getSubgraph,
  getCovalent,
  nftKey,
  isProviderOnChainId,
  getAlchemy
} from "./kconfig";
import { ERC721Enumerable } from "types/ERC721Enumerable";
import { BigNumber } from "ethers";

const LIMIT = 10;

const nftListFromCovalent = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("nftListFromCovalent", chainId, collection, account, limit);

  const nfts: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (network && collection && account) {
    const match = `{contract_address:"${getChecksumAddress(collection.address)}"}`;
    const path =
      `/${Number(chainId)}/address/${account}/balances_v2/` +
      "?nft=true&no-nft-fetch=false" +
      // `&limit=${limit}` + // not working with match...
      `&match=${encodeURIComponent(match)}`;

    type NftsCov = {
      token_id: string;
      token_url: string;
      account: string;
      external_data: string;
      original_owner: string;
    };
    type AnswerNftsCov = {
      items?: [{ nft_data: [NftsCov] }];
    };

    try {
      const nftsJson = ((await fetchCov(path)) as AnswerNftsCov)?.items;
      if (nftsJson?.[0]) {
        const tokens = nftsJson[0].nft_data;

        for (let index = 0; index < Math.min(tokens.length, limit); index++) {
          const _token = tokens[index];
          // console.log("nftListFromCovalent TOKEN", _token);

          if (index < limit) {
            const tokenID = BigNumber.from(_token.token_id).toString();

            const nft = {
              chainId,
              address: getChecksumAddress(collection.address),
              tokenID,
              tokenURI: _token.token_url,
              external_data: _token.external_data,
              owner: getChecksumAddress(_token.account || account),
              minter: getChecksumAddress(_token.original_owner),
              nid: nftKey(chainId, collection.address, tokenID)
            };
            // console.log("nftListFromCovalent nftKey(", nft.nid, nft);
            nfts.set(nft.nid, nft);
          }
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

const nftListFromAlchemy = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = LIMIT
): Promise<Map<string, NftType>> => {
  console.log("nftListFromAlchemy", chainId, collection, account);

  const nfts: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (!(chainId && collection && account && network)) return nfts;

  type NftsAlch = {
    contract: { address: string };
    id: { tokenId: string };
    tokenUri: { raw: string };
    balance: string;
  };
  type AnswerNftsAlch = {
    ownedNfts?: Array<NftsAlch>;
    totalCount: number;
  };
  const answerNftsAlch = (await fetchAlch(
    chainId,
    `/getNFTs?owner=${account}&withMetadata=true&contractAddresses[]=${collection.address}`
  )) as AnswerNftsAlch;
  console.log("answerNftsAlch", answerNftsAlch);

  const totalCount = answerNftsAlch.totalCount;
  const ownedNfts = answerNftsAlch.ownedNfts;
  if (!(ownedNfts && totalCount >= 0)) return nfts;

  for (let index = 0; index < Math.min(totalCount, limit); index++) {
    const ownedNft = ownedNfts[index];
    // console.log("nftListFromCovalent TOKEN", _token);

    const tokenID = BigNumber.from(ownedNft.id?.tokenId).toString();
    if (index < limit) {
      const nft = {
        chainId,
        address: getChecksumAddress(collection.address),
        tokenID,
        tokenURI: ownedNft.tokenUri?.raw,
        nid: nftKey(chainId, collection.address, tokenID),
        owner: getChecksumAddress(account)
      };
      nfts.set(nft.nid, nft);
    }
  }

  console.log("nftListFromAlchemy", nfts);
  return nfts;
};

const nftListFromTheGraph = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("nftListFromTheGraph", chainId, collection.address, account, limit);

  const nfts: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (network && collection) {
    const collectionAddress = collection.address.toLowerCase();
    const whereOwner = account ? `where: { account: "${account.toLowerCase()}" }` : "";

    const query = `{
      tokenContract( id: "${collectionAddress}" ) {
        tokens( first:${limit} ${whereOwner} ) {
          id
          account{
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
      account: { id: string };
    };
    type AnswerNftsGQL = {
      tokenContract: { nfts: Array<NftsGQL> };
    };
    // console.log(query);
    const answerGQL = (await fetchGQL(chainId, query)) as AnswerNftsGQL;
    const nftsJson: Array<NftsGQL> = answerGQL?.tokenContract?.nfts || [];
    // console.log(nftsJson[0]);
    // console.log("nftListFromTheGraph nbTokens", nftsJson.length);
    // console.log(nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, limit); index++) {
      const _token = nftsJson[index];

      if (index < limit) {
        const tokenID = BigNumber.from(_token.tokenID).toString();

        const nft = {
          chainId,
          address: getChecksumAddress(collection.address),
          tokenID,
          tokenURI: _token.tokenURI,
          owner: getChecksumAddress(_token.account?.id),
          nid: nftKey(chainId, collection.address, tokenID)
          // metadata: _token.metadata && JSON.parse(_token.metadata),
          // name: _token.name,
          // description: _token.description,
          // image: _token.image
        };
        // console.log("nftListFromTheGraph nftKey", nft.nid, nft);
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
  address: string,
  provider: Provider,
  collection: CollectionType,
  account?: string,
  limit: number = LIMIT
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
  limit: number = LIMIT
): Promise<Map<string, NftType>> => {
  console.log("nftListTokenIds", chainId, collection.address, account, limit);

  let nftsTokenIds: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (network) {
    nftsTokenIds = await nftListFromContract(chainId, address, provider, collection, account, limit);
    console.log("nftListTokenIds nftListFromContract", nftsTokenIds);
    if (nftsTokenIds.size === 0) {
      if (getAlchemy(chainId)) {
        nftsTokenIds = await nftListFromAlchemy(chainId, collection, account, limit);
      } else if (getSubgraph(chainId)) {
        nftsTokenIds = await nftListFromTheGraph(chainId, collection, account, limit);
        // console.log("nftListTokenIds nftListFromTheGraph", nftsTokenIds);
      } else if (getCovalent(chainId)) {
        nftsTokenIds = await nftListFromCovalent(chainId, collection, account, limit);
        // console.log("nftListTokenIds nftListFromCovalent", nftsTokenIds);
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
  limit: number = LIMIT
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
  limit: number = LIMIT
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

export { nftList, nftListTokenIds, nftListFromContract, nftListFromCovalent, nftListFromTheGraph };
