import { getChainName, getChainId } from "@lib/common/config";

type RefBreadcrumb = {
  chainId: number;
  address?: string;
  tokenID?: string;
  account?: string;
  signer?: string;
  action?: string;
  chainName?: string;
};

const _extract = (refBreadcrumb: RefBreadcrumb): RefBreadcrumb => {
  let chainId: number;
  let address: string;
  let tokenID: string;
  let account: string;
  let signer: string;
  let action: string;

  ({ chainId, address, tokenID, account, signer, action } = refBreadcrumb || {});

  chainId ||= 0;
  address ||= "";
  tokenID ||= "";
  account ||= "";
  signer ||= "";
  action ||= "";
  const chainName = getChainName(chainId) || "";

  return { chainId, address, tokenID, account, signer, action, chainName };
};

// CAIP-22 : erc721 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-22.md
// CAIP-29 : erc1155 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-29.md
// eip155:1/erc721:Ox123/0x456
const ref2Caip = (refBreadcrumb: RefBreadcrumb) => {
  const { chainId, address, tokenID, account, signer, action } = _extract(refBreadcrumb);

  return chainId
    ? address
      ? tokenID
        ? `eip155:${chainId}/erc721:${address}/${tokenID}`
        : `eip155:${chainId}/erc721:${address}`
      : `eip155:${chainId}`
    : "";
};

// > mainnet > Ox123 > #234 > mint @ 0x1213
const ref2Breadcrumb = (refBreadcrumb: RefBreadcrumb) => {
  const { address, tokenID, account, signer, action, chainName } = _extract(refBreadcrumb);

  return (
    "> " +
    (chainName
      ? address
        ? tokenID
          ? `${chainName} > ${address} > #${tokenID} `
          : `${chainName} > ${address} `
        : `${chainName} `
      : "Home") +
    (action ? `> ${action}` : "") +
    (account ? `| @${account}` : "") +
    (signer && signer != account ? ` != @${signer}` : "")
  );
};

// /mainnet/Ox123/0x456/8910/mint@0x1213
const ref2UrlHash = (refBreadcrumb: RefBreadcrumb) => {
  const { address, tokenID, account, action, chainName } = _extract(refBreadcrumb);

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

const urlHash2RefNFT = (hash = window.location.hash): RefBreadcrumb => {
  let chainName: string = "";
  let chainId: number = 1;
  let address: string = "";
  let tokenID: string = "";
  let action: string = "";
  let account: string = "";

  if (hash) {
    const res = hash.match(
      // URL = https://beta.kredeum.com/#/mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769@0x166d23e3db37640db80d3a576f4042bafb11886f
      // HASH = #/mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769@0x166d23e3db37640db80d3a576f4042bafb11886f
      /^#\/(([a-z]+)|([0-9]+))?(\/(0x[0-9abcdefABCDEF]{40})(\/([0-9]+))?)?(\/([a-z]+))?(@(0x[0-9abcdefABCDEF]{40}))?$/
      // HASH = #/account@chainName/collectionAddress/tokenID
    );
    // console.log("hashrefNFT", hash, res);

    if (res) {
      const name = res[2];
      const id = Number(res[3]);
      chainName = name || getChainName(id);
      chainId = id || getChainId(name);
      address = res[5];
      tokenID = res[7];
      action = res[9];
      account = res[11];
    }
    // console.log("urlHash2RefNFT", chainName, chainId, address, tokenID, action, account);
  }

  return { chainName, chainId, address, tokenID, action, account };
};

export type { RefBreadcrumb };
export { urlHash2RefNFT, ref2Caip, ref2Breadcrumb, ref2UrlHash };
