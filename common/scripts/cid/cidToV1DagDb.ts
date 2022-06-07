import { CID } from "multiformats/cid";
import { code as dagPBcode } from "@ipld/dag-pb";

const toV1dag = (cid: string): string => {
  let cidV1dag = "";
  try {
    cidV1dag = CID.create(1, dagPBcode, CID.parse(cid).toV1().multihash).toString();
  } catch (e) {
    console.error("Bad CID");
  }
  return cidV1dag;
};

const CIDV0 = "QmbWqxBEKC3P8tqsKc98vxmWNzrzDRLMiMPL8wBuTGsMnR";
const CIDV1DAG = "bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga";
const CIDV1RAW = "bafkreihgf42cncbynpfecfoxilymqzcjrn2rfj4vjqcvnp6ncatzgwxdvi";

console.log(CIDV0, "\n", toV1dag(CIDV0), "\n");
console.log(CIDV1DAG, "\n", toV1dag(CIDV1DAG), "\n");
console.log(CIDV1RAW, "\n", toV1dag(CIDV1RAW), "\n");
