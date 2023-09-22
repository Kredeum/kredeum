// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";

contract DeployOpenNFTsFactoryV3 is DeployLite {
    address immutable treasuryAccount = 0x47e2382D9e1e985BA1F4064E7D8d753Fab99F209;
    uint96 immutable treasuryFee = 90;

    function deployOpenNFTsFactoryV3() public returns (address openNFTsFactoryV3) {
        vm.startBroadcast(deployer);

        openNFTsFactoryV3 = address(new OpenNFTsFactoryV3(deployer, treasuryAccount, treasuryFee));

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenNFTsFactoryV3");
    }
}
