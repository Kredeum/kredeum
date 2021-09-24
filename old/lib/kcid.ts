import axios from "axios";
import CID from "cids";
import multihashing from "multihashing-async";

const kcid = {
  buffer: async function (buffer: Uint8Array): Promise<string> {
    let cid: string = "";
    try {
      const multihash = await multihashing(buffer, "sha2-256");
      cid = new CID(1, "raw", multihash).toString();
    } catch (e) {
      console.error("kcid.buffer ERROR", e);
    }

    //console.log('kcid.buffer', cid);
    return cid;
  },

  url: async function (url: string): Promise<string> {
    let cid: string = "";
    try {
      const input = (await axios(url, { responseType: "arraybuffer" })).data;
      cid = await kcid.buffer(input);
    } catch (e) {
      console.error("kcid.url ERROR", e);
    }

    //console.log("kcid.url", url, "=>", cid);
    return cid;
  }
};

export default kcid;
