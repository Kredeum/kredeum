import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

const ADD = "https://api.thegraph.com/ipfs/api/v0/add";

async function _post(url, stream) {
  const formData = new FormData();
  formData.append("file", stream);
  const res = await fetch(url, { method: "POST", body: formData });
  const json = await res.json();
  console.info(json);
}

console.info("IPFS ADD FILE");
_post(ADD, fs.createReadStream("fic.txt"));
