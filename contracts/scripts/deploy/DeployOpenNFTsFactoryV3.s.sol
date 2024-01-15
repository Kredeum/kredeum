// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";

import {console} from "forge-std/console.sol";

contract DeployOpenNFTsFactoryV3 is DeployLite {
    function deployOpenNFTsFactoryV3() public returns (address) {
        address treasuryAccount = 0x47e2382D9e1e985BA1F4064E7D8d753Fab99F209;
        uint96 treasuryFee = 90;

        bytes memory args = abi.encode(msg.sender, treasuryAccount, treasuryFee);
        DeployState state = deployState("OpenNFTsFactoryV3", args);

        if (state == DeployState.None) {
            vm.broadcast();
            deploy("OpenNFTsFactoryV3", args);
        }

        return readAddress("OpenNFTsFactoryV3");
    }

    function run() public virtual {
        deployOpenNFTsFactoryV3();
    }
}
