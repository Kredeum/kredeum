// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../templates/OpenNFTsV4.sol";
import "OpenNFTs/contracts/tests/OpenERC721Test.t.sol";
import "OpenNFTs/contracts/tests/OpenNFTsBurnTest.t.sol";
import "OpenNFTs/contracts/tests/OpenNFTsBuyTest.t.sol";
// import "OpenNFTs/contracts/tests/OpenNFTsInitializeTest.t.sol";
import "OpenNFTs/contracts/tests/OpenNFTsSetupTest.t.sol";
import "OpenNFTs/contracts/tests/ERC173Test.t.sol";
import "OpenNFTs/contracts/tests/ERC2981Test.t.sol";
import {ERC721TransferableTest} from "OpenNFTs/contracts/tests/ERC721TransferableTest.t.sol";
import "OpenNFTs/contracts/tests/OpenPauseableTest.t.sol";
import "OpenNFTs/contracts/tests/OpenMarketableTest.t.sol";
import "OpenNFTs/contracts/interfaces/ITest.sol";

contract OpenNFTsV4Test is
    ITest,
    OpenERC721Test,
    OpenNFTsBurnTest,
    OpenNFTsBuyTest,
    // OpenNFTsInitializeTest,
    OpenNFTsSetupTest,
    ERC173Test,
    ERC2981Test,
    ERC721TransferableTest,
    OpenPauseableTest,
    PriceableTest
{
    function constructorTest(address owner)
        public
        override(
            OpenERC721Test,
            OpenNFTsBurnTest,
            OpenNFTsBuyTest,
            OpenNFTsSetupTest,
            ERC173Test,
            ERC721TransferableTest,
            ERC2981Test,
            OpenPauseableTest,
            PriceableTest
        )
        returns (address)
    {
        changePrank(owner);
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenNFTsV4 collection = new OpenNFTsV4();
        collection.initialize("OpenERC721Test", "OPTEST", owner, options);

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override(
            OpenERC721Test,
            OpenNFTsBurnTest,
            OpenNFTsBuyTest,
            OpenNFTsSetupTest,
            ERC2981Test,
            OpenPauseableTest,
            PriceableTest,
            ERC721TransferableTest
        )
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV4(collection).mint(_TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override(OpenERC721Test, OpenNFTsBurnTest) {
        changePrank(OpenNFTsV4(collection).ownerOf(tokenID));
        OpenNFTsV4(collection).burn(tokenID);
    }

    function setPriceTest(
        address collection,
        uint256 tokenID,
        uint256 price
    ) public {
        OpenNFTsV4(collection).setTokenPrice(tokenID, price);
    }

    function setRoyaltyTest(
        address collection,
        address receiver,
        uint96 fee
    ) public override(ERC2981Test, PriceableTest) returns (uint256 tokenID) {
        (tokenID, ) = mintTest(collection, receiver);
        OpenNFTsV4(collection).setTokenRoyalty(tokenID, receiver, fee);
    }

    function setUp() public override {
        setUpERC173();
        setUpERC2981();
        setUpPausable();
        setUpPriceable();
        setUpOpenNFTs("OpenERC721Test", "OPTEST");
        setUpERC721Transferable();
        setUpOpenNFTsBurn();
        setUpOpenNFTsBuy();
        // setUpOpenNFTsInitialize();
        setUpOpenNFTsSetup();
    }
}
