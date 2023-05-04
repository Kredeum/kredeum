// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import {DeployLib} from "./DeployLib.sol";
import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenAutoMarket} from "src/OpenAutoMarket.sol";

contract DeployOpenAutoMarket is DeployLib {
    function deployOpenAutoMarket() public returns (address openAutoMarket) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        vm.startBroadcast();
        openAutoMarket = address(new OpenAutoMarket());

        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = true;
        OpenAutoMarket(openAutoMarket).initialize(
            "OpenAutoMarket",
            "OMKT",
            deployer,
            abi.encode(abi.encode(0, deployer, 0, options), treasuryAccount, treasuryFee)
        );

        OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenAutoMarket", openAutoMarket);

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenAutoMarket");
    }
}
