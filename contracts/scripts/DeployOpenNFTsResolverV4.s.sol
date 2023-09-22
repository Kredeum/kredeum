// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployLite} from "forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsResolverV4} from "src/next/OpenNFTsResolverV4.sol";

contract DeployOpenNFTsResolverV4 is DeployLite {
    function deployOpenNFTsResolverV4() public returns (address openNFTsResolverV4) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        require(deployer == OpenNFTsFactoryV3(openNFTsFactoryV3).owner(), "Deployer must be OpenNFTsFactoryV3 owner !");

        vm.startBroadcast(deployer);

        openNFTsResolverV4 = address(new OpenNFTsResolverV4(deployer, openNFTsFactoryV3));

        OpenNFTsFactoryV3(openNFTsFactoryV3).setResolver(openNFTsResolverV4);

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenNFTsResolverV4");
    }
}
