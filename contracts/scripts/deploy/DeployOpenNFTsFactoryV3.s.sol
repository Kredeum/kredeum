// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";

import {console} from "forge-std/console.sol";

contract DeployOpenNFTsFactoryV3 is DeployLite {
    function deployOpenNFTsFactoryV3() public returns (address) {
        address treasuryAccount = vm.envAddress("TREASURY_ACCOUNT");
        console.log("deployOpenNFTsFactoryV3 ~ treasuryAccount:", treasuryAccount);
        uint96 treasuryFee = 90;

        bytes memory args = abi.encode(msg.sender, treasuryAccount, treasuryFee);
        DeployState state = deployState("OpenNFTsFactoryV3");

        if (state == DeployState.None) {
            vm.broadcast();
            deployLite("OpenNFTsFactoryV3", args);
        }

        return readAddress("OpenNFTsFactoryV3");
    }

    function run() public virtual {
        deployOpenNFTsFactoryV3();
    }
}
