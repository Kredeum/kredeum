import ipfs from "./ipfs.mjs";

class theGraph extends ipfs {
  constructor(key) {
    super(key);
  }

  async add(buffer) {
    let cid = "";

    const resp = await fetch("https://api.thegraph.com/ipfs/api/v0/add", {
      method: "POST",
      body: buffer
    });
    console.log("resp", resp);

    const data = await resp.json();
    console.log("data", data);

    if (data.ok) {
      cid = data.value?.cid;
      console.log(`https://ipfs.io/ipfs/${cid}`);
    } else {
      console.error(data.error);
    }

    return cid;
  }
}

export default theGraph;
