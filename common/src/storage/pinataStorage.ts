import Ipfs from "../common/ipfs";
import { ipfsApiEndpoint, ipfsApiKey } from "./ipfs";

type PinataResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};

class PinataStorage extends Ipfs {
  key: string;

  constructor() {
    super(ipfsApiEndpoint());
    this.key = ipfsApiKey();
  }

  ///////////////////////////////////////////////
  // see : https://docs.pinata.cloud/api-reference/endpoint/ipfs/pin-file-to-ipfs
  // ( if Pinata SDK librarie is needed : https://docs.pinata.cloud/web3/tools/pinata-sdk )
  async pin(src: File | Blob | string): Promise<string> {
    const pinataEndpoint = `${this.endpoint}`;
    const pinataJwt = this.key;

    let response: PinataResponse;
    let cid = "";

    try {
      const data = new FormData();
      if (typeof src === "string") {
        src = new Blob([src], { type: "application/json" });
      }
      data.append("file", src);

      const options = JSON.stringify({ cidVersion: 1 });
      data.append("pinataOptions", options);

      const request = await fetch(`${pinataEndpoint}/pinning/pinFileToIPFS`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: "Bearer " + pinataJwt
        }
      });

      if (request.ok) {
        response = (await request.json()) as PinataResponse;
        cid = response.IpfsHash;
      }

      // console.log("pin ~ cid:", cid);
    } catch (error) {
      console.error(error);
    }

    return cid;
  }
}

export default PinataStorage;
