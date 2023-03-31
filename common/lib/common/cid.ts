import { toBigInt } from "ethers";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";
import { sha256 } from "multiformats/hashes/sha2";

const cidToInt = (cid: string): string => toBigInt(CID.parse(cid).multihash.digest).toString();

const cidToV1Raw = (cid: string): string => CID.create(1, 85, CID.parse(cid).toV1().multihash).toString();

const cidFromString = async (value: string): Promise<string> =>
  CID.create(1, raw.code, await sha256.digest(new TextEncoder().encode(value))).toString();

export { cidFromString, cidToInt, cidToV1Raw };
