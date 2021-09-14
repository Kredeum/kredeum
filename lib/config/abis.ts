import abisJson from "../../config/abis.json";

type KredeumKeys = "KredeumV2" | "KredeumV1" | "KredeumV0" | "CloneFactory" | "NFTsFactory";
type ErcKeys = "ERC165" | "ERC721" | "ERC721TokenReceiver" | "ERC721Metadata" | "ERC721Enumerable";
type ABIS = {
  [Key in ErcKeys | KredeumKeys]: Array<string>;
};

const abis = abisJson as ABIS;

export { abis, ABIS, KredeumKeys, ErcKeys };
