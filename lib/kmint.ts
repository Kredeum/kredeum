import type { Signer } from "ethers";
import type { Nft } from "./ktypes";
import NftStorage from "./knft-storage";
import { Mint } from "./klist-nfts";
import { ipfsUrl, ipfsGatewayUrl, textShort } from "./knfts";

let nftStorage: NftStorage;

type Metadata = {
  name?: string;
  description?: string;
};

const mintImagePinUrl = async (src: string, key?: string): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(key);

  return await nftStorage.pinUrl(src);
};

const mintImagePinJson = async (nftData: Nft, key?: string): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(key);

  return await nftStorage.pinJson(nftData);
};

const mintImageCallContract = async (
  chainId: number,
  collection: string,
  cidJson: string,
  signer: Signer
): Promise<Nft> => {
  let nft: Nft;

  try {
    nft = await Mint(chainId, collection, ipfsGatewayUrl(cidJson), signer);
  } catch (e) {
    console.error("kredeum-nfts-mint Minting ERROR", e);
  }

  return nft;
};

const mintImage = async (
  src: string,
  metadata: Metadata,
  chainId: number,
  collection: string,
  signer: Signer
): Promise<Nft> => {
  const cidImage = await mintImagePinUrl(src);

  const nftData = {
    name: metadata?.name || "",
    description: metadata?.description || metadata?.name || "",
    cid: cidImage,
    image: ipfsGatewayUrl(cidImage),
    ipfs: ipfsUrl(cidImage),
    origin: textShort(src, 140),
    minter: await signer.getAddress(),
    metadata: metadata || {}
  };
  const cidJson = await mintImagePinJson(nftData as Nft);

  const nft: Nft = await Mint(chainId, collection, cidJson, signer);

  return nft;
};

export { mintImage, mintImagePinUrl, mintImagePinJson, mintImageCallContract };
