import { NFTStorage, Blob } from "nft.storage";

const nftStorage = {};
let client;

nftStorage.init = function (options) {
  console.log("nftStorage.init", options);
  client = new NFTStorage({ token: options?.key });
};

nftStorage.pin = async function (buffer, options) {
  // console.log("nftStorage.pin", options);
  let cid = "";

  try {
    client || nftStorage.init(options);

    cid = await client.storeBlob(new Blob([buffer]));
  } catch (e) {
    client = null;
    cid = e.message;
    console.error("ERROR", e.message);
  }
  return cid;
};

export default nftStorage;
