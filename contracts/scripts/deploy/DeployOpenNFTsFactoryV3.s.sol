// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";

import {console} from "forge-std/console.sol";

contract DeployOpenNFTsFactoryV3 is DeployLite {
    function deployOpenNFTsFactoryV3() public returns (address) {
        address treasuryAccount = vm.envAddress("TREASURY_ACCOUNT");
        uint96 treasuryFee = 90;

        bytes memory args = abi.encode(msg.sender, treasuryAccount, treasuryFee);

        return deployLite("OpenNFTsFactoryV3", args);
    }

    function run() public virtual {
        deployOpenNFTsFactoryV3();
    }
}
