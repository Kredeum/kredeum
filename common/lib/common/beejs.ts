import { Bee } from "@ethersphere/bee-js";
import { DEFAULT_NAME, config } from "@lib/common/config";
import { swarmApiEndpoint, swarmApiKey, SWARM_ZERO_APIKEY } from "@lib/nft/storage/swarm";

const getBee = (nodeUrl: string): Bee => {
  return new Bee(nodeUrl ? nodeUrl : config.storage.swarm.apiEndpoint);
};

const swarmUploadFile = async (file: File | string): Promise<string> => {
  const nodeUrl = swarmApiEndpoint();
  const batchId = swarmApiKey();
  // console.log("swarmUploadFile ~ nodeUrl:", nodeUrl);
  // console.log("swarmUploadFile ~ batchId:", batchId);

  const bee: Bee = getBee(nodeUrl);

  const isFile = file instanceof File;
  const isPinnableBatchID = batchId && batchId !== SWARM_ZERO_APIKEY;

  const result = await bee.uploadFile(
    isPinnableBatchID ? batchId : SWARM_ZERO_APIKEY,
    file,
    isFile ? file.name : DEFAULT_NAME,
    {
      pin: isPinnableBatchID ? true : false,
      size: isFile ? file.size : undefined,
      contentType: isFile ? file.type : undefined
    }
  );

  return result.reference;
};

export { swarmUploadFile };
