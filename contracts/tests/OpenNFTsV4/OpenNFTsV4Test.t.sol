// SPDX-License-Identifier: MITs
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import "src/OpenNFTsV4.sol";

import "./OpenNFTsV4InitializeTest.t.sol";
import "./OpenNFTsV4SupportsTest.t.sol";
import "./OpenNFTsV4MintTest.t.sol";

import "OpenNFTs/tests/sets/OpenNFTsTest.t.sol";
import "OpenNFTs/tests/units/ERC173Test.t.sol";

contract OpenNFTsV4Test is
    ERC721FullTest,
    ERC173Test,
    OpenNFTsV4InitializeTest,
    OpenNFTsV4MintTest,
    OpenNFTsV4SupportsTest
{
    function constructorTest(address owner)
        public
        override(ERC721FullTest, ERC173Test, OpenNFTsV4SupportsTest, OpenNFTsV4MintTest)
        returns (address)
    {
        return constructorTest(owner, true);
    }

    function constructorTest(address owner, bool init) public override(OpenNFTsV4InitializeTest) returns (address) {
        vm.prank(owner);
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenNFTsV4 collection = new OpenNFTsV4();
        if (init) {
            collection.initialize(
                "OpenNFTsV4Test", "OPTEST", owner, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
            );
        }

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override(ERC721FullTest)
        returns (uint256, string memory)
    {
        vm.prank(minter);
        return (OpenNFTsV4(collection).mint(_TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override(ERC721FullTest) {
        console.log("burnTest ~ tokenID", tokenID);
        vm.prank(OpenNFTsV4(collection).ownerOf(tokenID));
        OpenNFTsV4(collection).burn(tokenID);
    }

    function setUp() public {
        setUpERC721Full("OpenNFTsV4Test", "OPTEST");
        setUpERC173();
        setUpOpenNFTsV4Initialize();
        setUpOpenNFTsV4Mint();
        setUpOpenNFTsV4Supports();
    }
}
