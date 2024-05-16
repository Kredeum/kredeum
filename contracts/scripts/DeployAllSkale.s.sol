// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployOpenNFTsResolverSkale} from "./deploy/skale/DeployOpenNFTsResolverSkale.s.sol";
import {DeployOpenNFTsV4Skale} from "./deploy/skale/DeployOpenNFTsV4Skale.s.sol";

contract DeployAllCurrent is DeployOpenNFTsResolverSkale, DeployOpenNFTsV4Skale {
    function run() public override(DeployOpenNFTsResolverSkale, DeployOpenNFTsV4Skale) {
        console.log("chainId %s  msg.sender @%s", block.chainid, msg.sender);

        deployOpenNFTsResolver();
        deployOpenNFTsV4Skale();
    }
}
