import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";
import { sha256 } from "multiformats/hashes/sha2";

const cidToHexa = (cid: string): string => {
  let cidHexa = "";
  try {
    cidHexa = "0x" + Buffer.from(CID.parse(cid).multihash.digest).toString("hex");
  } catch (e) {
    console.error("Bad CID");
  }

  // console.log(`${cid}\n${cidHexa}\n`);
  return cidHexa;
};

const cidToV1Raw = (cid: string): string => {
  let cidV1Raw = "";
  try {
    cidV1Raw = CID.create(1, 85, CID.parse(cid).toV1().multihash).toString();
  } catch (e) {
    console.error("Bad CID");
  }
  return cidV1Raw;
};

const cidFromString = async (value: string): Promise<string> => {
  const buffer = new TextEncoder().encode(value);
  const hash = await sha256.digest(buffer);
  const cid = CID.create(1, raw.code, hash).toString();

  console.log("cid ", cid);
  return cid;
};

export { cidFromString, cidToHexa, cidToV1Raw };
