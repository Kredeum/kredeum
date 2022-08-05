// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "OpenNFTs/contracts/tests/sets/ERC721FullTest.t.sol";

import "../OpenNFTsV3.sol";
import "OpenNFTs/contracts/tests/units/ERC721Test.t.sol";
import "OpenNFTs/contracts/tests/units/OpenNFTsBurnTest.t.sol";
import "OpenNFTs/contracts/interfaces/ITest.sol";
import {ERC721TransferableTest} from "OpenNFTs/contracts/tests/units/ERC721TransferableTest.t.sol";

contract OpenNFTsV3Test is ITest, ERC721FullTest, OpenNFTsBurnTest, ERC721TransferableTest {
    function constructorTest(address owner)
        public
        override(ERC721FullTest, OpenNFTsBurnTest, ERC721TransferableTest)
        returns (address)
    {
        changePrank(owner);
        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = true;

        OpenNFTsV3 op = new OpenNFTsV3();
        op.initialize("OpenNFTsV3Test", "OPTEST", owner, options);

        return address(op);
    }

    function mintTest(address collection, address minter)
        public
        override(ERC721FullTest, OpenNFTsBurnTest, ERC721TransferableTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV3(collection).mintOpenNFT(minter, _TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override(ERC721FullTest, OpenNFTsBurnTest) {
        changePrank(OpenNFTsV3(collection).owner());
        OpenNFTsV3(collection).burnOpenNFT(tokenID);
    }

    function setUp() public override {
        setUpERC721Full("OpenNFTsV3Test", "OPTEST");
        setUpERC721Transferable();
        setUpOpenNFTsBurn();
    }
}
