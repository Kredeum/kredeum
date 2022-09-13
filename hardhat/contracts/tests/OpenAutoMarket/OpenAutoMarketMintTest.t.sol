// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC721.sol";
import "OpenNFTs/contracts/interfaces/IERC721Enumerable.sol";
import "OpenNFTs/contracts/interfaces/IERC2981.sol";
import "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";
import "OpenNFTs/contracts/interfaces/IOpenNFTs.sol";
import "../../interfaces/IOpenAutoMarket.sol";

abstract contract OpenAutoMarketMintTest is Test {
    string private constant _TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";

    address payable private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    uint256 private _tokenID0;

    function constructorTest(address owner_) public virtual returns (address);

    function setUpOpenNFTsMint() public {
        _collection = payable(constructorTest(_owner));
        changePrank(_minter);
    }

    function testOpenAutoMarketMint1() public {
        IOpenAutoMarket(_collection).mint(_TOKEN_URI);
    }

    function testOpenAutoMarketMint5() public {
        IOpenAutoMarket(_collection).mint(_minter, _TOKEN_URI, 10000, address(_minter), 100);
    }

    function testOpenAutoMarketMint2() public {
        IOpenNFTs(_collection).mint(_minter, _TOKEN_URI);
    }
}
