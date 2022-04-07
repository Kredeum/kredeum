import type { Writable } from "svelte/store";
import { writable, get } from "svelte/store";

import { collectionDefaultOpenNFTsGet } from "lib/kcollection-get";

// Map Default Collections : key is chainId or chainId@account, value is collectionAddress
const collectionDefault: Writable<Map<string, string>> = writable(new Map() as Map<string, string>);

const collectionDefaultSet = (chainId: number, account?: string, address?: string): void => {
  console.log("collectionDefaultSet ", chainId, account, address);

  if (!chainId) return;

  const key = account ? `${chainId}@${account}` : `${chainId}`;
  const value = address || collectionDefaultOpenNFTsGet(chainId);

  get(collectionDefault)?.set(key, value);
  collectionDefault.set(get(collectionDefault));
  console.log("collectionDefaultSet", key, value, get(collectionDefault));
};

const collectionDefaultGet = (chainId: number, account?: string): string => {
  console.log("collectionDefaultGet ", chainId, account);

  if (!chainId) return "";

  const ret = get(collectionDefault)?.get(`${chainId}@${account}`) || get(collectionDefault)?.get(`${chainId}`) || "";
  console.log("collectionDefaultGet ret", ret);

  return ret;
};

export { collectionDefault, collectionDefaultGet, collectionDefaultSet };
