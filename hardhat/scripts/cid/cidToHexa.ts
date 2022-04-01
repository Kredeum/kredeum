import { CID } from "multiformats/cid";
import { code as dagPBcode } from "@ipld/dag-pb";

const toHexa = (cid: string): string => {
  let cidHexa = "";
  try {
    cidHexa = "0x" + Buffer.from(CID.parse(cid).multihash.digest).toString("hex");
  } catch (e) {
    console.error("Bad CID");
  }

  console.log(`${cid}\n${cidHexa}\n`);
  return cidHexa;
};

toHexa("QmbWqxBEKC3P8tqsKc98vxmWNzrzDRLMiMPL8wBuTGsMnR");
toHexa("bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga");
toHexa("bafkreigmbjzo5ifrjofiunai7aqxtmf6y7fpyacus43wajqq6kyh4keoym");
toHexa("bafkreifjwh6jqviy56vn5ws3wsnwy5wjat5be4ixxxuu3a42wimulngn54");
