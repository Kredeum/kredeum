import { getChainId, getChainName } from "lib/kconfig";

// URL = https://beta.kredeum.com/#/mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769
// HASH = #/mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769
// HASH = #/chainName/collectionAddress/tokenID
const refHash = () => window.location.hash;

const refFromUrl = (hash = refHash()) => {
  let chainId: number;
  let collection: string;
  let tokenID: number;
  let chainName: string;

  if (hash) {
    const res = hash.match(/^#\/(([a-z]+)|([0-9]+))(\/(0x[0-9abcdefABCDEF]{40})(\/([0-9]+))?)?$/);
    console.log("urlRef ~ res", hash, res);

    if (res) {
      if (res[2]) {
        chainName = res[2];
        chainId = getChainId(chainName);
      } else {
        chainId = Number(res[3]);
      }
      collection = res[5];
      tokenID = Number(res[7]);

      console.log("refFromUrl", chainId, collection, tokenID, chainName);
    }
  }

  return { chainId, collection, tokenID };
};

// CAIP-22 : erc721 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-22.md
// CAIP-29 : erc1155 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-29.md
const refInfos = (chainId: number, collection?: string, tokenID?: number) => {
  const chainName = getChainName(chainId);

  const ref = chainName
    ? collection
      ? tokenID
        ? `${chainName}/${collection}/${tokenID}`
        : `${chainName}/${collection}`
      : chainName
    : "";

  const caip = chainId
    ? collection
      ? tokenID
        ? `eip155:${chainId}/erc721:${collection}/${tokenID}`
        : `eip155:${chainId}/erc721:${collection}`
      : `eip155:${chainId}`
    : "";

  const hash = chainId
    ? collection
      ? tokenID
        ? `/#/${chainId}/${collection}/${tokenID}`
        : `/#/${chainId}/${collection}`
      : `/#/${chainId}`
    : "";

  console.log("refInfos", chainName, ref, caip, hash);
  return { chainName, ref, caip, hash };
};

export { refFromUrl, refInfos, refHash };
