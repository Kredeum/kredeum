import { CID } from "multiformats/cid";
import { BigNumber } from "ethers";
import { cidToHexa } from "../../lib/kcid";

const toHexaInt = (cid: string): { cidHexa: string; cidInt: string } => {
  console.log(cid);
  let cidHexa = "";
  let cidInt = "";
  try {
    cidHexa = "0x" + Buffer.from(CID.parse(cid).multihash.digest).toString("hex");
    cidInt = BigNumber.from(cidHexa).toString();
  } catch (e) {
    console.error("Bad CID");
  }

  console.log(`${cidHexa}\n${cidInt}`);
  return { cidHexa, cidInt };
};

const checkCid = (cid: string): void => {
  const { cidHexa } = toHexaInt(cid);
  const hexa = cidToHexa(cid);
  cidHexa === hexa || console.error(`${cidHexa} != ${hexa}`);
  console.log("");
};

checkCid("QmbWqxBEKC3P8tqsKc98vxmWNzrzDRLMiMPL8wBuTGsMnR");
checkCid("bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga");
checkCid("bafkreigmbjzo5ifrjofiunai7aqxtmf6y7fpyacus43wajqq6kyh4keoym");
checkCid("bafkreifjwh6jqviy56vn5ws3wsnwy5wjat5be4ixxxuu3a42wimulngn54");
