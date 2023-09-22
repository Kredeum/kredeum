// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenBound} from "src/next/OpenBound.sol";

contract DeployOpenBound is DeployLite {
    function deployOpenBound() public returns (address openBound) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        require(deployer == OpenNFTsFactoryV3(openNFTsFactoryV3).owner(), "Deployer must be OpenNFTsFactoryV3 owner !");

        vm.startBroadcast(deployer);

        openBound = address(new OpenBound());

        OpenBound(openBound).initialize("OpenBound", "BOUND", deployer, abi.encode(abi.encode(0), address(0), 0));

        OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenBound", openBound);

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenBound");
    }
}
