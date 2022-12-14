import { BigNumber } from "ethers";

import type { CollectionType, NftType } from "@lib/common/types";
import { getChecksumAddress, getNetwork, collectionKey, nftKey } from "@lib/common/config";
import { fetchGQL, FETCH_LIMIT } from "@lib/common/fetch";

const thegraphNftList = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("thegraphNftList", chainId, collection.address, account, limit);

  const nfts: Map<string, NftType> = new Map();
  const network = getNetwork(chainId);

  if (network && collection) {
    const collectionAddress = collection.address.toLowerCase();
    const whereOwner = account ? `owner: "${account.toLowerCase()}"` : "";

    const query = `{
      tokens( first:${limit} where: {contract: "${collectionAddress}" ${whereOwner} } ) {
        id
        owner{
          id
        }
        tokenID
        tokenURI
      }
    }`;
    type NftsGQL = {
      tokenID: string;
      tokenURI: string;
      owner: { id: string };
    };
    type AnswerNftsGQL = {
      tokens: Array<NftsGQL>;
    };
    // console.log("thegraphNftList", query);
    const answerGQL = (await thegraphFetch(chainId, query)) as AnswerNftsGQL;
    // const answerGQL = (await thegraphRelayFetch(chainId, query)) as AnswerNftsGQL;
    const nftsJson: Array<NftsGQL> = answerGQL?.tokens || [];
    // console.log(nftsJson[0]);
    // console.log("thegraphNftList nbTokens", nftsJson.length);
    // console.log("thegraphNftList", nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, limit); index++) {
      const _token = nftsJson[index];

      if (index < limit) {
        const tokenID = BigNumber.from(_token.tokenID).toString();

        const nft = {
          chainId,
          address: getChecksumAddress(collection.address),
          tokenID,
          tokenURI: _token.tokenURI,
          owner: getChecksumAddress(_token.owner?.id),
          nid: nftKey(chainId, collection.address, tokenID)
          // metadata: _token.metadata && JSON.parse(_token.metadata),
          // name: _token.name,
          // description: _token.description,
          // image: _token.image
        };
        // console.log("thegraphNftList nftKey", nft.nid, nft);
        nfts.set(nft.nid, nft);
      }
    }
  }
  // console.log("thegraphNftList", nfts.length);
  // console.log("thegraphNftList", nfts);
  return nfts;
};

const thegraphCollectionList = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`thegraphCollectionList ${collectionListKey(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const network = getNetwork(chainId);

  if (account) {
    const query = `
    {
      ownerPerTokenContracts(
        where: {
          owner: "${account.toLowerCase()}"
        }
        ) {
          contract {
            id
            name
            symbol
            numTokens
          }
          numTokens
        }
      }
      `;
    // console.log("thegraphCollectionList", query);

    type AnswerCollectionsGQL = {
      ownerPerTokenContracts: Array<{
        contract: { id: string; name: string; symbol: string; numTokens: number };
        numTokens: number;
      }>;
    };
    const answerGQL = (await thegraphFetch(chainId, query)) as AnswerCollectionsGQL;
    const currentContracts = answerGQL?.ownerPerTokenContracts || [];
    // console.log(currentContracts[0]);
    // console.log("thegraphCollectionList", currentContracts);

    for (let index = 0; index < currentContracts.length; index++) {
      const currentContractResponse = currentContracts[index];
      const { contract, numTokens } = currentContractResponse;
      const { id, name, symbol, numTokens: numTokensTotal } = contract;
      const totalSupply = Number(numTokensTotal);
      const address = getChecksumAddress(id);
      const chainName = network?.chainName;
      const balanceOf = Math.max(numTokens, 0);

      if (currentContractResponse.numTokens > 0) {
        const collection: CollectionType = {
          chainId,
          chainName,
          address,
          name,
          symbol,
          totalSupply
        };
        collection.balancesOf = new Map([[account, balanceOf]]);
        collections.set(collectionKey(chainId, address), collection);
      }
    }
  }
  // console.log(`thegraphCollectionList ${collectionListKey(chainId, account)}\n`, collections);
  return collections;
};

const thegraphFetch = async (chainId: number, query: string): Promise<unknown> =>
  await fetchGQL(thegraphGetUrl(chainId), query);

const thegraphRelayFetch = async (chainId: number, query: string): Promise<unknown> =>
  await fetchGQL(`http://127.0.0.1:4004/${thegraphGetUrl(chainId)}`, query);

const thegraphGet = (chainId: number): boolean => Boolean(getNetwork(chainId)?.subgraph?.active);
const thegraphGetUrl = (chainId: number): string =>
  (getNetwork(chainId)?.subgraph?.active && getNetwork(chainId)?.subgraph?.url) || "";

export { thegraphCollectionList, thegraphGet, thegraphNftList, thegraphGetUrl, thegraphFetch, thegraphRelayFetch };
