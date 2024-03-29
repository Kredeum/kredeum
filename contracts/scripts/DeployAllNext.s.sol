// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployOpenNFTsFactoryV3} from "./DeployOpenNFTsFactoryV3.s.sol";
import {DeployOpenNFTsResolverV4} from "./DeployOpenNFTsResolverV4.s.sol";
import {DeployOpenNFTsV5} from "./DeployOpenNFTsV5.s.sol";
import {DeployOpenAutoMarket} from "./DeployOpenAutoMarket.s.sol";
import {DeployOpenBound} from "./DeployOpenBound.s.sol";

contract DeployAllNext is
    DeployOpenNFTsFactoryV3,
    DeployOpenNFTsResolverV4,
    DeployOpenNFTsV5,
    DeployOpenAutoMarket,
    DeployOpenBound
{
    function run()
        public
        override(DeployOpenNFTsFactoryV3, DeployOpenNFTsResolverV4, DeployOpenNFTsV5, DeployOpenAutoMarket, DeployOpenBound)
    {
        console.log("chainId %s  msg.sender @%s", block.chainid, msg.sender);

        deploy("OpenNFTsFactoryV3");
        deploy("OpenNFTsResolverV4");
        deploy("OpenNFTsV5");
        deploy("OpenAutoMarket");
        deploy("OpenBound");
    }
}
