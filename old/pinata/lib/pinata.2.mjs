import pin from "./pin.mjs";
import axios from "axios";

class pinata extends pin {
  constructor(key) {
    super(key);
  }

  async pin(buffer) {
    const pinataOptions = { cidVersion: 1 };
    const data = new FormData();
    data.append("file", buffer);
    data.append("pinataOptions", JSON.stringify(pinataOptions));

    let resp;
    try {
      resp = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: data,
        maxBodyLength: "Infinity",
        headers: {
          pinata_api_key: "b253abf46663a21f0e40",
          pinata_secret_api_key: "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2"
        }
      });
      console.log("pinata.call axios", config);
    } catch (e) {
      console.error("pinata.call ERROR", e);
    }
    //console.log('pinata.pinFileToIPFS', pinFileJson);
    return resp.data;
  }
}

export default pinata;
