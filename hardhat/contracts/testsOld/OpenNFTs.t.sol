// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";
import "OpenNFTs/contracts/interfaces/IERC165.sol";
import "OpenNFTs/contracts/interfaces/IERC2981.sol";
import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";
import "OpenNFTs/contracts/interfaces/IERC1155.sol";

import "../next/OpenNFTsV4.sol";

contract OpenNFTsOldTest is Test {
    OpenNFTsV4 internal op;
    OpenNFTsV4 internal opn;
    bytes4 internal opId;

    address owner = address(0x1);
    address minter = address(0x2);
    address buyer = address(0x3);
    address tester = address(0x4);

    string internal constant _TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";

    uint96 maxFee = 10000;
    uint256 maxPrice = uint256(((2**256) - 1)) / maxFee;
    uint256 tokenID0;
    uint256 notTokenID = 42;

    bool[] options = new bool[](1);

    function setUp() public {
        op = new OpenNFTsV4();
        opn = new OpenNFTsV4();
        opId = type(IOpenNFTsV4).interfaceId;
        options[0] = true;

        changePrank(owner);
        op.initialize("OpenNFTsOldTest", "OPTEST", owner, 0, address(0), 0, options);

        changePrank(minter);
        tokenID0 = op.mint(_TOKEN_URI);
    }
}
