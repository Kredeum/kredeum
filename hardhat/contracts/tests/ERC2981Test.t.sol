// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "../../lib/forge-std/src/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC2981.sol";
import "OpenNFTs/contracts/interfaces/IERC165.sol";
import "OpenNFTs/contracts/interfaces/IOpenMarketable.sol";

abstract contract ERC2981Test is Test {
    address private _contract;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    uint256 private _tokenID0;

    function constructorTest(address owner_)
        public
        virtual
        returns (address contract_);

    function mintTest(address collection_, address minter_)
        public
        virtual
        returns (uint256, string memory);

    function setRoyaltyTest(
        address collection_,
        address receiver_,
        uint96 fee_
    ) public virtual returns (uint256 tokenID_);

    function setUpERC2981() public {
        _contract = constructorTest(_owner);

        _tokenID0 = setRoyaltyTest(_contract, _minter, 420);
    }

    function testERC2981RoyaltyInfo(uint256 price) public {
        vm.assume(price < 2**128);
        IERC2981(_contract).royaltyInfo(_tokenID0, price);
    }

    function testFailERC2981RoyaltyInfoTooExpensive(uint256 price) public {
        vm.assume(price >= 2**128);
        IERC2981(_contract).royaltyInfo(_tokenID0, price);
    }

    function testERC2981SupportsInterface() public {
        assertTrue(
            IERC165(_contract).supportsInterface(type(IERC2981).interfaceId)
        );
    }
}
