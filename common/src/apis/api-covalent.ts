import { BigNumber } from "ethers";

import config from "@kredeum/config/dist/config.json";

import type { FetchResponse } from "../common/fetch";
import type { CollectionFilterType, CollectionType, NftType } from "../common/types";
import { ADDRESS_ZERO, getChecksumAddress } from "../common/config";
import { DEFAULT_NAME, DEFAULT_SYMBOL } from "../common/config";
import { fetchJson, FETCH_LIMIT } from "../common/fetch";
import { keyCollection, keyNft } from "../common/keys";
import { networks } from "../common/networks";

const _covalentUrlPath = (chainId: number, path: string): string => {
  const covalent = config?.covalent;
  if (!(covalent && covalent.url && covalent.key)) return "";
  return `${covalent.url}/${Number(chainId)}/${path}&key=${covalent.key}`;
};

const _covalentFetch = async (chainId: number, path: string): Promise<unknown> => {
  const urlPath = _covalentUrlPath(chainId, path);
  const config = {
    method: "GET",
    headers: {
      // Authorization: `Basic ${btoa(loginPass)}`,
      Accept: "application/json"
    }
  };
  // console.log("_covalentFetch <==", urlPath, "\n", config);

  const answerCov: FetchResponse = await fetchJson(urlPath, config);

  if (answerCov.error) console.error("_covalentFetch ERROR", answerCov.error);

  // console.log("_covalentFetch ==>", answerCov?.data);
  return answerCov?.data;
};

const covalentCollections = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`covalentCollections ${keyCollection(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = networks.getChainName(chainId);

  if (!(chainId && chainName && account)) return collections;

  // const match =
  // eslint-disable-next-line quotes
  // '{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}';
  // const path =
  //   `address/${account}/balances_v2/` + "?nft=true" + "&no-nft-fetch=false" + `&match=${encodeURIComponent(match)}`;

  const path = `address/${account}/balances_nft/?no-spam=true&no-nft-asset-metadata=true&with-uncached=true`;

  type CollectionCov = {
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    balance: BigNumber;
  };
  type AnswerCollectionsCov = {
    items?: Array<CollectionCov>;
  };
  const answerCollectionsCov = (await _covalentFetch(chainId, path)) as AnswerCollectionsCov;

  const collectionsCov = answerCollectionsCov?.items;
  if (collectionsCov?.length) {
    // console.log(collectionsCov[0]);
    // console.log("covalentCollections nbContracts", collectionsCov.length);

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
      collections.set(keyCollection(chainId, address), collection);
    }
  }

  // console.log(
  //   `covalentCollections ${keyCollections(chainId, account)}\n`,
  //   collections.size,
  //   path,
  //   collections
  // );
  return collections;
};

const covalentNftList = async (
  chainId: number,
  collection: CollectionType,
  filter: CollectionFilterType = {}
): Promise<Map<string, NftType>> => {
  const owner = filter.owner || ADDRESS_ZERO;
  const limit = filter.limit || FETCH_LIMIT;
  const address = getChecksumAddress(collection.address);
  // console.log("covalentNftList", chainId, address, owner, limit);

  const nfts: Map<string, NftType> = new Map();
  if (!(chainId && address && covalentActive(chainId))) return nfts;

  const match = `{contract_address:"${getChecksumAddress(collection.address)}"}`;
  const path =
    `address/${owner}/balances_v2/` +
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
    const nftsJson = ((await _covalentFetch(chainId, path)) as AnswerNftsCov)?.items;
    if (nftsJson?.[0]) {
      const tokens = nftsJson[0].nft_data;

      let index = 0;
      for (const _token of tokens) {
        if (index++ >= limit) break;

        const tokenID = BigNumber.from(_token.token_id).toString();

        const nft = {
          chainId,
          address: getChecksumAddress(collection.address),
          tokenID,
          tokenURI: _token.token_url,
          external_data: _token.external_data,
          owner: getChecksumAddress(_token.account || owner),
          minter: getChecksumAddress(_token.original_owner),
          nid: keyNft(chainId, collection.address, tokenID)
        };
        // console.log("covalentNftList keyNft(", nft.nid, nft);
        nfts.set(nft.nid, nft);
      }
    }
  } catch (e) {
    console.error("ERROR covalentNftList", e);
  }

  // console.log("covalentNftList", nfts.length);
  // console.log("covalentNftList", nfts);

  return nfts;
};

const covalentActive = (chainId: number): boolean => !(networks.get(chainId)?.covalent?.active === false);

export { covalentCollections, covalentNftList, covalentActive, _covalentFetch };
