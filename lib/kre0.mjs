const KRE0 = {};

KRE0.ADDRESS = {
  ropsten: "",
  rinkeby: "",
  matic: [
    "0xF6d53C7e96696391Bb8e73bE75629B37439938AF",
    "0x792f8e3c36ac3c1c6d62ecc44a88ca1317fece93",
    "0x5f13c4c75cd1eb9091525dee5282c1855429b7d4"
  ],
  mumbai: ["0x02feb47bfd082f76c757c3a750ea10807c529e5f"]
};
KRE0.ABI = [
  "constructor()",
  "event Approval(address indexed,address indexed,uint256 indexed)",
  "event ApprovalForAll(address indexed,address indexed,bool)",
  "event Transfer(address indexed,address indexed,uint256 indexed)",
  "function addUser(address,string) returns (uint256)",
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

export default KRE0;
