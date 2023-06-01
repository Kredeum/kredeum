import { Bee } from "@ethersphere/bee-js";
import { DEFAULT_NAME } from "@lib/common/config";
import { swarmApiEndpoint, swarmApiKey, SWARM_PUBLIC_ENDPOINT, SWARM_ZERO_APIKEY } from "@lib/nft/storage/swarm";

// const getBee = (nodeUrl: string): Bee => {
//   return new Bee(nodeUrl ? nodeUrl : SWARM_PUBLIC_ENDPOINT);
// };

const swarmUploadFile = async (file: File | string): Promise<string> => {
  const nodeUrl = swarmApiEndpoint();
  const batchId = swarmApiKey();
  // console.log("swarmUploadFile ~ batchId:", batchId);
  // console.log("swarmUploadFile ~ nodeUrl:", nodeUrl);

  const bee: Bee = new Bee(nodeUrl);

  const isFile = file instanceof File;
  const isUserBatchID = batchId && batchId !== SWARM_ZERO_APIKEY;
  const isUserNodeUrl = nodeUrl && nodeUrl !== SWARM_PUBLIC_ENDPOINT;

  const result = await bee.uploadFile(
    isUserBatchID ? batchId : SWARM_ZERO_APIKEY,
    file,
    isFile ? file.name : DEFAULT_NAME,
    {
      pin: isUserNodeUrl && isUserBatchID ? true : false,
      size: isFile ? file.size : undefined,
      contentType: isFile ? file.type : undefined
    }
  );

  return result.reference;
};

export { swarmUploadFile };
