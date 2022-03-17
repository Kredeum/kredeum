import { CID } from "multiformats/cid";
import { code as dagPBcode } from "@ipld/dag-pb";
import { BigNumber } from "ethers";

const toHexa = (cid: string): string => {
  let cidHexa = "";
  let cidInt = "";
  try {
    cidHexa = "0x" + Buffer.from(CID.parse(cid).multihash.digest).toString("hex");
    cidInt = BigNumber.from(cidHexa).toString();
  } catch (e) {
    console.error("Bad CID");
  }

  console.log(`${cid}\n${cidHexa}\n${cidInt}\n`);
  return cidHexa;
};

// toHexa("QmbWqxBEKC3P8tqsKc98vxmWNzrzDRLMiMPL8wBuTGsMnR");
// toHexa("bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga");
// toHexa("bafkreigmbjzo5ifrjofiunai7aqxtmf6y7fpyacus43wajqq6kyh4keoym");
// toHexa("bafkreihrynthlr7n4zjq6iwsdazin4m3nwq753ihvqevu7dnrpw7xstzp4");

toHexa("bafkreifjwh6jqviy56vn5ws3wsnwy5wjat5be4ixxxuu3a42wimulngn54");

toHexa("bafkreieaj2n7z4mpglsp5tri7fb45bw5gzzc6nyc5wfynjbjvwspjpouka");
toHexa("QmRy89HP51SXuGm4AftR6YFGGbiw5hugRZU3aaoP2Eis5B");

toHexa("QmUVbQ5GT9iTrTavXtzpq4vd4jGXetCqKLDYae45CpPaaS");
toHexa("bafkreigd23vhpnpfgjxhib2rxeo7f63ytpbn2smagqbk3amqnwauc6viyy");
