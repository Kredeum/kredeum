// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IAll.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "src/interfaces/IOpenNFTsResolver.sol";
import "src/OpenNFTsResolver.sol";
import "src/OpenNFTsV4.sol";

abstract contract OpenNFTsResolverGetterTest is Test {
    OpenNFTsResolver private _resolver;
    address private _collection;
    address private _owner = makeAddr("owner");
    address private _random = makeAddr("random");
    string private constant _TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsResolverGetter() public {
        _resolver = OpenNFTsResolver(constructorTest(_owner));

        bool[] memory options = new bool[](1);
        options[0] = true;
        _collection = address(new OpenNFTsV4());
        OpenNFTsV4(_collection).initialize(
            "OpenNFTsV4Test", "OPTEST", _owner, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );
        OpenNFTsV4(_collection).mint(_TOKEN_URI);
    }

    function testOpenNFTsResolverGetter(address account) public view {
        _resolver.getOpenNFTsCollectionsInfos(account);
    }

    function testOpenNFTsResolverGetOpenNFTsNftInfos1() public view {
        _resolver.getOpenNFTsNftInfos(_collection, 1, _random);
    }

    function testOpenNFTsResolverGetOpenNFTsNftInfos9() public  {
        vm.expectRevert("Invalid token ID");
        _resolver.getOpenNFTsNftInfos(_collection, 9, _random);
    }
}
