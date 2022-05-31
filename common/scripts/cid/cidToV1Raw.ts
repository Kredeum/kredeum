import { CID } from "multiformats/cid";

const toV1Raw = (cid: string): string => {
  let cidV1Raw = "";
  try {
    cidV1Raw = CID.create(1, 85, CID.parse(cid).toV1().multihash).toString();
  } catch (e) {
    console.error("Bad CID");
  }
  return cidV1Raw;
};

const CIDV0 = "QmePw8gVcBMb8x6kAep6aMBAX23hCSk6iZW3i9VKkiFhu1";
const CIDV1DAG = "bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga";
const CIDV1RAW = "bafkreihgf42cncbynpfecfoxilymqzcjrn2rfj4vjqcvnp6ncatzgwxdvi";

console.log(CIDV0, "\n", toV1Raw(CIDV0), "\n");
console.log(CIDV1DAG, "\n", toV1Raw(CIDV1DAG), "\n");
console.log(CIDV1RAW, "\n", toV1Raw(CIDV1RAW), "\n");
