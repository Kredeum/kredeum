import { Bee, Data, FileData } from "@ethersphere/bee-js";
import { swarmLinkToCid } from "./kconfig";

// const nodeUrl: string = "http://localhost:1633";
// const bee: Bee = new Bee("https://api.gateway.ethswarm.org");
// const krdbatchId = "5feccb39054640d8721c2c8393f0f3317ea0753f499e89166741195d006d7be6";
const krdbatchId = "0000000000000000000000000000000000000000000000000000000000000000";

// const swarmUploadData = async (data: string, batchId?: string) => {
//   const result = await bee.uploadData(batchId ? batchId : krdbatchId, data);

//   return result.reference;
// };

const swarmUploadFile = async (
  file: File | string,
  fileName: string,
  contentType: string,
  nodeUrl?: string,
  batchId?: string,
  fileSize?: number
): Promise<string> => {
  // const tag = await bee.createTag();
  // const updatedTag = await bee.retrieveTag(tag);
  // console.log("🚀 ~ file: beejs.ts ~ 1 ~ uploadFile ~ updatedTag", updatedTag);
  const bee: Bee = new Bee(nodeUrl ? nodeUrl : "https://api.gateway.ethswarm.org");

  const result = await bee.uploadFile(batchId ? batchId : krdbatchId, file, fileName, {
    pin: nodeUrl ? true : false,
    size: fileSize || undefined,
    contentType: contentType
    // tag: tag.uid
  });
  // const updatedTag2 = await bee.retrieveTag(tag);
  // console.log("🚀 ~ file: beejs.ts ~ 2 ~ uploadFile ~ updatedTag2", updatedTag2);

  // console.log("🚀 ~ file: beejs.ts ~ line 18 ~ uploadFile ~ result", result);

  return result.reference;
};

const swarmDownloadFile = async (fileReference: string, nodeUrl?: string): Promise<FileData<Data>> => {
  const bee: Bee = new Bee(nodeUrl ? nodeUrl : "https://api.gateway.ethswarm.org");

  return await bee.downloadFile(fileReference);
};

const swarmGetContentType = async (fileReference: string, nodeUrl?: string): Promise<string> => {
  const bee: Bee = new Bee(nodeUrl ? nodeUrl : "https://api.gateway.ethswarm.org");

  if (fileReference.startsWith("https://api.gateway.ethswarm.org/bzz/")) {
    fileReference = fileReference.replace("https://api.gateway.ethswarm.org/bzz/", "");
  } else if (fileReference.startsWith("swarm://")) {
    fileReference = swarmLinkToCid(fileReference);
  }
  const swarmData: FileData<Data> = await bee.downloadFile(fileReference);
  const contentType: string = swarmData.contentType || "image";

  return contentType;
};

export { swarmUploadFile, swarmDownloadFile, swarmGetContentType };
