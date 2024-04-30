// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsV4Skale} from "src/OpenNFTsV4Skale.sol";

contract DeployOpenNFTsV4Skale is DeployLite {
    function deployOpenNFTsV4Skale() public returns (address) {
        address openNFTsV4Skale = deployLite("OpenNFTsV4Skale");

        bool initialized = OpenNFTsV4Skale(openNFTsV4Skale).initialized();

        if (!initialized) {
            bool[] memory options = new bool[](1);
            options[0] = true;

            vm.broadcast();
            OpenNFTsV4Skale(openNFTsV4Skale).initialize(
                "OpenNFTsV4", "ONFTSKL", msg.sender, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
            );
        }
        return openNFTsV4Skale;
    }

    function run() public virtual {
        deployOpenNFTsV4Skale();
    }
}
