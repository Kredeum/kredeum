import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import string2fileStream from "string-to-file-stream";

let data = new FormData();
// data.append("file", fs.createReadStream("./klogo.png"));
data.append("file", string2fileStream("Bonjour le monde"));
data.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

console.log(
  await (
    await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        pinata_api_key: "b253abf46663a21f0e40",
        pinata_secret_api_key: "34b0951ff74f6bd1bd30463d50c4de61b8cb4183503fb26fd59595d5c78fced2"
      }
    })
  ).json()
);
