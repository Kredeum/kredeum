// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../next/OpenBound.sol";

import "./OpenBoundSupportsTest.t.sol";

import "OpenNFTs/contracts/tests/sets/OpenNFTsTest.t.sol";

import "OpenNFTs/contracts/tests/units/ERC173Test.t.sol";
import "OpenNFTs/contracts/tests/units/ERC721NonTransferableTest.t.sol";
import "OpenNFTs/contracts/tests/units/OpenPauseableTest.t.sol";

contract OpenBoundTest is OpenNFTsTest, ERC173Test, ERC721NonTransferableTest, OpenPauseableTest, OpenBoundSupportsTest {
    uint256 private _cid = 777;

    function constructorTest(address owner)
        public
        override (OpenNFTsTest, ERC173Test, ERC721NonTransferableTest, OpenPauseableTest, OpenBoundSupportsTest)
        returns (address)
    {
        changePrank(owner);
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenBound collection = new OpenBound();
        collection.initialize("OpenBound", "BOUND", owner, 0);

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override (OpenNFTsTest, OpenPauseableTest, ERC721NonTransferableTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        uint256 tokenID = OpenBound(payable(collection)).mint(_cid++);
        string memory tokenURI = OpenBound(payable(collection)).tokenURI(tokenID);
        return (tokenID, tokenURI);
    }

    function burnTest(address collection, uint256 tokenID) public override (OpenNFTsTest, ERC721NonTransferableTest) {
        changePrank(OpenBound(payable(collection)).ownerOf(tokenID));
        OpenBound(payable(collection)).burn(tokenID);
    }

    function setUp() public {
        setUpERC173();
        setUpPausable();
        setUpOpenNFTs("OpenBound", "BOUND");
        setUpERC721NonTransferable();
        setUpOpenBoundSupports();
    }
}
