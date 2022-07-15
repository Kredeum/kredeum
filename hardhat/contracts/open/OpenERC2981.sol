// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (token/common/ERC2981.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/common/ERC2981.sol

//
//                OpenERC165
//                     |
//                OpenERC721
//                     |
//                OpenERC173
//                     |
//                OpenERC2981
//

pragma solidity 0.8.9;

import "./OpenERC173.sol";
import "../interfaces/IERC2981.sol";

abstract contract OpenERC2981 is IERC2981, OpenERC173 {
    struct RoyaltyInfo {
        address receiver;
        uint96 fraction;
    }

    RoyaltyInfo internal _royaltyInfo;
    mapping(uint256 => RoyaltyInfo) internal _tokenRoyaltyInfo;

    uint96 internal constant _MAX_FEE = 10000;

    function royaltyInfo(uint256 tokenID, uint256 salePrice)
        public
        view
        override(IERC2981)
        returns (address receiver, uint256 royaltyAmount)
    {
        /// otherwise may overflow
        require(salePrice < 2**128, "Too expensive");

        RoyaltyInfo memory royalty = _tokenRoyaltyInfo[tokenID];

        if (royalty.receiver == address(0)) {
            royalty = _royaltyInfo;
        }

        royaltyAmount = (salePrice * royalty.fraction) / _MAX_FEE;

        return (royalty.receiver, royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC173) returns (bool) {
        return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId);
    }
}
