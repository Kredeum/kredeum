// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../OpenNFTsV3.sol";
import "./OpenERC721Test.t.sol";
import "./OpenNFTsBurnTest.t.sol";
import "../interfaces/ITest.sol";
import {ERC721TransferableTest} from "./ERC721TransferableTest.t.sol";

contract OpenNFTsV3Test is ITest, OpenERC721Test, OpenNFTsBurnTest, ERC721TransferableTest {
    function constructorTest(address owner)
        public
        override(OpenERC721Test, OpenNFTsBurnTest, ERC721TransferableTest)
        returns (address)
    {
        changePrank(owner);
        bool[] memory options = new bool[](2);
        options[0] = true;
        options[1] = true;

        OpenNFTsV3 op = new OpenNFTsV3();
        op.initialize("OpenERC721Test", "OPTEST", owner, options);

        return address(op);
    }

    function mintTest(address collection, address minter)
        public
        override(OpenERC721Test, OpenNFTsBurnTest, ERC721TransferableTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        return (OpenNFTsV3(collection).mintOpenNFT(minter, _TOKEN_URI), _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override(OpenERC721Test, OpenNFTsBurnTest) {
        changePrank(OpenNFTsV3(collection).owner());
        OpenNFTsV3(collection).burnOpenNFT(tokenID);
    }

    function setUp() public override {
        setUpOpenNFTs("OpenERC721Test", "OPTEST");
        setUpERC721Transferable();
        setUpOpenNFTsBurn();
    }
}
