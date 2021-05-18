const KRE1 = {};

KRE1.ADDRESS = {
  ropsten: "",
  rinkeby: "",
  matic: ["0x1C10a8C4E65a1185810f72bcdB0EC564845cAbcB"],
  mumbai: [
    "0x34538444A64251c765c5e4c9715a16723CA922D8",
    "0x8e8B4A64151b228994aA8553dB2C446AfC8E41bb",
    "0x420C87cf8f6a2869ae8CBCFc3047FDEA69517007",
    "0x8Bf94497bf38a12488EC4fCAb7fd19Bb5A276420",
    "0xafe822240383dd0ab8a19253212ea9e1d6ba5e3b",
    "0x17fb61016939409e6b7cd7cfae468b707a896bae",
    "0xb05AA675e9d061C60fE050392E30AfeD22C655DA",
    "0x89f25A1B2F1c547c469696bF076936d47DF66cf3"
  ]
};
KRE1.ABI = [
  "constructor()",
  "event Approval(address indexed,address indexed,uint256 indexed)",
  "event ApprovalForAll(address indexed,address indexed,bool)",
  "event Transfer(address indexed,address indexed,uint256 indexed)",
  "function mintNFT(address,string) returns (uint256)",
  "function approve(address,uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function baseURI() view returns (string)",
  "function getApproved(uint256) view returns (address)",
  "function isApprovedForAll(address,address) view returns (bool)",
  "function name() view returns (string)",
  "function ownerOf(uint256) view returns (address)",
  "function safeTransferFrom(address,address,uint256)",
  "function safeTransferFrom(address,address,uint256,bytes)",
  "function setApprovalForAll(address,bool)",
  "function supportsInterface(bytes4) view returns (bool)",
  "function symbol() view returns (string)",
  "function tokenByIndex(uint256) view returns (uint256)",
  "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transferFrom(address,address,uint256)"
];

export default KRE1;
