import type { CollectionType } from "@lib/common/types";
import type { FetchResponse } from "@lib/common/fetch";
import { fetchJson } from "@lib/common/fetch";
import { getChecksumAddress, getNetwork, getChainName, isAddressNotZero } from "@lib/common/config";
import { keyCollections } from "@lib/common/keys";

const infuraCollections = async (chainId: number, account: string): Promise<Map<string, CollectionType>> => {
  // console.log(`infuraCollections ${keyCollections(chainId, account)}\n`);

  const collections: Map<string, CollectionType> = new Map();
  const chainName = getChainName(chainId);

  if (!(chainId && chainName && isAddressNotZero(account))) return collections;

  type InfuraCollection = {
    contract: string;
    name: string;
    symbol: string;
    tokenType: string;
  };
  type InfuraCollectionsAnswer = {
    total: number;
    pageNumber: number;
    pageSize: number;
    network: string;
    cursor: string;
    account: string;
    collections?: Array<InfuraCollection>;
  };

  const req = `/networks/${chainId}/accounts/${account}/assets/collections`;

  const infuraCollectionsAnswer = (await infuraFetch(chainId, req)) as InfuraCollectionsAnswer;
  if (!infuraCollectionsAnswer) return collections;

  const totalCount = infuraCollectionsAnswer.total || 0;
  const contracts = infuraCollectionsAnswer.collections;
  if (!(contracts && totalCount > 0)) return collections;

  let index = 0;
  for (const contract of contracts) {
    // console.log("infuraCollections ~ contract:", contract);
    if (index++ >= 100) break;

    const address = getChecksumAddress(contract.contract);
    const name = contract.name || "";
    const symbol = contract.symbol || "";

    const collKey = keyCollections(chainId, address);
    // console.log("infuraCollections ~ collKey:", collKey);

    const collection = {
      chainId,
      address,
      name,
      symbol
    };

    collections.set(collKey, collection);
  }
  // console.log("infuraCollections OUT", collections);
  return collections;
};

const infuraFetch = async (chainId: number, path: string): Promise<unknown> => {
  const url = infuraUrl(chainId);
  if (!(chainId && url && path)) return;

  const urlPath = `${infuraUrl(chainId)}${path}`;
  // console.log("infuraFetch ~ urlPath", urlPath);

  const config = {
    method: "GET",
    headers: { Accept: "application/json" }
  };
  const infuraAnswer: FetchResponse = await fetchJson(urlPath, config);
  // console.log("infuraFetch ~ infuraAnswer", urlPath, infuraAnswer);

  if (infuraAnswer.error) console.error("infuraFetch ERROR", infuraAnswer.error);
  return infuraAnswer;
};

const infuraActive = (chainId: number): boolean => Boolean(getNetwork(chainId)?.infura?.active);

const infuraUrl = (chainId: number): string => (infuraActive(chainId) && getNetwork(chainId)?.infura?.url) || "";

export { infuraActive, infuraFetch, infuraCollections };
