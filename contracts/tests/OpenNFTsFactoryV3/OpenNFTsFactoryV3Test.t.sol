// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import "src/OpenNFTsFactoryV3.sol";
import "src/OpenNFTsResolver.sol";
import "src/OpenNFTsV4.sol";
import "src/OpenAutoMarket.sol";

import "OpenNFTs/contracts/tests/units/ERC173Test.t.sol";
import "./OpenNFTsFactoryV3CloneTest.t.sol";

contract OpenNFTsFactoryV3Test is ERC173Test, OpenNFTsFactoryV3CloneTest {
    function constructorTest(address owner) public override(ERC173Test, OpenNFTsFactoryV3CloneTest) returns (address) {
        changePrank(owner);

        // FACTORY
        OpenNFTsFactoryV3 factory = new OpenNFTsFactoryV3(owner, makeAddr("treasury"), 90);

        // RESOLVER
        OpenNFTsResolver resolver = new OpenNFTsResolver(owner, address(factory));
        factory.setResolver(address(resolver));

        // OPEN_NFTS
        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = false;

        // TEMPLATE OpenNFTsV4
        OpenNFTsV4 _openNFTsV4 = new OpenNFTsV4();
        _openNFTsV4.initialize(
            "OpenNFTsV4 for OpenNFTsFactoryV3Test",
            "OPTEST",
            owner,
            abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );
        factory.setTemplate("OpenNFTsV4", address(_openNFTsV4));

        // TEMPLATE OpenAutoMarket
        OpenAutoMarket _openAutoMarket = new OpenAutoMarket();
        IOpenCloneable(_openAutoMarket).initialize(
            "OpenNFTsFactoryV3Test",
            "OPTESTOPTEST",
            owner,
            abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );
        factory.setTemplate("OpenAutoMarket", address(_openAutoMarket));

        return address(factory);
    }

    function setUp() public {
        setUpERC173();
        setUpOpenNFTsFactoryV3Clone();
    }
}
