// SPDX-License-Identifier: MITs
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";
import {IOpenNFTsInfos} from "src/interfaces/IOpenNFTsInfos.sol";

import {IERC165} from "OpenNFTs/contracts/interfaces/IERC165.sol";
import {IERC721Enumerable} from "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import {IERC721Metadata} from "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";

// interface IERC20 {
//     function totalSupply() external returns (uint256);
// }

contract OpenNFTsResolverScript is Script {
    bytes4 private constant _IERC721_ENUMERABLE = 0x780e9d63;
    address private _openNFTsResolverAddress = 0xf3E782b62Fd79e6d7794547A488b8905A716A324;

    OpenNFTsResolver private _openNFTsResolver;

    function setUp() public {
        _openNFTsResolver = OpenNFTsResolver(_openNFTsResolverAddress);
        console.log("_openNFTsResolverAddress", _openNFTsResolverAddress);
    }

    function run(address collectionAddress) public {
        console.log("collectionAddress", collectionAddress);

        uint256 totalSupply;

        console.log("run ~ msg.sender", msg.sender);

        vm.startBroadcast();

        // (
        //     IERCNftInfos.CollectionInfos memory collectionInfos,
        //     IOpenNFTsInfos.OpenNFTsCollectionInfos memory openNTFscollectionInfos
        // ) = _openNFTsResolver.getOpenNFTsCollectionInfos(collectionAddress, msg.sender);

        if (IERC165(collectionAddress).supportsInterface(_IERC721_ENUMERABLE)) {
            totalSupply = IERC721Enumerable(collectionAddress).totalSupply();
        } else {
            console.log("Not ERC721 Enumerable");
        }

        console.log("run ~ totalSupply", totalSupply);
        for (uint256 index; index < totalSupply; index++) {
            uint256 tokenID = IERC721Enumerable(collectionAddress).tokenByIndex(index);

            string memory tokenURI = IERC721Metadata(collectionAddress).tokenURI(tokenID);
            console.log("tokenURI", index, tokenURI);
        }

        vm.stopBroadcast();
    }
}
