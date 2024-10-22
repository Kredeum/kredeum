import Ipfs from "../common/ipfs";
import { ipfsApiEndpoint, ipfsApiKey } from "./ipfs";

import { PinataSDK } from "pinata-web3";

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

  async pin(src: File | Blob | string): Promise<string> {
    // console.log("pin ~ src:", src);

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

      if (src instanceof File || src instanceof Blob) {
        // Pinata doc says that blob can be passed to pinata.upload.file() function
        // see : https://docs.pinata.cloud/web3/sdk/upload/file#file
        // eslint-disable-next-line
        response = await pinata.upload.file(src as File);
        // console.log("Pinata media response : ", response);
      } else if (typeof src === "string") {
        try {
          const objetJson = JSON.parse(src);
          response = await pinata.upload.json(objetJson);
          // console.log("Pinata metadata response : ", response);
        } catch (error) {
          const textFile = new File([src], "text.txt", { type: "text/plain" });
          response = await pinata.upload.file(textFile);
        }
      } else {
        throw new Error("Type non reconnu par Pinata");
      }

      cid = response.IpfsHash;

      // console.log("pin ~ cid:", cid);
    } catch (error) {
      console.error(error);
    }

    return cid;
  }
}

export default PinataStorage;
