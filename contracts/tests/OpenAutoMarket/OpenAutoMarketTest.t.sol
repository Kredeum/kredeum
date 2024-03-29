// SPDX-License-Identifier: MITs
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import "src/OpenAutoMarket.sol";

import "./OpenAutoMarketInitializeTest.t.sol";
import "./OpenAutoMarketSupportsTest.t.sol";
import "./OpenAutoMarketBuyTest.t.sol";
import "./OpenAutoMarketMintTest.t.sol";

import "OpenNFTs/tests/sets/OpenNFTsTest.t.sol";

import "OpenNFTs/tests/units/ERC721TransferableTest.t.sol";
import "OpenNFTs/tests/units/ERC173Test.t.sol";
import "OpenNFTs/tests/units/ERC2981Test.t.sol";
import "OpenNFTs/tests/units/OpenNFTsBurnTest.t.sol";
import "OpenNFTs/tests/units/OpenNFTsSetupTest.t.sol";
import "OpenNFTs/tests/units/OpenPauseableTest.t.sol";
import "OpenNFTs/tests/units/OpenMarketableTest.t.sol";

contract OpenAutoMarketTest is
    ERC721TransferableTest,
    ERC173Test,
    ERC2981Test,
    OpenAutoMarketInitializeTest,
    OpenAutoMarketSupportsTest,
    OpenAutoMarketBuyTest,
    OpenAutoMarketMintTest,
    OpenNFTsTest,
    OpenNFTsBurnTest,
    OpenNFTsSetupTest,
    OpenPauseableTest,
    OpenMarketableTest
{
    uint256 internal nn = 42;

    function constructorTest(address owner)
        public
        override(
            ERC721TransferableTest,
            ERC173Test,
            ERC2981Test,
            OpenNFTsTest,
            OpenAutoMarketSupportsTest,
            OpenAutoMarketBuyTest,
            OpenAutoMarketMintTest,
            OpenNFTsBurnTest,
            OpenNFTsSetupTest,
            OpenPauseableTest,
            OpenMarketableTest
        )
        returns (address)
    {
        return constructorTest(owner, true);
    }

    function constructorTest(address owner, bool init)
        public
        override(OpenAutoMarketInitializeTest)
        returns (address)
    {
        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = true;

        OpenAutoMarket collection = new OpenAutoMarket();
        if (init) {
            vm.prank(owner);
            IOpenCloneable(collection).initialize(
                "OpenERC721Test",
                "OPTEST",
                owner,
                abi.encode(abi.encode(0, address(0), 0, options), makeAddr("treasury"), 90)
            );
        }

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override(
            OpenAutoMarketBuyTest,
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
        vm.prank(minter);
        return (OpenAutoMarket(payable(collection)).mint(_TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override(OpenNFTsTest, OpenNFTsBurnTest) {
        vm.prank(OpenAutoMarket(payable(collection)).ownerOf(tokenID));
        OpenAutoMarket(payable(collection)).burn(tokenID);
    }

    function setPriceTest(address collection, uint256 tokenID, uint256 price) public {
        vm.prank(OpenAutoMarket(payable(collection)).ownerOf(tokenID));
        OpenAutoMarket(payable(collection)).setTokenPrice(tokenID, price);
    }

    function setRoyaltyTest(address collection, address receiver, uint96 fee)
        public
        override(ERC2981Test, OpenMarketableTest)
        returns (uint256 tokenID)
    {
        vm.startPrank(OpenAutoMarket(payable(collection)).owner());
        (tokenID,) = (OpenAutoMarket(payable(collection)).mint(_TOKEN_URI), _TOKEN_URI);
        OpenAutoMarket(payable(collection)).setTokenRoyalty(tokenID, receiver, fee);
        vm.stopPrank();
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
        setUpOpenNFTsMint();
        setUpOpenNFTsSetup();
        setUpOpenAutoMarketInitialize();
        setUpOpenAutoMarketSupports();
    }
}
