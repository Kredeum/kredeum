// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import "forge-std/Script.sol";

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";
import {DeployOpenNFTsFactoryV3} from "./DeployOpenNFTsFactoryV3.s.sol";

contract DeployOpenNFTsResolver is DeployLite, DeployOpenNFTsFactoryV3 {
    function deployOpenNFTsResolver() public returns (address) {
        address openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");
        address openNFTsResolverOld = readAddress("OpenNFTsResolver");

        require(
            msg.sender == OpenNFTsFactoryV3(openNFTsFactoryV3).owner(), "Deployer must be OpenNFTsFactoryV3 owner !"
        );

        bytes memory args = abi.encode(msg.sender, openNFTsFactoryV3);
        DeployState state = deployState("OpenNFTsResolver", args);

        if (state == DeployState.None || state == DeployState.Older) {
            vm.startBroadcast();

            address openNFTsResolver = deploy("OpenNFTsResolver", args);

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

        return readAddress("OpenNFTsResolver");
    }

    function run() public virtual override(DeployOpenNFTsFactoryV3) {
        deployOpenNFTsResolver();
    }
}
