// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "forge-deploy-lite/DeployLite.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsV5} from "src/next/OpenNFTsV5.sol";

contract DeployOpenNFTsV5 is DeployLite {
    function deployOpenNFTsV5() public returns (address openNFTsV5) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        vm.startBroadcast();

        openNFTsV5 = address(new OpenNFTsV5());

        bool[] memory options = new bool[](1);
        options[0] = true;
        OpenNFTsV5(openNFTsV5).initialize(
            "OpenNFTsV5", "ONFT", deployer, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );

        OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenNFTsV5", openNFTsV5);

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenNFTsV5");
    }
}
