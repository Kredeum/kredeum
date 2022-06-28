import type { NftType } from "./ktypes";
import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionContractGet } from "./kcollection-get";

import { swarmGatewayUrl, textShort, getNetwork, DEFAULT_NAME } from "./kconfig";
import { swarmUploadFile } from "./kbeejs";

const nftSwarmMintTexts = [
  "Mint",
  "Wait till Image stored on Swarm",
  "Wait till Metadata stored on Swarm",
  "Please, sign the transaction",
  "Wait till transaction completed, it may take one minute or more..."
];

///////////////////////////////////////////////////////////////////////////////////
// GET Swarm image link
const nftMint1SwarmImage = async (
  file: File,
  nftTitle: string,
  contentType: string,
  nodeUrl?: string,
  batchId?: string,
  fileSize?: number
): Promise<string> => {
  const swarmImage = `swarm://${await swarmUploadFile(file, nftTitle, contentType, nodeUrl, batchId, fileSize)}`;
  console.log("🚀 ~ swarm image uploaded Ref :", swarmImage);

  // console.log("nftMint swarm image", ipfsImage);
  return swarmImage;
};

// GET Swarm metadata url
const nftMint2SwarmJson = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  swarm = "",
  address = "",
  image = "",
  metadata = "{}",
  nodeUrl?: string,
  batchId?: string
): Promise<string> => {
  // console.log("nftMint2IpfsJson", name, swarm, address, image, metadata);

  const json = {
    name,
    description: nftDescription || name || "",
    image: swarmGatewayUrl(swarm),
    swarm,
    origin: textShort(image, 140),
    minter: address
  } as NftType;
  if (metadata) json.metadata = JSON.parse(metadata);

  const swarmJson = `swarm://${await swarmUploadFile(
    JSON.stringify(json, null, 2),
    "swarmJson",
    "text",
    nodeUrl,
    batchId
  )}`;

  console.log("nftMint swarm metadata", swarmJson);

  return swarmJson;
};

// // GET minting tx response
// const nftMint3SwarmTxResponse = async (
//   chainId: number,
//   address: string,
//   swarmJson: string,
//   minter: JsonRpcSigner
// ): Promise<TransactionResponse | null> => {
//   if (!(chainId && address && swarmJson && minter)) return null;
//   // console.log("nftMint3TxResponse", chainId, address, ipfsJson, await minter.getAddress());

//   const openNFTs = (await collectionContractGet(chainId, address, minter.provider)).connect(minter);

//   type MintOpenNFTFunctionType = {
//     (address: string, json: string): Promise<TransactionResponse>;
//   };

//   // OpenNFTsV0 = addUser
//   // OpenNFTsV1 = mintNFT
//   // OpenNFTsV2 = mintNFT
//   // OpenNFTsV3+ = mintOpenNFT
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const mintFunction: MintOpenNFTFunctionType = openNFTs.mintOpenNFT || openNFTs.mintNFT || openNFTs.addUser;
//   const urlJson = swarmGatewayUrl(swarmJson);

//   const txResp = await mintFunction(await minter.getAddress(), urlJson);
//   console.log(`${getNetwork(chainId)?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);

//   return txResp;
// };

// // GET minting tx receipt
// const nftMint4Swarm = async (
//   chainId: number,
//   address: string,
//   txResponse: TransactionResponse,
//   metadataCid: string,
//   minter: string
// ): Promise<NftType | undefined> => {
//   let nft: NftType | undefined = undefined;

//   if (txResponse) {
//     const txReceipt = await txResponse.wait();
//     // console.log("txReceipt", txReceipt);

//     if (txReceipt) {
//       const tokenID = _mintTokenID(txReceipt);
//       // console.log("tokenID", tokenID);

//       if (tokenID) {
//         nft = await _mintedNft(chainId, address, tokenID, swarmGatewayUrl(metadataCid), minter);
//         nft.swarmJson = metadataCid;
//         // console.log("nftMint4", nft);
//       }
//     }
//   }

//   return nft;
// };
///////////////////////////////////////////////////////////////////////////////////

export { nftSwarmMintTexts, nftMint1SwarmImage, nftMint2SwarmJson /*, nftMint3SwarmTxResponse, nftMint4Swarm*/ };
