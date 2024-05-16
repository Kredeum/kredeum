import { BigNumber } from "ethers";

import type { CollectionType, CollectionFilterType, NftType } from "../common/types";
import { ADDRESS_ZERO, getChecksumAddress, isAddressNotZero } from "../common/config";

import { fetchGQL, FETCH_LIMIT } from "../common/fetch";
import { keyCollection, keyNft } from "../common/keys";
import { networks } from "../common/networks";

const thegraphNftList = async (
  chainId: number,
  collection: CollectionType,
  filter: CollectionFilterType = {}
): Promise<Map<string, NftType>> => {
  const owner = filter.owner || ADDRESS_ZERO;
  const limit = filter.limit || FETCH_LIMIT;
  const offset = filter.offset || 0;
  const address = getChecksumAddress(collection.address);
  // console.log("thegraphNftList", chainId, address, owner, limit);

  const nfts: Map<string, NftType> = new Map();
  if (!(chainId && address && thegraphActive(chainId))) return nfts;

  const whereOwner = owner == ADDRESS_ZERO ? "" : `where: { account: "${owner.toLowerCase()}" }`;
  const skip = offset == 0 ? "" : `skip: "${offset}"`;
  const query = `{
      tokenContract( id: "${address.toLowerCase()}" ) {
        tokens( first:${limit} ${skip} ${whereOwner} ) {
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
  const answerGQL = (await thegraphFetch(chainId, query)) as AnswerNftsGQL;
  const nftsJson: Array<NftsGQL> = answerGQL?.tokenContract?.nfts || [];
  // console.log(nftsJson[0]);
  // console.log("thegraphNftList nbTokens", nftsJson.length);
  // console.log(nftsJson);

  let index = 0;
  for (const nft of nftsJson) {
    if (index++ >= limit) break;

    const tokenID = BigNumber.from(nft.tokenID).toString();
    const nid = keyNft(chainId, address, tokenID);
    const tokenURI = nft.tokenURI;
    const owner = getChecksumAddress(nft.account?.id);

    nfts.set(nid, { chainId, address, tokenID, tokenURI, owner, nid });
  }
  // console.log("thegraphNftList", nfts.size, nfts);
  return nfts;
};

const thegraphCollections = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`thegraphCollections ${keyCollections(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const network = networks.get(chainId);

  if (isAddressNotZero(account)) {
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
    type AnswerCollectionsGQL = {
      ownerPerTokenContracts: Array<{
        contract: { id: string; name: string; symbol: string; numTokens: number };
        numTokens: number;
      }>;
    };
    const answerGQL = (await thegraphFetch(chainId, query)) as AnswerCollectionsGQL;
    const currentContracts = answerGQL?.ownerPerTokenContracts || [];
    // console.log(currentContracts[0]);

    for (const currentContractResponse of currentContracts) {
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
        collections.set(keyCollection(chainId, address), collection);
      }
    }
  }
  // console.log(`thegraphCollections ${keyCollections(chainId, account)}\n`, collections);
  return collections;
};

const thegraphFetch = async (chainId: number, query: string): Promise<unknown> =>
  await fetchGQL(thegraphGetUrl(chainId), query);

const thegraphActive = (chainId: number): boolean => Boolean(networks.get(chainId)?.subgraph?.active);
const thegraphGetUrl = (chainId: number): string =>
  (networks.get(chainId)?.subgraph?.active && networks.get(chainId)?.subgraph?.url) || "";

export { thegraphCollections, thegraphActive, thegraphNftList, thegraphGetUrl, thegraphFetch };
