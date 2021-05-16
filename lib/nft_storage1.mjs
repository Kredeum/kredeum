import axios from "axios";
import pin from "./pin.mjs";

class nftStorage extends pin {
  constructor(key) {
    super(key);
  }

  async pin(buffer) {
    let cid = "";

    try {
      const response = await axios.post("https://api.nft.storage/upload", buffer, {
        headers: {
          Authorization: "Bearer " + super.key
        }
      });
      console.log(response.data);
      cid = response.data.value.cid;
    } catch (e) {
      cid = e.message;
      console.error("ERROR", e.message);
    }
    console.log(`https://ipfs.io/ipfs/${cid}`);
    return cid;
  }
}

export default nftStorage;
