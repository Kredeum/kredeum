// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import {OpenNFTsResolver} from "src/OpenNFTsResolver.sol";

contract ListCollections is Test {
    string constant ADDRESSES_FILE = "./addresses.json";

    function readResolverAddress() public returns (address) {
        return abi.decode(
            vm.parseJson(
                vm.readFile(ADDRESSES_FILE), string.concat(".", vm.toString(block.chainid), ".OpenNFTsResolver")
            ),
            (address)
        );
    }

    function testFirst() public {
        OpenNFTsResolver openNFTsResolver = OpenNFTsResolver(readResolverAddress());
        console.log("run ~ openNFTsResolver: %s", address(openNFTsResolver));

        uint256 count = openNFTsResolver.countAddresses();
        console.log("%d collections on %s", count, block.chainid);

        // address[] memory collections = openNFTsResolver.getAddresses();
        // assert(collections.length == count);

        // for (uint256 i = 0; i < count; i++) {
        //     console.log("%s %s", i, collections[i]);
        // }
    }
}
