// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployLite, console} from "forge-deploy-lite/DeployLite.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";

contract DeployOpenNFTsResolver is DeployLite {
    function deployOpenNFTsResolver() public returns (address openNFTsResolver) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");
        address openNFTsResolverOld = readAddress("OpenNFTsResolver");

        require(deployer == OpenNFTsFactoryV3(openNFTsFactoryV3).owner(), "Deployer must be OpenNFTsFactoryV3 owner !");

        vm.startBroadcast(deployer);

        openNFTsResolver = address(new OpenNFTsResolver(deployer, openNFTsFactoryV3));

        OpenNFTsFactoryV3(openNFTsFactoryV3).setResolver(openNFTsResolver);

        if (openNFTsResolverOld != address(0)) {
            // migrate addresses from old to new
            address[] memory addresses = OpenNFTsResolver(openNFTsResolverOld).getAddresses();
            console.log("deployOpenNFTsResolver addresses to migrate:", addresses.length);

            // may reverts out of gas if too much addresses...
            try OpenNFTsResolver(openNFTsResolver).addAddresses(addresses) {
                console.log("deployOpenNFTsResolver migration OK");
            } catch {
                console.log("deployOpenNFTsResolver migration KO");
            }
        }

        vm.stopBroadcast();
    }

    function run() public virtual {
        deploy("OpenNFTsResolver");
    }
}
