import pin from "./pin.mjs";
import axios from "axios";

class pinata extends pin {
  constructor(key) {
    super(key);
  }

  async pin(buffer) {
    const formData = new FormData();
    formData.append("file", buffer);
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    console.log(formData.toString());

    const options = {
      method: "POST",
      body: formData,
      headers: {
        withCredentials: true,
        maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large files
        maxBodyLength: "Infinity",
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        pinata_api_key: "b253abf46663a21f0e40",
        pinata_secret_api_key: "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2"
      }
    };
    // console.log("options",options);
    // const data = await (await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", options)).json();

    const resp = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      withCredentials: true,
      maxContentLength: "Infinity",
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formData._boundary}`,
        pinata_api_key: "b253abf46663a21f0e40",
        pinata_secret_api_key: "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2"
      }
    });

    console.log("resp.data", resp.data);

    if (data.ok) {
      cid = data.value?.cid;
      console.log(`https://ipfs.io/ipfs/${cid}`);
    } else {
      console.error(data.error);
    }

    return data;
  }
}

export default pinata;
