// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../next/OpenNFTsV4.sol";

import "./OpenNFTsV4InitializeTest.t.sol";
import "./OpenNFTsV4SupportsTest.t.sol";
import "./OpenNFTsV4MintTest.t.sol";

import "OpenNFTs/contracts/tests/sets/OpenNFTsTest.t.sol";
import "OpenNFTs/contracts/tests/units/ERC173Test.t.sol";

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
        changePrank(owner);
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenNFTsV4 collection = new OpenNFTsV4();
        if (init) {
            collection.initialize("OpenNFTsV4Test", "OPTEST", owner, options);
        }

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override(ERC721FullTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV4(collection).mint(_TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override(ERC721FullTest) {
        console.log("burnTest ~ tokenID", tokenID);
        changePrank(OpenNFTsV4(collection).ownerOf(tokenID));
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
