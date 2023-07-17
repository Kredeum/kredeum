import { Bee } from "@ethersphere/bee-js";
import { DEFAULT_NAME, config } from "@lib/common/config";
import { swarmApiEndpoint, swarmApiKey, SWARM_ZERO_APIKEY, swarmUriToUrl } from "@lib/nft/storage/swarm";

const getBee = (nodeUrl: string): Bee => {
  return new Bee(nodeUrl ? nodeUrl : config.storage.swarm.apiEndpoint);
};

const swarmPinBlob = async (blob: Blob): Promise<string> => {
  const file = new File([blob], DEFAULT_NAME, { type: blob.type });

  const nodeUrl = swarmApiEndpoint();
  const batchId = swarmApiKey();

  const bee: Bee = getBee(nodeUrl);
  const pin = Boolean(batchId && batchId !== SWARM_ZERO_APIKEY);

  const result = await bee.uploadFile(pin ? batchId : SWARM_ZERO_APIKEY, file, DEFAULT_NAME, {
    pin,
    size: file.size,
    contentType: file.type
  });

  return result.reference;
};

const swarmPinUrl = async (url: string): Promise<string> => {
  return await swarmPinBlob(await (await fetch(url)).blob());
};

const swarmPinUri = async (url: string): Promise<string> => {
  return await swarmPinUrl(swarmUriToUrl(url));
};

export { swarmPinUri, swarmPinUrl, swarmPinBlob };
