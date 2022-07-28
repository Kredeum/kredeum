// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "OpenNFTs/contracts/tests/sets/ERC721FullTest.t.sol";

import "../OpenNFTsV2.sol";
import "OpenNFTs/contracts/tests/units/ERC721Test.t.sol";
import "OpenNFTs/contracts/interfaces/ITest.sol";
import {ERC721TransferableTest} from "OpenNFTs/contracts/tests/units/ERC721TransferableTest.t.sol";

contract OpenNFTsV2Test is ITest, ERC721FullTest, ERC721TransferableTest {
    function constructorTest(address owner) public override(ERC721FullTest, ERC721TransferableTest) returns (address) {
        changePrank(owner);
        OpenNFTsV2 op = new OpenNFTsV2();
        op.initialize("OpenNFTsV2Test", "OPTEST");

        return address(op);
    }

    function mintTest(address collection, address minter)
        public
        override(ERC721FullTest, ERC721TransferableTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV2(collection).mintNFT(minter, _TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override {}

    function setUp() public override {
        setUpERC721Full("OpenNFTsV2Test", "OPTEST");
        setUpERC721Transferable();
    }
}
