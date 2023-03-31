import { CID } from "multiformats/cid";

const _cidToHexa = (cid: string): string => {
  console.log(`_cidToHexa ${cid}`);
  let cidHexa = "";
  try {
    const digest = CID.parse(cid).multihash.digest;
    console.log("cidToHexa ~ digest", digest);

    cidHexa = "0x" + Buffer.from(digest).toString("hex");
    console.log("cidToHexa ~ cidHexa", cidHexa);
  } catch (e) {
    console.error("Bad CID");
  }

  console.log(`_cidToHexa ${cidHexa}\n`);
  return cidHexa;
};

const _cidToInt = (cid: string): string => {
  const _cidInt = String(BigInt(_cidToHexa(cid)));
  console.log(`_cidToInt  ${_cidInt}\n`);

  return _cidInt;
};

const checkCid = (cid: string): void => {
  const _cidHexa = _cidToHexa(cid);
  const cidHexa = BigInt(_cidToInt(cid)).toHexString();
  cidHexa === _cidHexa || console.error(`${cidHexa} != ${_cidHexa}`);

  // _cidToInt(cid);
  // console.log("");
};

checkCid("bafkreihb4iyn6rra6apcncvktompbev3dp7hz73uct2lupi2iyceuheh7m");

checkCid("QmbWqxBEKC3P8tqsKc98vxmWNzrzDRLMiMPL8wBuTGsMnR");
checkCid("bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga");
checkCid("bafkreigmbjzo5ifrjofiunai7aqxtmf6y7fpyacus43wajqq6kyh4keoym");
checkCid("bafkreifjwh6jqviy56vn5ws3wsnwy5wjat5be4ixxxuu3a42wimulngn54");
