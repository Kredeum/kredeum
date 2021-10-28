import Ipfs from "./kipfs";

const nftStorageEndpoint = "https://api.nft.storage";
const keyDefault: string = process.env.NFT_STORAGE_KEY;

class NftStorage extends Ipfs {
  key: string;

  constructor(key: string) {
    super(nftStorageEndpoint);
    this.key = key || keyDefault;
  }

  async pin(buffer: Blob | string) {
    let cid = "";

    const url = `${this.endpoint}/upload`;
    console.log(`NftStorage.pin ${url} ${this.key.substring(0, 16)}...`);
    const data = await (
      await fetch(url, {
        method: "POST",
        body: buffer,
        headers: {
          Authorization: "Bearer " + this.key
        }
      })
    ).json();

    if (data.ok) {
      cid = data.value?.cid;
    } else {
      console.error("NftStorage.pin", data.error);
    }
    console.log(`NftStorage.pin ...${cid}`);

    return cid;
  }
}

export default NftStorage;
