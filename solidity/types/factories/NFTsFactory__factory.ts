/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NFTsFactory, NFTsFactoryInterface } from "../NFTsFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "template",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "NewImplementation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "template",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "NewTemplate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "ERC721",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_ENUMERABLE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_ENUMERABLE_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_METADATA",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_METADATA_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPEN_NFTS",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPEN_NFTS_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "addImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nft",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "nft",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balanceOf",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
        ],
        internalType: "struct INFTsFactory.NftData",
        name: "nftData",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balancesOf",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "nft",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balanceOf",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
        ],
        internalType: "struct INFTsFactory.NftData[]",
        name: "nftData",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    name: "clone",
    outputs: [
      {
        internalType: "address",
        name: "clone_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractProbe",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "implementations",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementationsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "setContractProbe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "setDefaultTemplate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "template",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "templates",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawEther",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5062000032620000266200003860201b60201c565b6200004060201b60201c565b62000104565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b612c2e80620001146000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c8063845affc8116100c3578063c17bae4f1161007c578063c17bae4f1461036c578063c6e2a4001461038a578063d33cdd74146103a6578063f2fde38b146103c4578063f7888aec146103e0578063f7f5d46d146104105761014d565b8063845affc8146102985780638da5cb5b146102c857806393199bcf146102e6578063a25e0d7014610316578063b98a474814610332578063bcde32a11461034e5761014d565b80636cc41ea9116101155780636cc41ea91461020c5780636f2ddd931461022a578063715018a6146102485780637362377b146102525780637d19ec931461025c5780638425abff1461027a5761014d565b80630a7c6d191461015257806320a99bd0146101705780632bf0d071146101a05780636392a51f146101be5780636bc259cc146101ee575b600080fd5b61015a61042e565b6040516101679190611cda565b60405180910390f35b61018a60048036038101906101859190611d67565b610439565b6040516101979190611da3565b60405180910390f35b6101a861046c565b6040516101b59190611dda565b60405180910390f35b6101d860048036038101906101d39190611d67565b610471565b6040516101e59190612008565b60405180910390f35b6101f661055e565b6040516102039190611cda565b60405180910390f35b610214610569565b6040516102219190611cda565b60405180910390f35b61023261058d565b60405161023f9190611da3565b60405180910390f35b6102506105b3565b005b61025a61063b565b005b6102646106c3565b6040516102719190611cda565b60405180910390f35b6102826106ce565b60405161028f9190611dda565b60405180910390f35b6102b260048036038101906102ad9190612056565b6106d3565b6040516102bf9190611da3565b60405180910390f35b6102d0610712565b6040516102dd9190611da3565b60405180910390f35b61030060048036038101906102fb91906121b8565b61073b565b60405161030d9190611da3565b60405180910390f35b610330600480360381019061032b9190611d67565b6108ad565b005b61034c60048036038101906103479190611d67565b61096d565b005b610356610b16565b6040516103639190611da3565b60405180910390f35b610374610b3c565b604051610381919061223f565b60405180910390f35b6103a4600480360381019061039f9190611d67565b610b49565b005b6103ae610c25565b6040516103bb9190611dda565b60405180910390f35b6103de60048036038101906103d99190611d67565b610c2a565b005b6103fa60048036038101906103f5919061225a565b610d22565b604051610407919061232a565b60405180910390f35b610418611322565b6040516104259190611dda565b60405180910390f35b63780e9d6360e01b81565b60046020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600181565b606060018054905067ffffffffffffffff8111156104925761049161208d565b5b6040519080825280602002602001820160405280156104cb57816020015b6104b8611c3d565b8152602001906001900390816104b05790505b50905060005b60018054905081101561055857610526600182815481106104f5576104f461234c565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684610d22565b8282815181106105395761053861234c565b5b602002602001018190525060018161055191906123aa565b90506104d1565b50919050565b6380ac58cd60e01b81565b7fa61235620000000000000000000000000000000000000000000000000000000081565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6105bb611327565b73ffffffffffffffffffffffffffffffffffffffff166105d9610712565b73ffffffffffffffffffffffffffffffffffffffff161461062f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106269061245d565b60405180910390fd5b610639600061132f565b565b610643611327565b73ffffffffffffffffffffffffffffffffffffffff16610661610712565b73ffffffffffffffffffffffffffffffffffffffff16146106b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ae9061245d565b60405180910390fd5b6106c133476113f3565b565b63780e9d6360e01b81565b600081565b600181815481106106e357600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60006107456114e7565b90506107907fa6123562000000000000000000000000000000000000000000000000000000008273ffffffffffffffffffffffffffffffffffffffff166115d690919063ffffffff16565b6107cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107c6906124c9565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16634cd88b7684846040518363ffffffff1660e01b815260040161080a929190612522565b600060405180830381600087803b15801561082457600080fd5b505af1158015610838573d6000803e3d6000fd5b505050508073ffffffffffffffffffffffffffffffffffffffff1663f2fde38b336040518263ffffffff1660e01b81526004016108759190611da3565b600060405180830381600087803b15801561088f57600080fd5b505af11580156108a3573d6000803e3d6000fd5b5050505092915050565b6108b5611327565b73ffffffffffffffffffffffffffffffffffffffff166108d3610712565b73ffffffffffffffffffffffffffffffffffffffff1614610929576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109209061245d565b60405180910390fd5b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610975611327565b73ffffffffffffffffffffffffffffffffffffffff16610993610712565b73ffffffffffffffffffffffffffffffffffffffff16146109e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109e09061245d565b60405180910390fd5b6000806109f5836115fb565b915091508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5e906125a5565b60405180910390fd5b81610a7657610a7583610b49565b5b82600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f81bbf04250a28f0d5979a401ffb6705dcebf8b354060431d672cf1ea4594fc6760405160405180910390a3505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600180549050905090565b610b51611327565b73ffffffffffffffffffffffffffffffffffffffff16610b6f610712565b73ffffffffffffffffffffffffffffffffffffffff1614610bc5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bbc9061245d565b60405180910390fd5b600080610bd1836115fb565b915091508115610c16576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c0d90612611565b60405180910390fd5b610c2083826117c8565b505050565b600281565b610c32611327565b73ffffffffffffffffffffffffffffffffffffffff16610c50610712565b73ffffffffffffffffffffffffffffffffffffffff1614610ca6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c9d9061245d565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610d16576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0d906126a3565b60405180910390fd5b610d1f8161132f565b50565b610d2a611c3d565b6000600467ffffffffffffffff811115610d4757610d4661208d565b5b604051908082528060200260200182016040528015610d755781602001602082028036833780820191505090505b5090506380ac58cd60e01b81600060ff1681518110610d9757610d9661234c565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505063780e9d6360e01b81600160ff1681518110610e0257610e0161234c565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505063780e9d6360e01b81600260ff1681518110610e6d57610e6c61234c565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507fa61235620000000000000000000000000000000000000000000000000000000081600360ff1681518110610ef157610ef061234c565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250506000610f68828673ffffffffffffffffffffffffffffffffffffffff1661191e90919063ffffffff16565b905080600060ff1681518110610f8157610f8061234c565b5b60200260200101511561131a5784836000019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250508473ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401610fff9190611da3565b60206040518083038186803b15801561101757600080fd5b505afa15801561102b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104f91906126d8565b83602001818152505080600160ff168151811061106f5761106e61234c565b5b602002602001015115611193578473ffffffffffffffffffffffffffffffffffffffff166306fdde036040518163ffffffff1660e01b815260040160006040518083038186803b1580156110c257600080fd5b505afa1580156110d6573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906110ff9190612775565b83606001819052508473ffffffffffffffffffffffffffffffffffffffff166395d89b416040518163ffffffff1660e01b815260040160006040518083038186803b15801561114d57600080fd5b505afa158015611161573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061118a9190612775565b83608001819052505b80600260ff16815181106111aa576111a961234c565b5b60200260200101511561123f578473ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156111fd57600080fd5b505afa158015611211573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061123591906126d8565b8360a00181815250505b80600360ff16815181106112565761125561234c565b5b602002602001015115611319578473ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156112a957600080fd5b505afa1580156112bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112e191906127d3565b836040019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505b5b505092915050565b600381565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b80471015611436576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161142d9061284c565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff168260405161145c9061289d565b60006040518083038185875af1925050503d8060008114611499576040519150601f19603f3d011682016040523d82523d6000602084013e61149e565b606091505b50509050806114e2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114d990612924565b60405180910390fd5b505050565b60008073ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561157a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161157190612990565b60405180910390fd5b6115a5600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166119f0565b90506115d381600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166117c8565b90565b60006115e183611ac5565b80156115f357506115f28383611b12565b5b905092915050565b6000806000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663275e5da5856040518263ffffffff1660e01b815260040161165b9190611da3565b604080518083038186803b15801561167257600080fd5b505afa158015611686573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116aa91906129e8565b8093508192505050806116f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116e990612a74565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156117305761172f612a94565b5b600073ffffffffffffffffffffffffffffffffffffffff16600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415925050915091565b6001829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f053585d4de2374a5e4cee65e665171098bd6777e89041c2915cdac4d567cd93f60405160405180910390a45050565b60606000825167ffffffffffffffff81111561193d5761193c61208d565b5b60405190808252806020026020018201604052801561196b5781602001602082028036833780820191505090505b50905061197784611ac5565b156119e65760005b83518110156119e4576119ac8585838151811061199f5761199e61234c565b5b6020026020010151611b12565b8282815181106119bf576119be61234c565b5b60200260200101901515908115158152505080806119dc90612ac3565b91505061197f565b505b8091505092915050565b60006040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528260601b60148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f0915050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611ac0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ab790612b58565b60405180910390fd5b919050565b6000611af1827f01ffc9a700000000000000000000000000000000000000000000000000000000611b12565b8015611b0b5750611b098263ffffffff60e01b611b12565b155b9050919050565b6000806301ffc9a760e01b83604051602401611b2e9190611cda565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505090506000808573ffffffffffffffffffffffffffffffffffffffff1661753084604051611bb89190612bb4565b6000604051808303818686fa925050503d8060008114611bf4576040519150601f19603f3d011682016040523d82523d6000602084013e611bf9565b606091505b5091509150602081511015611c145760009350505050611c37565b818015611c31575080806020019051810190611c309190612bcb565b5b93505050505b92915050565b6040518060c00160405280600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160608152602001600081525090565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611cd481611c9f565b82525050565b6000602082019050611cef6000830184611ccb565b92915050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611d3482611d09565b9050919050565b611d4481611d29565b8114611d4f57600080fd5b50565b600081359050611d6181611d3b565b92915050565b600060208284031215611d7d57611d7c611cff565b5b6000611d8b84828501611d52565b91505092915050565b611d9d81611d29565b82525050565b6000602082019050611db86000830184611d94565b92915050565b600060ff82169050919050565b611dd481611dbe565b82525050565b6000602082019050611def6000830184611dcb565b92915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611e2a81611d29565b82525050565b6000819050919050565b611e4381611e30565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611e83578082015181840152602081019050611e68565b83811115611e92576000848401525b50505050565b6000601f19601f8301169050919050565b6000611eb482611e49565b611ebe8185611e54565b9350611ece818560208601611e65565b611ed781611e98565b840191505092915050565b600060c083016000830151611efa6000860182611e21565b506020830151611f0d6020860182611e3a565b506040830151611f206040860182611e21565b5060608301518482036060860152611f388282611ea9565b91505060808301518482036080860152611f528282611ea9565b91505060a0830151611f6760a0860182611e3a565b508091505092915050565b6000611f7e8383611ee2565b905092915050565b6000602082019050919050565b6000611f9e82611df5565b611fa88185611e00565b935083602082028501611fba85611e11565b8060005b85811015611ff65784840389528151611fd78582611f72565b9450611fe283611f86565b925060208a01995050600181019050611fbe565b50829750879550505050505092915050565b600060208201905081810360008301526120228184611f93565b905092915050565b61203381611e30565b811461203e57600080fd5b50565b6000813590506120508161202a565b92915050565b60006020828403121561206c5761206b611cff565b5b600061207a84828501612041565b91505092915050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6120c582611e98565b810181811067ffffffffffffffff821117156120e4576120e361208d565b5b80604052505050565b60006120f7611cf5565b905061210382826120bc565b919050565b600067ffffffffffffffff8211156121235761212261208d565b5b61212c82611e98565b9050602081019050919050565b82818337600083830152505050565b600061215b61215684612108565b6120ed565b90508281526020810184848401111561217757612176612088565b5b612182848285612139565b509392505050565b600082601f83011261219f5761219e612083565b5b81356121af848260208601612148565b91505092915050565b600080604083850312156121cf576121ce611cff565b5b600083013567ffffffffffffffff8111156121ed576121ec611d04565b5b6121f98582860161218a565b925050602083013567ffffffffffffffff81111561221a57612219611d04565b5b6122268582860161218a565b9150509250929050565b61223981611e30565b82525050565b60006020820190506122546000830184612230565b92915050565b6000806040838503121561227157612270611cff565b5b600061227f85828601611d52565b925050602061229085828601611d52565b9150509250929050565b600060c0830160008301516122b26000860182611e21565b5060208301516122c56020860182611e3a565b5060408301516122d86040860182611e21565b50606083015184820360608601526122f08282611ea9565b9150506080830151848203608086015261230a8282611ea9565b91505060a083015161231f60a0860182611e3a565b508091505092915050565b60006020820190508181036000830152612344818461229a565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006123b582611e30565b91506123c083611e30565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156123f5576123f461237b565b5b828201905092915050565b600082825260208201905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000612447602083612400565b915061245282612411565b602082019050919050565b600060208201905081810360008301526124768161243a565b9050919050565b7f436c6f6e65206973206e6f74204f70656e204e46547320636f6e747261637400600082015250565b60006124b3601f83612400565b91506124be8261247d565b602082019050919050565b600060208201905081810360008301526124e2816124a6565b9050919050565b60006124f482611e49565b6124fe8185612400565b935061250e818560208601611e65565b61251781611e98565b840191505092915050565b6000604082019050818103600083015261253c81856124e9565b9050818103602083015261255081846124e9565b90509392505050565b7f54656d706c617465206973206120436c6f6e6500000000000000000000000000600082015250565b600061258f601383612400565b915061259a82612559565b602082019050919050565b600060208201905081810360008301526125be81612582565b9050919050565b7f496d706c656d656e746174696f6e20616c726561647920657869737473000000600082015250565b60006125fb601d83612400565b9150612606826125c5565b602082019050919050565b6000602082019050818103600083015261262a816125ee565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b600061268d602683612400565b915061269882612631565b604082019050919050565b600060208201905081810360008301526126bc81612680565b9050919050565b6000815190506126d28161202a565b92915050565b6000602082840312156126ee576126ed611cff565b5b60006126fc848285016126c3565b91505092915050565b600061271861271384612108565b6120ed565b90508281526020810184848401111561273457612733612088565b5b61273f848285611e65565b509392505050565b600082601f83011261275c5761275b612083565b5b815161276c848260208601612705565b91505092915050565b60006020828403121561278b5761278a611cff565b5b600082015167ffffffffffffffff8111156127a9576127a8611d04565b5b6127b584828501612747565b91505092915050565b6000815190506127cd81611d3b565b92915050565b6000602082840312156127e9576127e8611cff565b5b60006127f7848285016127be565b91505092915050565b7f416464726573733a20696e73756666696369656e742062616c616e6365000000600082015250565b6000612836601d83612400565b915061284182612800565b602082019050919050565b6000602082019050818103600083015261286581612829565b9050919050565b600081905092915050565b50565b600061288760008361286c565b915061289282612877565b600082019050919050565b60006128a88261287a565b9150819050919050565b7f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260008201527f6563697069656e74206d61792068617665207265766572746564000000000000602082015250565b600061290e603a83612400565b9150612919826128b2565b604082019050919050565b6000602082019050818103600083015261293d81612901565b9050919050565b7f54656d706c61746520646f65736e277420657869737400000000000000000000600082015250565b600061297a601683612400565b915061298582612944565b602082019050919050565b600060208201905081810360008301526129a98161296d565b9050919050565b60008115159050919050565b6129c5816129b0565b81146129d057600080fd5b50565b6000815190506129e2816129bc565b92915050565b600080604083850312156129ff576129fe611cff565b5b6000612a0d858286016129d3565b9250506020612a1e858286016127be565b9150509250929050565b7f4e6f74206120436f6e7472616374000000000000000000000000000000000000600082015250565b6000612a5e600e83612400565b9150612a6982612a28565b602082019050919050565b60006020820190508181036000830152612a8d81612a51565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6000612ace82611e30565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612b0157612b0061237b565b5b600182019050919050565b7f455243313136373a20637265617465206661696c656400000000000000000000600082015250565b6000612b42601683612400565b9150612b4d82612b0c565b602082019050919050565b60006020820190508181036000830152612b7181612b35565b9050919050565b600081519050919050565b6000612b8e82612b78565b612b98818561286c565b9350612ba8818560208601611e65565b80840191505092915050565b6000612bc08284612b83565b915081905092915050565b600060208284031215612be157612be0611cff565b5b6000612bef848285016129d3565b9150509291505056fea26469706673582212201db6bda6d7a790623a858a640996fe7f069ad484331df7ca72541f7bf838946064736f6c63430008090033";

type NFTsFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTsFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFTsFactory__factory extends ContractFactory {
  constructor(...args: NFTsFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NFTsFactory> {
    return super.deploy(overrides || {}) as Promise<NFTsFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NFTsFactory {
    return super.attach(address) as NFTsFactory;
  }
  connect(signer: Signer): NFTsFactory__factory {
    return super.connect(signer) as NFTsFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTsFactoryInterface {
    return new utils.Interface(_abi) as NFTsFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NFTsFactory {
    return new Contract(address, _abi, signerOrProvider) as NFTsFactory;
  }
}
