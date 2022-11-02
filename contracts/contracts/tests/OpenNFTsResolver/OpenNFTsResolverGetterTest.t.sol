// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IAll.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "../../interfaces/IOpenNFTsResolver.sol";
import "../../OpenNFTsResolver.sol";

abstract contract OpenNFTsResolverGetterTest is Test {
    OpenNFTsResolver private _resolver;
    address private _collection;
    address private _owner = address(0x1);

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsResolverGetter() public {
        _collection = constructorTest(_owner);

        _resolver = new OpenNFTsResolver(_owner, address(this));
    }

    function testOpenNFTsResolverGetter(address account) public view {
        _resolver.getOpenNFTsCollectionsInfos(account);
    }
}
