// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./KredeumNFTs.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract KredeumNFTsFactory {
  address immutable KredeumNFTsImplementation;

  event NewKredeumNFTs(address indexed clone, address indexed creator);

  constructor() {
    KredeumNFTsImplementation = address(new KredeumNFTs());
  }

  function createKredeumNFTs() external returns (address clone) {
    clone = Clones.clone(KredeumNFTsImplementation);
    // KredeumNFTs(clone).initialize(msg.sender);

    emit NewKredeumNFTs(clone, msg.sender);
  }
}
