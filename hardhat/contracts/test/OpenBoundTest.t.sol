// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "../dev/OpenBound.sol";
import {OpenERC721Test} from "./OpenERC721Test.t.sol";
import {ERC173Test} from "./ERC173Test.t.sol";
import {ERC721NonTransferableTest} from "./ERC721NonTransferableTest.t.sol";
import {OpenPausableTest} from "./OpenPausableTest.t.sol";
import "../interfaces/ITest.sol";

contract OpenBoundTest is ITest, OpenERC721Test, ERC173Test, ERC721NonTransferableTest, OpenPausableTest {
    uint256 private _cid = 777;

    function constructorTest(address owner)
        public
        override(OpenERC721Test, ERC173Test, ERC721NonTransferableTest, OpenPausableTest)
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
        override(OpenERC721Test, OpenPausableTest, ERC721NonTransferableTest)
        returns (uint256, string memory)
    {
        changePrank(minter);
        uint256 tokenID = OpenBound(collection).mint(_cid++);
        string memory tokenURI = OpenBound(collection).tokenURI(tokenID);
        return (tokenID, tokenURI);
    }

    function burnTest(address collection, uint256 tokenID) public override(OpenERC721Test, ERC721NonTransferableTest) {
        changePrank(OpenBound(collection).ownerOf(tokenID));
        OpenBound(collection).burn(tokenID);
    }

    function setUp() public override {
        setUpERC173();
        setUpPausable();
        setUpOpenNFTs("OpenBound", "BOUND");
        setUpERC721NonTransferable();
    }
}
