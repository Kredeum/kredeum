import { CID } from "multiformats/cid";
import * as json from "multiformats/codecs/json";
import * as raw from "multiformats/codecs/raw";
import { sha256 } from "multiformats/hashes/sha2";
import { cidFromString } from "../../lib/common/kcid";

const fromBuffer = async function (buffer: Uint8Array): Promise<string> {
  let cid = "";
  try {
    const hash = await sha256.digest(buffer);
    cid = CID.create(1, raw.code, hash).toString();
  } catch (e) {
    console.error("kcid.buffer ERROR", e);
  }

  console.log("cid ", cid);
  return cid;
};

const fromString = async (value: string): Promise<string> => {
  const buffer = new TextEncoder().encode(value);
  return fromBuffer(buffer);
};

const fromJson = async (jsonValue: unknown): Promise<string> => {
  const bytes = json.encode(jsonValue);
  console.log("bytes ", bytes);

  const hash = await sha256.digest(bytes);
  console.log("hash ", hash, hash.digest);

  const cid = CID.create(1, json.code, hash).toString();
  console.log("cid ", cid);

  return cid;
};

const main = async () => {
  await fromJson({ hello: "world" });

  await fromString("Hello world");
  await cidFromString("Hello world");
};

main().catch(console.error);
