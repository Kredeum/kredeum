// SPDX-License-Identifier: MITs
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import {IERCNftInfos} from "@opennfts/contracts/interfaces/IERCNftInfos.sol";
import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";
import {OpenNFTsV4} from "src/OpenNFTsV4.sol";
import {IOpenNFTsInfos} from "src/interfaces/IOpenNFTsInfos.sol";

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

        vm.startPrank(_owner);
        OpenNFTsV4(_collection).initialize(
            "OpenNFTsV4Test", "OPTEST", _owner, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );
        OpenNFTsV4(_collection).mint(_TOKEN_URI);
        vm.stopPrank();
    }

    function testOpenNFTsResolverGetterGetOpenNFTsCollectionsInfos0(address account) public view {
        _resolver.getOpenNFTsCollectionsInfos(account);
    }

    function testOpenNFTsResolverGetterGetOpenNFTsCollectionsInfos() public view {
        (
            IERCNftInfos.CollectionInfos[] memory collectionsInfos,
            IOpenNFTsInfos.OpenNFTsCollectionInfos[] memory openNFTsCollectionsInfos,
            uint256 count,
            uint256 total
        ) = _resolver.getOpenNFTsCollectionsInfos(_owner);
        uint256 len = collectionsInfos.length;

        console.log("collectionsInfos: %s %s %s", len, count, total);
        for (uint256 i = 0; i < len; i++) {
            console.log("collectionsInfos[%s]: %s", i, collectionsInfos[i].name, collectionsInfos[i].collection);
            console.log("openNFTsCollectionsInfos[%s]: %s", i, openNFTsCollectionsInfos[i].template);
        }
    }

    function testOpenNFTsResolverGetOpenNFTsNftInfos1() public view {
        _resolver.getOpenNFTsNftInfos(_collection, 1, _random);
    }

    function testOpenNFTsResolverGetOpenNFTsNftInfos9() public view {
        _resolver.getOpenNFTsNftInfos(_collection, 9, _random);
    }
}
