// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLib} from "./DeployLib.sol";
import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsV4} from "src/OpenNFTsV4.sol";

contract DeployOpenNFTsV4 is DeployLib {
    function deployOpenNFTsV4() public returns (address openNFTsV4) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        vm.startBroadcast();

        openNFTsV4 = address(new OpenNFTsV4());

        bool[] memory options = new bool[](1);
        options[0] = true;
        OpenNFTsV4(openNFTsV4).initialize(
            "OpenNFTsV4", "ONFT", deployer, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );

        OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenNFTsV4", openNFTsV4);

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenNFTsV4");
    }
}
