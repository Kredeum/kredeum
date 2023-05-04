// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import {DeployLib} from "./DeployLib.sol";
import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";

contract DeployOpenNFTsResolver is DeployLib {
    function deployOpenNFTsResolver() public returns (address openNFTsResolver) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        vm.startBroadcast();

        openNFTsResolver = address(new OpenNFTsResolver(deployer, openNFTsFactoryV3));

        OpenNFTsFactoryV3(openNFTsFactoryV3).setResolver(openNFTsResolver);

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenNFTsResolver");
    }
}
