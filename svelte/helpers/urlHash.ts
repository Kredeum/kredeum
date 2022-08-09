import { getChainName, getChainId } from "lib/kconfig";

import type { RefNFT } from "helpers/refNft";

const urlHash2RefNFT = (hash = window.location.hash): RefNFT => {
  let chainName: string = "";
  let chainId: number = 0;
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

export type { RefNFT };
export { urlHash2RefNFT };
