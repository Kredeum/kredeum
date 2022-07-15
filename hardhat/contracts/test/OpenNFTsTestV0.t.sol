// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import {OpenNFTsV0} from "../OpenNFTsV0.sol";
import "./OpenNFTsTest.t.sol";
import "../interfaces/ITest.sol";

contract OpenNFTsV0Test is ITest, OpenNFTsTest {
    function constructorTest(address owner) public override returns (address) {
        changePrank(owner);
        OpenNFTsV0 op = new OpenNFTsV0();

        return address(op);
    }

    function mintTest(address collection, address minter) public override returns (uint256) {
        changePrank(minter);
        return OpenNFTsV0(collection).adddUser(minter, _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override {}

    function setUp() public override {
        setUpOpenNFTs("Open NFTs", "NFT");
    }
}
