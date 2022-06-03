import { Bee, Data, FileData } from "@ethersphere/bee-js";

// const nodeUrl: string = "http://localhost:1633";
const bee: Bee = new Bee("http://localhost:1633");
const krdbatchId = "5feccb39054640d8721c2c8393f0f3317ea0753f499e89166741195d006d7be6";

const swarmUploadData = async (data: string, batchId?: string) => {
  const result = await bee.uploadData(batchId ? batchId : krdbatchId, data);

  return result.reference;
};

const swarmUploadFile = async (
  file: File | string,
  fileName: string,
  contentType: string,
  fileSize?: number,
  batchId?: string
): Promise<string> => {
  // const tag = await bee.createTag();
  // const updatedTag = await bee.retrieveTag(tag);
  // console.log("🚀 ~ file: beejs.ts ~ 1 ~ uploadFile ~ updatedTag", updatedTag);

  const result = await bee.uploadFile(batchId ? batchId : krdbatchId, file, fileName, {
    pin: true,
    size: fileSize || undefined,
    contentType: contentType
    // tag: tag.uid
  });
  // const updatedTag2 = await bee.retrieveTag(tag);
  // console.log("🚀 ~ file: beejs.ts ~ 2 ~ uploadFile ~ updatedTag2", updatedTag2);

  // console.log("🚀 ~ file: beejs.ts ~ line 18 ~ uploadFile ~ result", result);

  return result.reference;
};

const swarmDownloadFile = async (fileReference: string): Promise<FileData<Data>> =>
  await bee.downloadFile(fileReference);

const swarmGetContentType = async (fileReference: string): Promise<string> => {
  const swarmData: FileData<Data> = await bee.downloadFile(fileReference);
  const contentType: string = swarmData.contentType || "image";

  return contentType;
};

export { swarmUploadData, swarmUploadFile, swarmDownloadFile, swarmGetContentType };
