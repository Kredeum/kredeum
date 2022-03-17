import { getChainId } from "lib/kconfig";

import type { RefNFT } from "helpers/refs";

const hashObject = (hash = window.location.hash): RefNFT => {
  let chainId: number;
  let account: string;
  let collection: string;
  let tokenID: string;
  let chainName: string;

  if (hash) {
    const res = hash.match(
      // URL = https://beta.kredeum.com/#/0x166d23e3db37640db80d3a576f4042bafb11886f@mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769
      // HASH = #/0x166d23e3db37640db80d3a576f4042bafb11886f@mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769
      /^#\/(([a-z]+)|([0-9]+))(\/(0x[0-9abcdefABCDEF]{40})(\/([0-9]+))?)?(@(0x[0-9abcdefABCDEF]{40}))?$/
      // HASH = #/account@chainName/collectionAddress/tokenID
    );
    console.log("hashObject", hash, res);

    if (res) {
      if (res[2]) {
        chainName = res[2];
        chainId = getChainId(chainName);
      } else {
        chainId = Number(res[3]);
      }
      collection = res[5];
      tokenID = res[7];
      account = res[9];

      console.log("hashObject", hash, account, chainId, collection, tokenID, chainName);
    }
  }

  return { account, chainId, collection, tokenID };
};

export { hashObject };
