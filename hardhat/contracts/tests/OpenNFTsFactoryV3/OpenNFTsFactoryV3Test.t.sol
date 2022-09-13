// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../next/OpenNFTsFactoryV3.sol";
import "../../next/OpenNFTsResolver.sol";
import "../../next/OpenNFTsV4.sol";

import "OpenNFTs/contracts/tests/units/ERC173Test.t.sol";
import "./OpenNFTsFactoryV3CloneTest.t.sol";

contract OpenNFTsFactoryV3Test is ERC173Test, OpenNFTsFactoryV3CloneTest {
    function constructorTest(address owner) public override(ERC173Test, OpenNFTsFactoryV3CloneTest) returns (address) {
        changePrank(owner);

        // FACTORY
        OpenNFTsFactoryV3 factory = new OpenNFTsFactoryV3(owner);

        // RESOLVER
        OpenNFTsResolver resolver = new OpenNFTsResolver(owner, address(factory));
        factory.setResolver(address(resolver));

        // OPEN_NFTS
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenNFTsV4 _template = new OpenNFTsV4();
        _template.initialize("OpenERC721Test", "OPTEST", owner, 0, address(0), 0, options);

        // TEMPLATE
        factory.setTemplate("OpenNFTsV4", address(_template));

        return address(factory);
    }

    function setUp() public {
        setUpERC173();
        setUpOpenNFTsFactoryV3Clone();
    }
}
