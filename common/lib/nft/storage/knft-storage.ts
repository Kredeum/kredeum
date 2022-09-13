import Ipfs from "@lib/common/kipfs";

const nftStorageEndpoint = "https://api.nft.storage";
const keyDefault: string = process.env.NFT_STORAGE_KEY || "";

type NftStorageResponse = {
  ok: boolean;
  error?: string;
  value?: {
    cid: string;
  };
};

class NftStorage extends Ipfs {
  key: string;

  constructor(key?: string) {
    super(nftStorageEndpoint);
    this.key = key || keyDefault;
  }

  async pin(buffer: Blob | string): Promise<string> {
    let cid = "";

    const url = `${this.endpoint}/upload`;
    // console.log(`NftStorage.pin <= ${url}`);
    const resp: Response = await fetch(url, {
      method: "POST",
      body: buffer,
      headers: {
        Authorization: "Bearer " + this.key
      }
    });
    const data = (await resp.json()) as NftStorageResponse;

    if (data.ok) {
      cid = data.value?.cid || "";
    } else {
      console.error("NftStorage.pin", data.error);
    }
    console.info(`NftStorage.pin => ipfs://${cid}`);

    return cid;
  }
}

export default NftStorage;
