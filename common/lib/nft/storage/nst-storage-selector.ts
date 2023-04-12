import config from "@config/config.json";

import { nftIpfsImage } from "@lib/nft/nft-mint";
import { nftSwarmImage } from "@lib/nft/storage/nft-swarm";

const nftStorageImage = async (image: string) => {
  if (config.storage.type === "ipfs") {
    return nftIpfsImage(image);
  } else {
    console.log("nftStorageImage ~ swarm!:", "swarm!");
    return nftSwarmImage(image);
  }
};

export { nftStorageImage };
