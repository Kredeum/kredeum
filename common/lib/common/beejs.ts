import { Bee } from "@ethersphere/bee-js";
import { DEFAULT_NAME, swarmServer, SWARM_GATEWAY } from "@lib/common/config";

const DEFAULT_NODE_URL = "http://localhost:1633";
const KRD_BATCH_ID = "0000000000000000000000000000000000000000000000000000000000000000";

const getBee = (nodeUrl: string): Bee => {
  return new Bee(nodeUrl ? nodeUrl : swarmServer(SWARM_GATEWAY));
};

const swarmUploadFile = async (file: File | string, batchId = "", nodeUrl = ""): Promise<string> => {
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
