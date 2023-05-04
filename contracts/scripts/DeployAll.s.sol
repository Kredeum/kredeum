// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import {DeployOpenNFTsFactoryV3} from "./DeployOpenNFTsFactoryV3.s.sol";
import {DeployOpenNFTsResolver} from "./DeployOpenNFTsResolver.s.sol";
import {DeployOpenNFTsV4} from "./DeployOpenNFTsV4.s.sol";
import {DeployOpenAutoMarket} from "./DeployOpenAutoMarket.s.sol";

contract DeployAll is DeployOpenNFTsFactoryV3, DeployOpenNFTsResolver, DeployOpenNFTsV4, DeployOpenAutoMarket {
    function run()
        public
        override(DeployOpenNFTsFactoryV3, DeployOpenNFTsResolver, DeployOpenNFTsV4, DeployOpenAutoMarket)
    {
        console.log("chainId %s  msg.sender @%s", block.chainid, msg.sender);

        deploy("OpenNFTsFactoryV3");
        deploy("OpenNFTsResolver");
        deploy("OpenNFTsV4");
        deploy("OpenAutoMarket");
    }
}
