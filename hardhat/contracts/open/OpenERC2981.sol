// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin Contracts (token/common/ERC2981.sol)
pragma solidity 0.8.9;

import "../interfaces/IERC2981.sol";
import "../interfaces/IERC165.sol";

// WIP WIP WIP
contract OpenERC2981 is IERC165, IERC2981 {
    struct RoyaltyInfo {
        address receiver;
        uint96 royaltyFraction;
    }

    RoyaltyInfo private _defaultRoyaltyInfo;
    mapping(uint256 => RoyaltyInfo) private _tokenRoyaltyInfo;

    uint96 private constant _feeDenominator = 10000;

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        public
        view
        virtual
        override(IERC2981)
        returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalty = _tokenRoyaltyInfo[_tokenId];

        if (royalty.receiver == address(0)) {
            royalty = _defaultRoyaltyInfo;
        }

        royaltyAmount = (_salePrice * royalty.royaltyFraction) / _feeDenominator;

        return (royalty.receiver, royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165) returns (bool) {
        return interfaceId == 0x2a55205a; // = type(IERC2981).interfaceId
    }

    function _setDefaultRoyalty(address receiver, uint96 feeNumerator) internal virtual {
        require(feeNumerator <= _feeDenominator, "ERC2981: royalty fee will exceed salePrice");
        if (receiver == address(0)) {
            delete _defaultRoyaltyInfo;
        } else {
            _defaultRoyaltyInfo = RoyaltyInfo(receiver, feeNumerator);
        }
    }

    function _setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) internal virtual {
        require(feeNumerator <= _feeDenominator, "ERC2981: royalty fee will exceed salePrice");

        if (receiver == address(0)) {
            delete _tokenRoyaltyInfo[tokenId];
        } else {
            _tokenRoyaltyInfo[tokenId] = RoyaltyInfo(receiver, feeNumerator);
        }
    }
}
