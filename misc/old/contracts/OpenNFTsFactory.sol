// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./OpenNFTs.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract OpenNFTsFactory {
  address openNFTsImplementation;

  event NewOpenNFTs(address indexed clone, address indexed creator);

  constructor() {
    openNFTsImplementation = address(new OpenNFTs());
  }

  function createOpenNFTs() external returns (address clone) {
    clone = Clones.clone(openNFTsImplementation);
    emit NewOpenNFTs(clone, msg.sender);
  }
}
