import { storageParamsGet } from "@common/storage/storage";
import { SWARM_ZERO_APIKEY } from "@common/storage/swarm";

const fetchBee = (() => {
  const uploadBlob = async (body: Blob): Promise<string> => {
    // console.log("fetchBee.upload", api, batchId, file.size);

    const api = storageParamsGet("swarm")?.apiEndpoint.replace(/\/$/, "") || "";
    const batchId = storageParamsGet("swarm")?.apiKey || "";

    if (!api) throw new Error("Invalid api");
    if (!batchId) throw new Error("Invalid batchId");
    if (!(body.size > 0)) throw new Error("Invalid file ");

    const isPinnableBatchID = String(batchId !== SWARM_ZERO_APIKEY);

    const headers = new Headers();
    headers.append("Swarm-Postage-Batch-Id", batchId);
    headers.append("Content-Type", body.type);
    headers.append("Swarm-Pin", isPinnableBatchID);

    const response: Response = await fetch(`${api}/bzz`, { method: "POST", body, headers });
    if (!(response.status >= 200 && response.status < 300)) throw new Error(`fetchBeePost: ${response.status}`);

    const resp = (await response.json()) as { reference: string };
    const hash = resp.reference;

    console.info("fetchBee.upload ~ hash:", hash);
    return hash;
  };

  const uploadJson = async (json: string): Promise<string> => {
    const blob = new Blob([json], { type: "application/json" });
    return uploadBlob(blob);
  };

  return { uploadBlob, uploadJson };
})();

export { fetchBee };
