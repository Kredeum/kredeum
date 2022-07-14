// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../dev/OpenBound.sol";
import {OpenNFTsTest} from "./OpenNFTs.t.sol";
import {ERC173Test} from "./ERC173.t.sol";
import {OpenPausableTest} from "./OpenPausable.t.sol";

contract OpenBoundTest is OpenNFTsTest, ERC173Test, OpenPausableTest {
    uint256 private cid = 777;

    function constructorTest(address owner)
        public
        override(OpenNFTsTest, ERC173Test, OpenPausableTest)
        returns (address)
    {
        changePrank(owner);
        bool[] memory options = new bool[](1);
        options[0] = true;

        OpenBound collection = new OpenBound("OpenBound", "BOUND", 1000);

        return address(collection);
    }

    function mintTest(address collection, address minter)
        public
        override(OpenNFTsTest, OpenPausableTest)
        returns (uint256)
    {
        changePrank(minter);
        return OpenBound(collection).mint(cid++);
    }

    function burnTest(address collection, uint256 tokenID) public override {
        changePrank(OpenBound(collection).ownerOf(tokenID));
        OpenBound(collection).burn(tokenID);
    }

    function setUp() public {
        setUpERC173();
        setUpPausable();
        setUpOpenNFTs("OpenBound", "BOUND", false);
    }
}
