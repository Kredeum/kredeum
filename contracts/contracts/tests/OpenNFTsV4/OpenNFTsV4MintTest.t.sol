// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC2981.sol";
import "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "../../interfaces/IOpenNFTsV4.sol";

abstract contract OpenNFTsV4MintTest is Test {
    string private constant _TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";

    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsV4Mint() public {
        _collection = constructorTest(_owner);
        changePrank(_minter);
    }

    function testOpenNFTsV4Mint1() public {
        IOpenNFTsV4(_collection).mint(_TOKEN_URI);
    }

    function testOpenNFTsV4Mint5() public {
        IOpenNFTsV4(_collection).mint(_minter, _TOKEN_URI);
    }

    function testOpenNFTsV4Mint2() public {
        IOpenNFTs(_collection).mint(_minter, _TOKEN_URI);
    }
}
