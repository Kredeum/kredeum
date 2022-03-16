import { CID } from "multiformats/cid";
import * as json from "multiformats/codecs/json";
import { base16 } from "multiformats/bases/base16";
import { base32 } from "multiformats/bases/base32";
import { base58btc } from "multiformats/bases/base58";
import * as dagPB from "@ipld/dag-pb";
import { sha256 } from "multiformats/hashes/sha2";

const cidV1DAG = "bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga";
const cidV1RAW = "bafkreihgf42cncbynpfecfoxilymqzcjrn2rfj4vjqcvnp6ncatzgwxdvi";

const cidV0 = "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR";
const hash = "0x88ad89aa9ef7fe9100a501b802aeb493e00fd5bb6a39153f39386fc541115ed7";

const cid = async () => {
  const bytes = json.encode({ hello: "world" });
  console.log("bytes ", bytes);

  const hash = await sha256.digest(bytes);
  console.log("hash ", hash, hash.digest);

  const cid = CID.create(1, json.code, hash);
  console.log("cid ", cid);
  //> CID(bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea)
};

const main0 = async () => {
  const cid0 = CID.parse(cidV0);
  console.log("cid0", cid0);
  console.log("cid0 base58", cid0.toString(base58btc));
  console.log("cid0.multihash", cid0.multihash);
  console.log("cid0.toV1", cid0.toV1());
  console.log("0x" + Buffer.from(cid0.multihash.digest).toString("hex"));
};

const main1 = async (cid1: CID) => {

  console.log("cid1", cid1);
  console.log("cid1.code", cid1.code);
  console.log("cid1 base16", cid1.toString(base16));
  console.log("0x" + Buffer.from(cid1.multihash.digest).toString("hex"));
  console.log("cid1 base32", cid1.toString(base32));
  console.log("cid1 base58", cid1.toString(base58btc));
  // console.log("cid1 dag-pb", cid1.toString(dagPB));
  console.log("cid1.multihash", cid1.multihash);

  const cid = CID.create(1, dagPB.code, cid1.multihash)

  // console.log(parseInt(Buffer.from(cid1.multihash.digest).toString("hex"), 16));
  // const cid1b = new CID(1, 18, "base32", cid1.multihash)
  // console.log("cid1b", cid1b);
};

const main = async () => {
  // await main0();

  const cid1 = CID.parse(cidV1RAW, base32);
  await main1(cid1);

  const cid11 = CID.parse(cidV1DAG, base32);
  await main1(cid11);
};

// function b32(hexaNum: number) {
//   const _HEX16_SYMBOLS = "0123456789abcdef";

//   let buffer: string[64];
//   for (let i: number = 64; i > 0; i--) {
//     buffer[i - 1] = _HEX16_SYMBOLS[hexaNum & 0xf];
//     hexaNum >>= 4;
//   }

//   console.log(buffer);
// }

main();
