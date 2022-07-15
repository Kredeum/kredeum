// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../open/OpenNFTsV4.sol";
import "./OpenNFTsTest.t.sol";
import "./ERC173Test.t.sol";
import "./ERC2981Test.t.sol";
import "./OpenPausableTest.t.sol";
import "./OpenPriceableTest.t.sol";
import "../interfaces/ITest.sol";

contract OpenNFTsV4Test is ITest, OpenNFTsTest, ERC173Test, ERC2981Test, OpenPausableTest, PriceableTest {
    function constructorTest(address owner)
        public
        override(OpenNFTsTest, ERC173Test, ERC2981Test, OpenPausableTest, PriceableTest)
        returns (address)
    {
        changePrank(owner);
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenNFTsV4 collection = new OpenNFTsV4();
        collection.initialize("OpenNFTsTest", "OPTEST", owner, options);

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override(OpenNFTsTest, ERC2981Test, OpenPausableTest, PriceableTest)
        returns (uint256)
    {
        changePrank(minter);
        return OpenNFTsV4(collection).mint(_TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override {
        changePrank(OpenNFTsV4(collection).ownerOf(tokenID));
        OpenNFTsV4(collection).burn(tokenID);
    }

    // function setPriceTest(
    //     address collection,
    //     uint256 tokenID,
    //     uint256 price
    // ) public {
    //     OpenNFTsV4(collection).setTokenPrice(tokenID, price);
    // }

    function setRoyaltyTest(
        address collection,
        address receiver,
        uint96 fee
    ) public override(ERC2981Test, PriceableTest) returns (uint256 tokenID) {
        tokenID = mintTest(collection, receiver);
        OpenNFTsV4(collection).setTokenRoyalty(tokenID, receiver, fee);
    }

    function setUp() public override {
        setUpERC173();
        setUpERC2981();
        setUpPausable();
        setUpPriceable();
        setUpOpenNFTs("OpenNFTsTest", "OPTEST");
    }
}
