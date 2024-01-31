import type { RefPageType } from "@kredeum/common/lib/common/types";
import { getChecksumAddress, isAddressNotZero } from "@kredeum/common/lib/common/config";
import { networks } from "@kredeum/common/lib/common/networks";
import { ADDRESS_ZERO } from "@kredeum/common/lib/common/config";

const _extract = (refBreadcrumb: RefPageType): RefPageType => {
  let chainId: number | undefined;
  let address: string | undefined;
  let tokenID: string | undefined;
  let account: string | undefined;
  let signer: string | undefined;
  let action: string | undefined;

  ({ chainId, address, tokenID, account, signer, action } = refBreadcrumb || {});

  chainId ||= 0;
  tokenID ||= "";
  action ||= "";
  address = getChecksumAddress(address);
  signer = getChecksumAddress(signer);
  account = isAddressNotZero(account) ? getChecksumAddress(account) : signer;
  const chainName = networks.getChainName(chainId) || "";

  return { chainId, address, tokenID, account, signer, action, chainName };
};

// CAIP-22 : erc721 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-22.md
// CAIP-29 : erc1155 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-29.md
// eip155:1/erc721:Ox123/0x456
const refPage2Caip = (refBreadcrumb: RefPageType): string => {
  const { chainId, address, tokenID } = _extract(refBreadcrumb);

  return chainId
    ? address != ADDRESS_ZERO
      ? tokenID
        ? `eip155:${chainId}/erc721:${address}/${tokenID}`
        : `eip155:${chainId}/erc721:${address}`
      : `eip155:${chainId}`
    : "";
};

// > mainnet > Ox123 > #234 > mint @ 0x1213
const refPage2Breadcrumb = (refBreadcrumb: RefPageType): string => {
  const { address, tokenID, account, signer, action, chainName } = _extract(refBreadcrumb);

  return (
    "> " +
    (chainName
      ? address != ADDRESS_ZERO
        ? tokenID
          ? `${chainName} > ${address} > #${tokenID} `
          : `${chainName} > ${address} `
        : `${chainName} `
      : "Home ") +
    (action ? `> ${action}` : "") +
    (account != ADDRESS_ZERO ? `| @${account}` : "") +
    (signer != ADDRESS_ZERO && signer != account ? ` != @${signer}` : "")
  );
};

// /mainnet/Ox123/0x456/8910/mint@0x1213
const refPage2UrlHash = (refBreadcrumb: RefPageType): string => {
  const { address, tokenID, account, action, chainName } = _extract(refBreadcrumb);

  return (
    "/" +
    (chainName
      ? address != ADDRESS_ZERO
        ? tokenID
          ? `${chainName}/${address}/${tokenID}`
          : `${chainName}/${address}`
        : `${chainName}`
      : "") +
    (action ? `/${action}` : "") +
    (account != ADDRESS_ZERO ? `@${account}` : "")
  );
};

const refPageFromUrlHash = (hash = window.location.hash): RefPageType => {
  if (!hash) return {};

  // HASH = #/mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769/transfer@0x166d23e3db37640db80d3a576f4042bafb11886f
  // HASH = #/chain/address/tokenID/action@account
  const [hash1, acc] = hash.split("@");
  const [, chain, addr, tokenID, action] = hash1.split("/");
  const address = getChecksumAddress(addr);
  const account = getChecksumAddress(acc);

  let chainName: string;
  let chainId: number;
  if (Number(chain)) {
    chainId = Number(chain);
    chainName = networks.getChainName(chainId) || "";
  } else {
    chainName = chain;
    chainId = networks.getChainId(chainName) || 0;
  }

  // console.log("refPageFromUrlHash", chainName, chainId, address, tokenID, action, account);

  return { chainName, chainId, address: address, tokenID, action, account: account };
};

export type { RefPageType };
export { refPageFromUrlHash, refPage2Caip, refPage2Breadcrumb, refPage2UrlHash };
