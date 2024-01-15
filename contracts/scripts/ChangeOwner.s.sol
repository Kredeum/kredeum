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
        address newOwner = 0xD4E6d94c8F20eAc6695163Bed93D8EFfdB637cb9;

        address deployer = 0x62680309dA3Cd77FDeDa85022be3058d373F750d;
        console.log("chainId %s  deployer @%s  newOwner @%s", block.chainid, deployer, newOwner);

        openNFTsFactoryV3 = readAddress("OpenNFTsFactoryV3");
        openFactory = OpenNFTsFactoryV3(openNFTsFactoryV3);
        openResolver = openFactory.nftsResolver();
        openNFTsV4 = openFactory.template("OpenNFTsV4");
        openAutoMarket = openFactory.template("OpenAutoMarket");

        uint256 countTemplates = openFactory.countTemplates();
        uint256 countCollections = OpenNFTsResolver(openResolver).countAddresses();
        console.log("%s collections  %s templates", countCollections, countTemplates);

        logAdressesAndOwners();

        // send value to pay for gas of next transactions
        // address paymaster = 0x981ab0D817710d8FFFC5693383C00D985A3BDa38;
        // vm.broadcast(paymaster);
        // deployer.call{value: 1_000_000 gwei}("");

        if (deployer != newOwner) {
            if (deployer == openFactoryOwner) {
                console.log("OpenNFTsFactoryV3  owner change from @%s to @%s", openFactoryOwner, newOwner);
                vm.broadcast(deployer);
                openFactory.transferOwnership(newOwner);
            }

            if (deployer == openResolverOwner) {
                console.log("OpenNFTsResolver   owner change from @%s to @%s", openResolverOwner, newOwner);
                vm.broadcast(deployer);
                OpenERC173(openResolver).transferOwnership(newOwner);
            }

            if (deployer == openNFTsV4Owner) {
                console.log("OpenNFTsV4         owner change from @%s to @%s", openNFTsV4Owner, newOwner);
                vm.broadcast(deployer);
                OpenERC173(openNFTsV4).transferOwnership(newOwner);
            }

            if (deployer == openAutoMarketOwner) {
                console.log("OpenAutoMarket     owner change from @%s to @%s", openAutoMarketOwner, newOwner);
                vm.broadcast(deployer);
                OpenERC173(openAutoMarket).transferOwnership(newOwner);
            }

            logAdressesAndOwners();
        }
    }
}
