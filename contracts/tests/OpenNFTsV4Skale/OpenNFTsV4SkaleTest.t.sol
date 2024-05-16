// SPDX-License-Identifier: MITs
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import "src/OpenNFTsV4Skale.sol";

contract OpenNFTsV4SkaleTest is Test {
    address owner = makeAddr("owner");
    address minter = makeAddr("minter");
    OpenNFTsV4Skale collection;
    string constant TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";

    function setUp() public {
        bool[] memory options = new bool[](1);
        options[0] = true;

        vm.startPrank(owner);
        collection = new OpenNFTsV4Skale();
        collection.initialize(
            "SkaleTest", "SKTEST", owner, abi.encode(abi.encode(0, address(0), 0, options), address(0), 0)
        );
        vm.stopPrank();
    }

    function test_OpenNFTsV4Skale_cooldownPeriod(uint256 coolDownPeriod) public {
        vm.assume(coolDownPeriod < 1e16);

        vm.prank(owner);
        collection.setCooldownPeriod(coolDownPeriod);

        vm.startPrank(minter);
        collection.mint(TOKEN_URI);

        vm.warp(block.timestamp + coolDownPeriod);

        vm.expectRevert();
        collection.mint(TOKEN_URI);

        vm.warp(block.timestamp + 1);

        collection.mint(TOKEN_URI);
        vm.stopPrank();
    }

    function test_OpenNFTsV4Skale_tokenUriMaxLength() public {
        vm.prank(minter);
        collection.mint(TOKEN_URI);

        vm.prank(owner);
        collection.setTokenUriMaxLength(64);

        vm.prank(minter);
        vm.expectRevert();
        collection.mint(TOKEN_URI);
    }
}
