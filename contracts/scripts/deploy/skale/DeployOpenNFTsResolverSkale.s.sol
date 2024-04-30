// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

contract DeployOpenNFTsResolverSkale is DeployLite {
    function deployOpenNFTsResolver() public returns (address) {
        return deployLite("OpenNFTsResolver", abi.encode(msg.sender, address(0)));
    }

    function run() public virtual {
        deployOpenNFTsResolver();
    }
}
