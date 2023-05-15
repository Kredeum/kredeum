// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployOpenNFTsFactoryV3} from "./DeployOpenNFTsFactoryV3.s.sol";
import {DeployOpenNFTsResolver} from "./DeployOpenNFTsResolver.s.sol";
import {DeployOpenNFTsV4} from "./DeployOpenNFTsV4.s.sol";
import {DeployOpenAutoMarket} from "./DeployOpenAutoMarket.s.sol";
import {DeployOpenBound} from "./DeployOpenBound.s.sol";

contract DeployAll is
    DeployOpenNFTsFactoryV3,
    DeployOpenNFTsResolver,
    DeployOpenNFTsV4,
    DeployOpenAutoMarket,
    DeployOpenBound
{
    function run()
        public
        override(DeployOpenNFTsFactoryV3, DeployOpenNFTsResolver, DeployOpenNFTsV4, DeployOpenAutoMarket, DeployOpenBound)
    {
        console.log("chainId %s  msg.sender @%s", block.chainid, msg.sender);

        deploy("OpenNFTsFactoryV3");
        deploy("OpenNFTsResolver");
        deploy("OpenNFTsV4");
        deploy("OpenAutoMarket");
        deploy("OpenBound");
    }
}
