// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../next/OpenFactoryV3.sol";
import "../../next/OpenNFTsResolver.sol";
import "../../next/OpenNFTsV4.sol";
import "../../next/OpenAutoMarket.sol";

import "OpenNFTs/contracts/tests/units/ERC173Test.t.sol";
import "./OpenFactoryV3CloneTest.t.sol";

contract OpenFactoryV3Test is ERC173Test, OpenFactoryV3CloneTest {
    function constructorTest(address owner) public override(ERC173Test, OpenFactoryV3CloneTest) returns (address) {
        changePrank(owner);

        // FACTORY
        OpenFactoryV3 factory = new OpenFactoryV3(owner, makeAddr("treasury"), 90);

        // RESOLVER
        OpenNFTsResolver resolver = new OpenNFTsResolver(owner, address(factory));
        factory.setResolver(address(resolver));

        // OPEN_NFTS
        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = false;

        // TEMPLATE OpenNFTsV4
        OpenNFTsV4 _openNFTsV4 = new OpenNFTsV4();
        _openNFTsV4.initialize("OpenNFTsV4 for OpenFactoryV3Test", "OPTEST", owner, abi.encode(abi.encode(options), address(0), 0));
        factory.setTemplate("OpenNFTsV4", address(_openNFTsV4));

        // TEMPLATE OpenAutoMarket
        OpenAutoMarket _openAutoMarket = new OpenAutoMarket();
        IOpenCloneable(_openAutoMarket).initialize(
            "OpenFactoryV3Test",
            "OPTESTOPTEST",
            owner,
            abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );
        factory.setTemplate("OpenAutoMarket", address(_openAutoMarket));

        return address(factory);
    }

    function setUp() public {
        setUpERC173();
        setUpOpenFactoryV3Clone();
    }
}
