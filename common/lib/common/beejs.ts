import type { StorageOptionType, OptionType } from "@lib/common/types";

import { Bee } from "@ethersphere/bee-js";
import { DEFAULT_NAME, config } from "@lib/common/config";

// const DEFAULT_NODE_URL = "http://localhost:1633";
// test batchID : 66048555f07597e20c8138ff00c64a4287841c68cd1974ff801d2c95864c7ecd
const KRD_BATCH_ID = config.storage.swarm.apiKey;

const getBee = (nodeUrl: string): Bee => {
  return new Bee(nodeUrl ? nodeUrl : config.storage.swarm.apiEndpoint);
};

// const swarmUploadFile = async (file: File | string, batchId = "", nodeUrl = ""): Promise<string> => {
const swarmUploadFile = async (
  file: File | string,
  storageOption: StorageOptionType = { default: "swarm" }
): Promise<string> => {
  const swarmStorage: OptionType | undefined = storageOption?.swarm;
  const batchId = swarmStorage?.apiKey;
  const nodeUrl = swarmStorage?.apiEndpoint || "";
  console.log("swarmUploadFile ~ batchId:", batchId);
  console.log("swarmUploadFile ~ nodeUrl:", nodeUrl);

  const bee: Bee = getBee(nodeUrl);

  const isFile = file instanceof File;

  const result = await bee.uploadFile(batchId ? batchId : KRD_BATCH_ID, file, isFile ? file.name : DEFAULT_NAME, {
    pin: nodeUrl && batchId ? true : false,
    size: isFile ? file.size : undefined,
    contentType: isFile ? file.type : undefined
  });

  return result.reference;
};

export { swarmUploadFile };
