// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../OpenNFTsV2.sol";
import "./OpenNFTs.t.sol";

contract OpenNFTsV2Test is OpenNFTsTest {
    function constructorTest(address owner) public override returns (address) {
        changePrank(owner);
        OpenNFTsV2 op = new OpenNFTsV2();
        op.initialize("OpenNFTsTest", "OPTEST");

        return address(op);
    }

    function mintTest(address collection, address minter) public override returns (uint256) {
        changePrank(minter);
        return OpenNFTsV2(collection).mintNFT(minter, _TOKEN_URI);
    }

    function burnTest(address collection, uint256 tokenID) public override {}

    function setUp() public {
        setUpOpenNFTs("OpenNFTsTest", "OPTEST");
    }
}
