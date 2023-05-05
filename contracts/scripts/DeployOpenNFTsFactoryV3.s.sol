// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployLib} from "./DeployLib.sol";
import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";

contract DeployOpenNFTsFactoryV3 is DeployLib {
    function deployOpenNFTsFactoryV3() public returns (address openNFTsFactoryV3) {
        vm.startBroadcast();

        openNFTsFactoryV3 = address(new OpenNFTsFactoryV3(deployer, treasuryAccount, treasuryFee));

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenNFTsFactoryV3");
    }
}
