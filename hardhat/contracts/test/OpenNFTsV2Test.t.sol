// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../OpenNFTsV2.sol";
import "./OpenERC721Test.t.sol";
import "../interfaces/ITest.sol";
import {ERC721TransferableTest} from "./ERC721TransferableTest.t.sol";

contract OpenNFTsV2Test is ITest, OpenERC721Test, ERC721TransferableTest {
    function constructorTest(address owner) public override(OpenERC721Test, ERC721TransferableTest) returns (address) {
        changePrank(owner);
        OpenNFTsV2 op = new OpenNFTsV2();
        op.initialize("OpenERC721Test", "OPTEST");

        return address(op);
    }

    function mintTest(address collection, address minter)
        public
        override(OpenERC721Test, ERC721TransferableTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV2(collection).mintNFT(minter, _TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override {}

    function setUp() public override {
        setUpOpenNFTs("OpenERC721Test", "OPTEST");
        setUpERC721Transferable();
    }
}
