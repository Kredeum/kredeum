// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";
import "../interfaces/IERC165.sol";
import "../interfaces/IERC2981.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721Enumerable.sol";
import "../interfaces/IERC721Metadata.sol";
import "../interfaces/IERC1155.sol";

import "../open/OpenNFTsV4.sol";

contract OpenNFTsTest is Test {
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

        op.initialize("OpenNFTsTest", "OPTEST", owner, options);

        startHoax(minter);
        tokenID0 = op.mint(_TOKEN_URI);
    }
}
