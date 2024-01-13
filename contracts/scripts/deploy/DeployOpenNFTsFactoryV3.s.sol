// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {console} from "forge-std/console.sol";

contract DeployOpenNFTsFactoryV3 is DeployLite {
    function deployOpenNFTsFactoryV3() public returns (address openNFTsFactoryV3) {
        address treasuryAccount = 0x47e2382D9e1e985BA1F4064E7D8d753Fab99F209;
        uint96 treasuryFee = 90;

        address addr1 = readAddress("OpenNFTsFactoryV3");
        console.log("deployOpenNFTsFactoryV3 ~ addr1:", addr1);

        bytes memory args = abi.encode(msg.sender, treasuryAccount, treasuryFee);
        DeployState state = deployState("OpenNFTsFactoryV3", args);
        console.log("deployOpenNFTsFactoryV3 ~ state:", uint256(state));

        address addr2 = readAddress("OpenNFTsFactoryV3");
        console.log("deployOpenNFTsFactoryV3 ~ addr2:", addr2);

        if (state == DeployState.None) {
            vm.broadcast();
            address addr3 = deploy("OpenNFTsFactoryV3", args);
            console.log("deployOpenNFTsFactoryV3 ~ addr3:", addr3);
        }

        address addr4 = readAddress("OpenNFTsFactoryV3");
        console.log("deployOpenNFTsFactoryV3 ~ addr4:", addr4);

        return readAddress("OpenNFTsFactoryV3");
    }

    function run() public virtual {
        deployOpenNFTsFactoryV3();
    }
}
