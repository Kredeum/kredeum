import Ipfs from "../common/ipfs";
import { ipfsApiEndpoint, ipfsApiKey } from "./ipfs";

import { PinataSDK } from "pinata-web3";

type PinataResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};

class NftStorage extends Ipfs {
  key: string;

  constructor() {
    super(ipfsApiEndpoint());
    this.key = ipfsApiKey();
  }

  async pin(src: File | object): Promise<string> {
    console.log("pin ~ src:", src);

    const pinataGateway = `${this.endpoint}`;
    const pinataJwt = this.key;
    let response: PinataResponse;
    let cid = "";

    ///////////////////////////////////////////////
    try {
      const pinata = new PinataSDK({
        pinataJwt,
        pinataGateway
      });

      if (src instanceof File) {
        response = await pinata.upload.file(src);
        console.log("Pinata media response : ", response);
      } else {
        response = await pinata.upload.json(src);
        console.log("Pinata metadata response : ", response);
      }

      cid = response.IpfsHash;

      console.log("pin ~ cid:", cid);
    } catch (error) {
      console.error(error);
    }

    return cid;
  }
}

export default NftStorage;
