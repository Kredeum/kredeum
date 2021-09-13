import Ipfs from "./ipfs";

const ipfsGateway = "https://ipfs.io/ipfs";

class NftStorage extends Ipfs {
  constructor(key: string) {
    super("https://api.nft.storage", key);
  }

  async pin(buffer: string) {
    let cid = "";
    // console.log(buffer);

    const data = await (
      await fetch(`${super.endpoint}/upload`, {
        method: "POST",
        body: buffer,
        headers: {
          Authorization: "Bearer " + super.key
        }
      })
    ).json();
    // console.log(data);
    if (data.ok) {
      cid = data.value?.cid;
      // console.log(`${ipfsGateway}/${cid}`);
    } else {
      console.error("NftStorage.pin", data.error);
    }

    return cid;
  }
}

export default NftStorage;
