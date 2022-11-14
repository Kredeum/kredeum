// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import "../OpenNFTsFactoryV3.sol";
import "../OpenNFTsResolver.sol";
import "../OpenNFTsV4.sol";
import "../OpenAutoMarket.sol";
import "../interfaces/IOpenNFTsInfos.sol";

// interface IERC20 {
//     function totalSupply() external returns (uint256);
// }

contract Deploy is Script {
    address treasury = makeAddr("treasury");
    uint96 treasuryFee = 90;

    OpenNFTsResolver openNFTsResolver;
    OpenNFTsFactoryV3 openNFTsFactoryV3;
    OpenNFTsV4 openNFTsV4;
    OpenAutoMarket openAutoMarket;

    function run() public {
        address owner = msg.sender;

        bool[] memory optionsNFTsV4 = new bool[](1);
        optionsNFTsV4[0] = true;

        bool[] memory optionsAutoMarket = new bool[](2);
        optionsAutoMarket[0] = true;
        optionsAutoMarket[1] = true;

        vm.startBroadcast();

        openNFTsFactoryV3 = new OpenNFTsFactoryV3(owner, treasury, treasuryFee);
        openNFTsResolver = new OpenNFTsResolver(owner, address(openNFTsFactoryV3));
        openNFTsFactoryV3.setResolver(address(openNFTsResolver));

        openNFTsV4 = new OpenNFTsV4();
        openNFTsV4.initialize(
            "OpenNFTsV4",
            "ONFT",
            owner,
            abi.encode(abi.encode(0, owner, 0, optionsNFTsV4), treasury, treasuryFee)
        );
        openNFTsFactoryV3.setTemplate("OpenNFTsV4", address(openNFTsV4));

        openAutoMarket = new OpenAutoMarket();
        openAutoMarket.initialize(
            "OpenAutoMarket",
            "OMKT",
            owner,
            abi.encode(abi.encode(0, owner, 0, optionsAutoMarket), treasury, treasuryFee)
        );
        openNFTsFactoryV3.setTemplate("OpenAutoMarket", address(openAutoMarket));

        vm.stopBroadcast();

        console.log("owner", owner);
        console.log("treasury", treasury);
        console.log("openNFTsResolver", address(openNFTsResolver));
        console.log("openNFTsFactoryV3", address(openNFTsFactoryV3));
        console.log("openNFTsV4", address(openNFTsV4));
        console.log("openAutoMarket", address(openAutoMarket));
    }
}
