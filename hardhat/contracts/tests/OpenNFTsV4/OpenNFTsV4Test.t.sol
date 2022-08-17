// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../next/OpenNFTsV4.sol";

import "./OpenNFTsV4InitializeTest.t.sol";
import "./OpenNFTsV4SupportsTest.t.sol";
import "./OpenNFTsV4BuyTest.t.sol";

import "OpenNFTs/contracts/tests/sets/OpenNFTsTest.t.sol";

import "OpenNFTs/contracts/tests/units/ERC721TransferableTest.t.sol";
import "OpenNFTs/contracts/tests/units/ERC173Test.t.sol";
import "OpenNFTs/contracts/tests/units/ERC2981Test.t.sol";
import "OpenNFTs/contracts/tests/units/OpenNFTsBurnTest.t.sol";
import "OpenNFTs/contracts/tests/units/OpenNFTsSetupTest.t.sol";
import "OpenNFTs/contracts/tests/units/OpenPauseableTest.t.sol";
import "OpenNFTs/contracts/tests/units/OpenMarketableTest.t.sol";

contract OpenNFTsV4Test is
    ERC721TransferableTest,
    ERC173Test,
    ERC2981Test,
    OpenNFTsV4InitializeTest,
    OpenNFTsV4SupportsTest,
    OpenNFTsV4BuyTest,
    OpenNFTsTest,
    OpenNFTsBurnTest,
    OpenNFTsSetupTest,
    OpenPauseableTest,
    OpenMarketableTest
{
    function constructorTest(address owner)
        public
        override(
            ERC721TransferableTest,
            ERC173Test,
            ERC2981Test,
            OpenNFTsTest,
            OpenNFTsV4SupportsTest,
            OpenNFTsV4BuyTest,
            OpenNFTsBurnTest,
            OpenNFTsSetupTest,
            OpenPauseableTest,
            OpenMarketableTest
        )
        returns (address)
    {
        return constructorTest(owner, true);
    }

    function constructorTest(address owner, bool init) public override(OpenNFTsV4InitializeTest) returns (address) {
        changePrank(owner);
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenNFTsV4 collection = new OpenNFTsV4();
        if (init) collection.initialize("OpenERC721Test", "OPTEST", owner, options);

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override(
            OpenNFTsV4BuyTest,
            OpenNFTsTest,
            OpenNFTsBurnTest,
            OpenNFTsSetupTest,
            ERC2981Test,
            OpenPauseableTest,
            OpenMarketableTest,
            ERC721TransferableTest
        )
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV4(payable(collection)).mint(_TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override(OpenNFTsTest, OpenNFTsBurnTest) {
        changePrank(OpenNFTsV4(payable(collection)).ownerOf(tokenID));
        OpenNFTsV4(payable(collection)).burn(tokenID);
    }

    function setPriceTest(
        address collection,
        uint256 tokenID,
        uint256 price
    ) public {
        OpenNFTsV4(payable(collection)).setTokenPrice(tokenID, price);
    }

    function setRoyaltyTest(
        address collection,
        address receiver,
        uint96 fee
    ) public override(ERC2981Test, OpenMarketableTest) returns (uint256 tokenID) {
        (tokenID, ) = mintTest(collection, receiver);
        OpenNFTsV4(payable(collection)).setTokenRoyalty(tokenID, receiver, fee);
    }

    function setUp() public {
        setUpERC173();
        setUpERC2981();
        setUpPausable();
        setUpMarketable();
        setUpOpenNFTs("OpenERC721Test", "OPTEST");
        setUpERC721Transferable();
        setUpOpenNFTsBurn();
        setUpOpenNFTsBuy();
        setUpOpenNFTsSetup();
        setUpOpenNFTsV4Initialize();
        setUpOpenNFTsV4Supports();
    }
}
