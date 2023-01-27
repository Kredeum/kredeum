import { urlHash2RefNFT } from "@helpers/breadcrumb";
import { initElement } from "@helpers/initElement";

const initDapp = async () => {
  // GET datas from URL HASH
  const { chainId, address, tokenID, account } = urlHash2RefNFT(window.location.hash);

  // INIT like an Element
  return initElement(chainId, address, tokenID, account);
};

export { initDapp };
