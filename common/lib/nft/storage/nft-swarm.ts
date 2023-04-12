import { swarmGatewayUrl, textShort, DEFAULT_NAME } from "@lib/common/config";
import { swarmUploadFile } from "@lib/common/beejs";

///////////////////////////////////////////////////////////////////////////////////
// Switch src to file
const srcToFileType = async (src: string, fileName: string): Promise<File> => {
  const blob = await fetch(src).then((r) => r.blob());
  const file = new File([blob], fileName, { type: blob.type });
  console.log("file", file);

  return file;
};

///////////////////////////////////////////////////////////////////////////////////
// GET Swarm image link
const nftSwarmImage = async (sourceImage: File | string, nodeUrl?: string, batchId?: string): Promise<string> => {
  let file: File;
  if (typeof sourceImage === "string") {
    file = await srcToFileType(sourceImage, DEFAULT_NAME);
  } else {
    file = sourceImage;
  }

  const swarmImage = `swarm://${await swarmUploadFile(file, file.name, file.type, file.size, nodeUrl, batchId)}`;
  console.log("🚀 ~ swarm image uploaded Ref :", swarmImage);

  // console.log("nftMint swarm image", ipfsImage);
  return swarmImage;
};

export { nftSwarmImage };
