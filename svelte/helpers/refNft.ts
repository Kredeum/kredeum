import { getChainName } from "@lib/common/config";

type RefNFT = {
  chainId: number;
  address?: string;
  tokenID?: string;
  account?: string;
  action?: string;
  chainName?: string;
};

// CAIP-22 : erc721 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-22.md
// CAIP-29 : erc1155 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-29.md
// eip155:1/erc721:Ox123/0x456
const refNFT2Caip = (refNFT: RefNFT) => {
  const { account, chainId, address, tokenID, action } = refNFT || {};

  return (
    (chainId
      ? address
        ? tokenID
          ? `eip155:${chainId}/erc721:${address}/${tokenID}`
          : `eip155:${chainId}/erc721:${address}`
        : `eip155:${chainId}`
      : "") +
    (action ? `/${action}` : "") +
    (account ? `@${account}` : "")
  );
};

// > mainnet > Ox123 > #234 > mint @ 0x1213
const refNFT2Breadcrumb = (refNFT: RefNFT) => {
  const { account, chainId, address, tokenID, action } = refNFT || {};
  const chainName = getChainName(chainId);

  return (
    "<pre>> " +
    (chainName
      ? address
        ? tokenID
          ? `${chainName} > ${address} > #${tokenID} `
          : `${chainName} > ${address} `
        : `${chainName} `
      : "Home") +
    (action ? `> ${action}` : "") +
    (account ? `| @${account}` : "") +
    "</pre>"
  );
};

// /mainnet/Ox123/0x456/8910/mint@0x1213
const refNFT2UrlHash = (refNFT: RefNFT) => {
  const { account, chainId, address, tokenID, action } = refNFT || {};
  const chainName = getChainName(chainId);

  return (
    "/" +
    (chainName
      ? address
        ? tokenID
          ? `${chainName}/${address}/${tokenID}`
          : `${chainName}/${address}`
        : `${chainName}`
      : "") +
    (action ? `/${action}` : "") +
    (account ? `@${account}` : "")
  );
};

export type { RefNFT };
export { refNFT2Caip, refNFT2Breadcrumb, refNFT2UrlHash };
