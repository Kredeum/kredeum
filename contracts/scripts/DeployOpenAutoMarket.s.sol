// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenAutoMarket} from "src/OpenAutoMarket.sol";

contract DeployOpenAutoMarket is DeployLite {
    function deployOpenAutoMarket() public returns (address openAutoMarket) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        require(deployer == OpenNFTsFactoryV3(openNFTsFactoryV3).owner(), "Deployer must be OpenNFTsFactoryV3 owner !");

        vm.startBroadcast(deployer);

        openAutoMarket = address(new OpenAutoMarket());

        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = true;
        OpenAutoMarket(payable(openAutoMarket)).initialize(
            "OpenAutoMarket", "OMKT", deployer, abi.encode(abi.encode(0, deployer, 0, options), address(0), 0)
        );

        OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenAutoMarket", openAutoMarket);

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenAutoMarket");
    }
}
