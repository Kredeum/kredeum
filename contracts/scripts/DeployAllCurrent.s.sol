// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployOpenNFTsFactoryV3} from "./deploy/DeployOpenNFTsFactoryV3.s.sol";
import {DeployOpenNFTsResolver} from "./deploy/DeployOpenNFTsResolver.s.sol";
import {DeployOpenNFTsV4} from "./deploy/DeployOpenNFTsV4.s.sol";
import {DeployOpenAutoMarket} from "./deploy/DeployOpenAutoMarket.s.sol";

contract DeployAllCurrent is
    DeployOpenNFTsFactoryV3,
    DeployOpenNFTsResolver,
    DeployOpenNFTsV4,
    DeployOpenAutoMarket
{
    function run()
        public
        override(DeployOpenNFTsFactoryV3, DeployOpenNFTsResolver, DeployOpenNFTsV4, DeployOpenAutoMarket)
    {
        console.log("chainId %s  msg.sender @%s", block.chainid, msg.sender);

        deployOpenNFTsFactoryV3();
        // deployOpenNFTsResolver();
        // deployOpenNFTsV4();
        // deployOpenAutoMarket();
    }
}
