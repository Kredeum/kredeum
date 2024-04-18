// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsV4Skale} from "src/OpenNFTsV4Skale.sol";

contract DeployOpenNFTsV4Skale is DeployLite {
    function deployOpenNFTsV4Skale() public returns (address) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        require(
            msg.sender == OpenNFTsFactoryV3(openNFTsFactoryV3).owner(), "Deployer must be OpenNFTsFactoryV3 owner !"
        );

        DeployState state = deployState("OpenNFTsV4Skale");

        if (state == DeployState.None) {
            vm.startBroadcast(msg.sender);

            address openNFTsV4Skale = deploy("OpenNFTsV4Skale");

            bool[] memory options = new bool[](1);
            options[0] = true;
            OpenNFTsV4Skale(openNFTsV4Skale).initialize(
                "OpenNFTsV4Skale", "ONFTSKL", msg.sender, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
            );

            OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenNFTsV4Skale", openNFTsV4Skale);

            vm.stopBroadcast();
        }

        return readAddress("OpenNFTsV4Skale");
    }

    function run() public virtual {
        deployOpenNFTsV4Skale();
    }
}
