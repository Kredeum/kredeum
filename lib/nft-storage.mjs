import ipfs from "./ipfs.mjs";

class nftStorage extends ipfs {
  constructor(key) {
    super(key);
  }

  async pin(buffer) {
    let cid = "";

    const data = await (
      await fetch("https://api.nft.storage/upload", {
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
      console.log(`https://ipfs.io/ipfs/${cid}`);
    } else {
      console.error(data.error);
    }

    return cid;
  }
}

export default nftStorage;
