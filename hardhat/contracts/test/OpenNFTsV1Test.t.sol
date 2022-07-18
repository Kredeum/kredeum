// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import {OpenNFTsV1} from "../OpenNFTsV1.sol";
import "./OpenERC721Test.t.sol";
import "../interfaces/ITest.sol";
import {ERC721TransferableTest} from "./ERC721TransferableTest.t.sol";

contract OpenNFTsV1Test is ITest, OpenERC721Test, ERC721TransferableTest {
    function constructorTest(address owner) public override(OpenERC721Test, ERC721TransferableTest) returns (address) {
        changePrank(owner);
        OpenNFTsV1 op = new OpenNFTsV1();

        return address(op);
    }

    function mintTest(address collection, address minter)
        public
        override(OpenERC721Test, ERC721TransferableTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV1(collection).mintNFT(minter, _TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override {}

    function setUp() public override {
        setUpOpenNFTs("Open NFTs", "NFT");
        setUpERC721Transferable();
    }
}
