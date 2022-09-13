// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "../../interfaces/IOpenNFTsFactoryV3.sol";

abstract contract OpenNFTsFactoryV3CloneTest is Test {
    address private _factory;
    address private _template;
    address private _clone;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsFactoryV3Clone() public {
        _factory = constructorTest(_owner);
    }

    function testOpenNFTsFactoryV3Clone() public {
        bool[] memory options = new bool[](1);
        options[0] = true;

        IOpenNFTsFactoryV3(_factory).clone("NFT test", "NFT", "OpenNFTsV4", options);
    }
}
