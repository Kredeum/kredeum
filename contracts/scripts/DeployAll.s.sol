// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import "./DeployLib.sol";
import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";
import {OpenNFTsV4} from "src/OpenNFTsV4.sol";
import {OpenAutoMarket} from "src/OpenAutoMarket.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract DeployAll is DeployLib {
    address deployer;

    address immutable treasuryAccount = 0x47e2382D9e1e985BA1F4064E7D8d753Fab99F209;
    uint96 immutable treasuryFee = 90;

    function deployOpenNFTsFactoryV3() public returns (address openNFTsFactoryV3) {
        vm.startBroadcast();

        openNFTsFactoryV3 = address(new OpenNFTsFactoryV3(deployer, treasuryAccount, treasuryFee));

        vm.stopBroadcast();
    }

    function deployOpenNFTsResolver() public returns (address openNFTsResolver) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        vm.startBroadcast();

        openNFTsResolver = address(new OpenNFTsResolver(deployer, openNFTsFactoryV3));

        if (openNFTsFactoryV3 != address(0)) {
            OpenNFTsFactoryV3(openNFTsFactoryV3).setResolver(openNFTsResolver);
        }

        vm.stopBroadcast();
    }

    function deployOpenNFTsV4() public returns (address openNFTsV4) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");

        vm.startBroadcast();

        openNFTsV4 = address(new OpenNFTsV4());

        bool[] memory options = new bool[](1);
        options[0] = true;
        OpenNFTsV4(openNFTsV4).initialize(
            "OpenNFTsV4", "ONFT", deployer, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );

        if (openNFTsFactoryV3 != address(0)) {
            OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenNFTsV4", openNFTsV4);
        }

        vm.stopBroadcast();
    }

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

        if (openNFTsFactoryV3 != address(0)) {
            OpenNFTsFactoryV3(openNFTsFactoryV3).setTemplate("OpenAutoMarket", openAutoMarket);
        }

        vm.stopBroadcast();
    }

    function run() public {
        deployer = msg.sender;
        console.log("chainId", block.chainid, "deployer", deployer);

        deploy("OpenNFTsFactoryV3");
        deploy("OpenNFTsResolver");
        deploy("OpenNFTsV4");
        deploy("OpenAutoMarket");
    }
}
