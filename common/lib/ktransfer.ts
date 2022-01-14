import type { Signer } from "ethers";
import type { Nft } from "./ktypes";
import type { TransactionResponse } from "@ethersproject/abstract-provider";

import { collectionGet, collectionGetContract } from "./kcollection-get";
import { getNetwork } from "./kconfig";

const transferNft = async (nft: Nft, owner: Signer): Promise<TransactionResponse | null> => {
  let txResp: TransactionResponse | null = null;

  if (nft) {
    const network = getNetwork(nft.chainId);
    const ownerAddress = await owner.getAddress();
    console.log("transferNft", nft, ownerAddress);

    const openNFTs = await collectionGetContract(nft.chainId, collectionGet(nft.chainId, nft.collection), owner);

    // Waiting UI with valid TO
    const to = ownerAddress;
    txResp = await openNFTs.connect(owner).transferFrom(ownerAddress, to, nft.tokenID);
    console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp?.hash}`);
  }

  return txResp;
};

export { transferNft };
