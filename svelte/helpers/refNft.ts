import { getChainName } from "lib/kconfig";

type RefNFT = {
  chainId: number;
  collection?: string;
  tokenID?: string;
  account?: string;
  action?: string;
  chainName?: string;
};

// CAIP-22 : erc721 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-22.md
// CAIP-29 : erc1155 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-29.md
// eip155:1/erc721:Ox123/0x456
const caip = (refNFT: RefNFT) => {
  const { account, chainId, collection, tokenID, action } = refNFT || {};

  return (
    (chainId
      ? collection
        ? tokenID
          ? `eip155:${chainId}/erc721:${collection}/${tokenID}`
          : `eip155:${chainId}/erc721:${collection}`
        : `eip155:${chainId}`
      : "") +
    (action ? `/${action}` : "") +
    (account ? `@${account}` : "")
  );
};

// > mainnet > coll:Ox123 > nft:0x456 > id:8910 > action:mint @ user:0x1213
const breadcrumb = (refNFT: RefNFT) => {
  const { account, chainId, collection, tokenID, action } = refNFT || {};
  const chainName = getChainName(chainId);

  return (
    "> " +
    (chainName
      ? collection
        ? tokenID
          ? `${chainName} > coll:${collection} > nft:${tokenID}`
          : `${chainName} > coll:${collection}`
        : `${chainName}`
      : "Home") +
    (action ? `/ action:${action}` : "") +
    (account ? ` @ user:${account}` : "")
  );
};

// /mainnet/Ox123/0x456/8910/mint@0x1213
const urlHash = (refNFT: RefNFT) => {
  const { account, chainId, collection, tokenID, action } = refNFT || {};
  const chainName = getChainName(chainId);

  return (
    "/" +
    (chainName
      ? collection
        ? tokenID
          ? `${chainName}/${collection}/${tokenID}`
          : `${chainName}/${collection}`
        : `${chainName}`
      : "") +
    (action ? `/${action}` : "") +
    (account ? `@${account}` : "")
  );
};

export type { RefNFT };
export { caip, breadcrumb, urlHash };
