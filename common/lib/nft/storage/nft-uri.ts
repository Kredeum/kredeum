import type { Properties, StorageOptionType } from "@lib/common/types";

import { DEFAULT_NAME, isTestnet, config } from "@lib/common/config";
import { nftSwarmImageUri, nftSwarmTokenUri } from "./nft-swarm";
import { nftIpfsImageUri, nftIpfsTokenUri } from "./nft-ipfs";

const nftStorageSet = (storageOptions: StorageOptionType): void => {
  if (typeof localStorage !== "undefined") {
    const storage = JSON.stringify(storageOptions);
    localStorage.setItem("storage", storage);
  }
};

const nftStorageGet = (): StorageOptionType => {
  const storage = localStorage?.getItem("storage");
  return storage ? (JSON.parse(storage) as StorageOptionType) : { default: "ipfs" };
};

///////////////////////////////////////////////////////////////////////////////////
// GET  image uri
const nftImageUri = async (chainId: number, image: string): Promise<string> => {
  const storageOption = nftStorageGet();

  const nftImageUriFunc =
    storageOption?.default == "swarm" &&
    (isTestnet(chainId) || storageOption?.swarm?.apiKey !== config.storage.swarm.apiKey)
      ? nftSwarmImageUri
      : nftIpfsImageUri;
  return nftImageUriFunc(image, storageOption);
};

// GET  metadata uri
const nftTokenUri = async (
  chainId: number,
  name = DEFAULT_NAME,
  nftDescription = "",
  imageUri = "",
  address = "",
  image = "",
  metadata = "{}",
  properties: Properties = {},
  animation_url = ""
): Promise<string> => {
  const storageOption = nftStorageGet();

  const nftTokenUriFunc =
    storageOption?.default == "swarm" &&
    (isTestnet(chainId) || storageOption?.swarm?.apiKey !== config.storage.swarm.apiKey)
      ? nftSwarmTokenUri
      : nftIpfsTokenUri;
  return nftTokenUriFunc(
    name,
    nftDescription,
    imageUri,
    address,
    image,
    metadata,
    properties,
    animation_url,
    storageOption
  );
};

export { nftImageUri, nftTokenUri, nftStorageGet, nftStorageSet };
