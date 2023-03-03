import { ref2UrlHash } from "@helpers/breadcrumb";
import { urlHash2RefNFT } from "@helpers/breadcrumb";
import { initProvider } from "@helpers/initProvider";

// SNIPPET takes params from HTML element, then set HASH
const initSnippet = async (chainId: number, address: string, tokenID: string, account?: string) => {
  // set url hash
  window.location.hash = ref2UrlHash({ chainId, address, tokenID });

  const prov = await initProvider(chainId, account);
  const { signer } = prov;
  ({ account } = prov);

  return { chainId, address, tokenID, account, signer };
};

const initDapp = async () => {
  let chainId: number;
  let account: string;

  // GET datas from URL HASH
  const ref = urlHash2RefNFT(window.location.hash);
  const { address, tokenID } = ref;
  ({ chainId, account } = ref);

  const prov = await initProvider(chainId, account);
  const { signer } = prov;
  ({ chainId, account } = prov);

  return { chainId, address, tokenID, account, signer };
};

export { initSnippet, initDapp };
