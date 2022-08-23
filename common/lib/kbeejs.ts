import { Bee, Data, FileData } from "@ethersphere/bee-js";
import { swarmLinkToCid, swarmServer, SWARM_GATEWAY } from "@lib/kconfig";

const getBee = (nodeUrl: string): Bee => {
  return new Bee(nodeUrl ? nodeUrl : swarmServer(SWARM_GATEWAY));
};
const krdbatchId = "0000000000000000000000000000000000000000000000000000000000000000";

const swarmUploadFile = async (
  file: File | string,
  fileName: string,
  contentType: string,
  nodeUrl = "",
  batchId?: string,
  fileSize?: number
): Promise<string> => {
  const bee: Bee = getBee(nodeUrl);

  const result = await bee.uploadFile(batchId ? batchId : krdbatchId, file, fileName, {
    pin: nodeUrl ? true : false,
    size: fileSize || undefined,
    contentType: contentType
  });

  return result.reference;
};

const swarmDownloadFile = async (fileReference: string, nodeUrl = ""): Promise<FileData<Data>> => {
  const bee: Bee = getBee(nodeUrl);

  return await bee.downloadFile(fileReference);
};

const swarmGetContentType = async (fileReference: string, nodeUrl = ""): Promise<string> => {
  const bee: Bee = getBee(nodeUrl);

  if (fileReference.startsWith(SWARM_GATEWAY)) {
    fileReference = fileReference.replace(SWARM_GATEWAY, "");
  } else if (fileReference.startsWith("swarm://")) {
    fileReference = swarmLinkToCid(fileReference);
  }
  const swarmData: FileData<Data> = await bee.downloadFile(fileReference);
  const contentType: string = swarmData.contentType || "image";

  return contentType;
};

export { swarmUploadFile, swarmDownloadFile, swarmGetContentType };
