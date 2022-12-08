import { BigNumber } from "ethers";

import type { CollectionType, NftType } from "@lib/common/types";
import { getChecksumAddress, getNetwork, getChainName, collectionKey, nftKey } from "@lib/common/config";
import { fetchJson, FETCH_LIMIT } from "@lib/common/fetch";
import type { FetchResponse } from "@lib/common/fetch";
import { DEFAULT_NAME, DEFAULT_SYMBOL } from "@lib/common/config";

const covalentFetch = async (path: string): Promise<unknown> => {
  const loginPass = `${process.env.COVALENT_API_KEY || ""}`;
  const url = `https://api.covalenthq.com/v1${path}&key=${loginPass}`;
  const config = {
    method: "GET",
    headers: {
      // Authorization: `Basic ${btoa(loginPass)}`,
      Accept: "application/json"
    }
  };

  const answerCov: FetchResponse = await fetchJson(url, config);

  if (answerCov.error) console.error("covalentFetch ERROR", answerCov.error);
  return answerCov?.data;
};

const covalentCollectionList = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`covalentCollectionList ${collectionListKey(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = getChainName(chainId);

  if (!(chainId && chainName && account)) return collections;

  const match =
    // eslint-disable-next-line quotes
    '{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}';

  const path =
    `/${Number(chainId)}/address/${account}/balances_v2/` +
    "?nft=true" +
    "&no-nft-fetch=false" +
    `&match=${encodeURIComponent(match)}`;

  type CollectionCov = {
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    balance: BigNumber;
  };
  type AnswerCollectionsCov = {
    items?: Array<CollectionCov>;
  };
  const answerCollectionsCov = (await covalentFetch(path)) as AnswerCollectionsCov;

  const collectionsCov = answerCollectionsCov?.items;
  if (collectionsCov?.length) {
    // console.log(collectionsCov[0]);
    // console.log("covalentCollectionList nbContracts", collectionsCov.length);

    for (let index = 0; index < collectionsCov.length; index++) {
      const collectionCov: CollectionCov = collectionsCov[index];

      const address: string = getChecksumAddress(collectionCov.contract_address);
      const name = collectionCov.contract_name || DEFAULT_NAME;
      const symbol = collectionCov.contract_ticker_symbol || DEFAULT_SYMBOL;
      const balanceOf = Number(collectionCov.balance);

      const collection: CollectionType = {
        chainId,
        chainName,
        address,
        name,
        symbol
      };
      collection.balancesOf = new Map([[account, balanceOf]]);
      collections.set(collectionKey(chainId, address), collection);
    }
  }

  // console.log(
  //   `covalentCollectionList ${collectionListKey(chainId, account)}\n`,
  //   collections.size,
  //   path,
  //   collections
  // );
  return collections;
};

const covalentNftList = async (
  chainId: number,
  collection: CollectionType,
  account?: string,
  limit: number = FETCH_LIMIT
): Promise<Map<string, NftType>> => {
  // console.log("covalentNftList", chainId, collection, account, limit);

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
      const nftsJson = ((await covalentFetch(path)) as AnswerNftsCov)?.items;
      if (nftsJson?.[0]) {
        const tokens = nftsJson[0].nft_data;

        for (let index = 0; index < Math.min(tokens.length, limit); index++) {
          const _token = tokens[index];
          // console.log("covalentNftList TOKEN", _token);

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
            // console.log("covalentNftList nftKey(", nft.nid, nft);
            nfts.set(nft.nid, nft);
          }
        }
      }
    } catch (e) {
      console.error("ERROR covalentNftList", e);
    }
  }
  // console.log("covalentNftList", nfts.length);
  // console.log("covalentNftList", nfts);

  return nfts;
};

const covalentGet = (chainId: number): boolean => Boolean(getNetwork(chainId)?.covalent?.active);

export { covalentCollectionList, covalentNftList, covalentGet, covalentFetch };
