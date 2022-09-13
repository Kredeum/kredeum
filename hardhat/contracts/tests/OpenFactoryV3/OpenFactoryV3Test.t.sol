// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../next/OpenFactoryV3.sol";
import "../../next/OpenNFTsResolver.sol";
import "../../next/OpenNFTsV4.sol";

import "OpenNFTs/contracts/tests/units/ERC173Test.t.sol";
import "./OpenFactoryV3CloneTest.t.sol";

contract OpenFactoryV3Test is ERC173Test, OpenFactoryV3CloneTest {
    function constructorTest(address owner) public override(ERC173Test, OpenFactoryV3CloneTest) returns (address) {
        changePrank(owner);

        // FACTORY
        OpenFactoryV3 factory = new OpenFactoryV3(owner);

        // RESOLVER
        OpenNFTsResolver resolver = new OpenNFTsResolver(owner, address(factory));
        factory.setResolver(address(resolver));

        // OPEN_NFTS
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenNFTsV4 _template = new OpenNFTsV4();
        _template.initialize("OpenFactoryV3Test", "OPTEST", owner, options);

        // TEMPLATE
        factory.setTemplate("OpenNFTsV4", address(_template));

        return address(factory);
    }

    function setUp() public {
        setUpERC173();
        setUpOpenFactoryV3Clone();
    }
}
