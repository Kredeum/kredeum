import type { Signer } from "ethers";
import type { Nft } from "./ktypes";
import NftStorage from "./nft-storage";
import { Mint } from "./open-nfts";
import { ipfsUrl, ipfsGatewayUrl, textShort } from "./knfts";

let nftStorage: NftStorage;

const mintImagePinUrl = async (src: string, key?: string): Promise<string> => {
  nftStorage ??= new NftStorage(key);

  return await nftStorage.pinUrl(src);
};

const mintImagePinJson = async (nftData: Object, key?: string): Promise<string> => {
  nftStorage ??= new NftStorage(key);

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
    console.error("<kredeum-nfts-mint/> Minting ERROR", e);
  }

  return nft;
};

const mintImage = async (
  src: string,
  metadata: any,
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
    metadata: JSON.parse(metadata) || {}
  };
  const cidJson = await mintImagePinJson(nftData);

  const nft: Nft = await Mint(chainId, collection, cidJson, signer);

  return nft;
};

export { mintImage, mintImagePinUrl, mintImagePinJson, mintImageCallContract };
