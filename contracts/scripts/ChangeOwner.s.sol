// SPDX-License-Identifier: MITs
pragma solidity 0.8.19;

import {DeployLite} from "@forge-deploy-lite/DeployLite.s.sol";

import "forge-std/Script.sol";
import {OpenNFTsFactoryV3} from "src/OpenNFTsFactoryV3.sol";
import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";
import {OpenERC173} from "@opennfts/contracts/OpenERC/OpenERC173.sol";

contract ChangeOwner is Script, DeployLite {
    OpenNFTsFactoryV3 openFactory;
    address openNFTsFactoryV3;
    address openFactoryOwner;
    address openResolver;
    address openNFTsV4;
    address openAutoMarket;
    address openResolverOwner;
    address openNFTsV4Owner;
    address openAutoMarketOwner;

    function logAdressesAndOwners() public {
        console.log(" ");

        openFactoryOwner = openFactory.owner();
        console.log("openNFTsFactoryV3 at @%s  owner @%s", openNFTsFactoryV3, openFactoryOwner);

        openResolverOwner = OpenERC173(openResolver).owner();
        console.log("openResolver      at @%s  owner @%s", openResolver, openResolverOwner);

        openNFTsV4Owner = OpenERC173(openNFTsV4).owner();
        console.log("openNFTsV4        at @%s  owner @%s", openNFTsV4, openNFTsV4Owner);

        openAutoMarketOwner = OpenERC173(openAutoMarket).owner();
        console.log("openAutoMarket    at @%s  owner @%s", openAutoMarket, openAutoMarketOwner);

        console.log(" ");
    }

    function run() public {
        // address newOwner = 0xBC0b437C95c7165F7d1F7C966cb2227DA52a27d7; // kredeum.eth
        // address newOwner = 0x6eebAe27d69fa80f0E4C0E973A2Fed218A56880c;
        address newOwner = 0x62680309dA3Cd77FDeDa85022be3058d373F750d;
        address deployer = msg.sender;
        console.log("chainId %s  deployer @%s  newOwner @%s", block.chainid, deployer, newOwner);

        require(deployer != newOwner, "Deployer not newOwner");

        openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");
        openFactory = OpenNFTsFactoryV3(openNFTsFactoryV3);
        openResolver = openFactory.nftsResolver();
        openNFTsV4 = openFactory.template("OpenNFTsV4");
        openAutoMarket = openFactory.template("OpenAutoMarket");

        uint256 countTemplates = openFactory.countTemplates();
        uint256 countCollections = OpenNFTsResolver(openResolver).countAddresses();
        console.log("%s collections  %s templates", countCollections, countTemplates);

        logAdressesAndOwners();
        vm.startBroadcast();

        if (openFactoryOwner == deployer) {
            console.log("OpenNFTsFactoryV3  owner change from @%s to @%s", openFactoryOwner, newOwner);
            openFactory.transferOwnership(newOwner);
        }

        if (openResolverOwner == deployer) {
            console.log("OpenNFTsResolver   owner change from @%s to @%s", openResolverOwner, newOwner);
            OpenERC173(openResolver).transferOwnership(newOwner);
        }

        if (openNFTsV4Owner == deployer) {
            console.log("OpenNFTsV4         owner change from @%s to @%s", openNFTsV4Owner, newOwner);
            OpenERC173(openNFTsV4).transferOwnership(newOwner);
        }

        if (openAutoMarketOwner == deployer) {
            console.log("OpenAutoMarket owner change from @%s to @%s", openAutoMarketOwner, newOwner);
            OpenERC173(openAutoMarket).transferOwnership(newOwner);
        }

        vm.stopBroadcast();
        logAdressesAndOwners();
    }
}
