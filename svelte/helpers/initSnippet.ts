import { ref2UrlHash } from "@helpers/breadcrumb";
import { initElement } from "@helpers/initElement";

const initSnippet = async (chainId: number, address: string, tokenID: string, account?: string) => {
  // set url hash
  window.location.hash = ref2UrlHash({ chainId, address, tokenID });

  // INIT like an Element
  return initElement(chainId, address, tokenID, account);
};

export { initSnippet };
