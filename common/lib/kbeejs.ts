import { Bee, Data, FileData } from "@ethersphere/bee-js";
import { swarmLinkToCid } from "./kconfig";

const krdbatchId = "0000000000000000000000000000000000000000000000000000000000000000";

const swarmUploadFile = async (
  file: File | string,
  fileName: string,
  contentType: string,
  nodeUrl?: string,
  batchId?: string,
  fileSize?: number
): Promise<string> => {
  const bee: Bee = new Bee(nodeUrl ? nodeUrl : "https://api.gateway.ethswarm.org");

  const result = await bee.uploadFile(batchId ? batchId : krdbatchId, file, fileName, {
    pin: nodeUrl ? true : false,
    size: fileSize || undefined,
    contentType: contentType
  });

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
