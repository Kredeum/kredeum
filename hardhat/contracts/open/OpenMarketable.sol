// SPDX-License-Identifier: MIT
//

//       ___           ___           ___          _____          ___           ___           ___
//      /__/|         /  /\         /  /\        /  /::\        /  /\         /__/\         /__/\
//     |  |:|        /  /::\       /  /:/_      /  /:/\:\      /  /:/_        \  \:\       |  |::\
//     |  |:|       /  /:/\:\     /  /:/ /\    /  /:/  \:\    /  /:/ /\        \  \:\      |  |:|:\
//   __|  |:|      /  /:/~/:/    /  /:/ /:/_  /__/:/ \__\:|  /  /:/ /:/_   ___  \  \:\   __|__|:|\:\
//  /__/\_|:|____ /__/:/ /:/___ /__/:/ /:/ /\ \  \:\ /  /:/ /__/:/ /:/ /\ /__/\  \__\:\ /__/::::| \:\
//  \  \:\/:::::/ \  \:\/:::::/ \  \:\/:/ /:/  \  \:\  /:/  \  \:\/:/ /:/ \  \:\ /  /:/ \  \:\~~\__\/
//   \  \::/~~~~   \  \::/~~~~   \  \::/ /:/    \  \:\/:/    \  \::/ /:/   \  \:\  /:/   \  \:\
//    \  \:\        \  \:\        \  \:\/:/      \  \::/      \  \:\/:/     \  \:\/:/     \  \:\
//     \  \:\        \  \:\        \  \::/        \__\/        \  \::/       \  \::/       \  \:\
//      \__\/         \__\/         \__\/                       \__\/         \__\/         \__\/
//
//
//                OpenERC165 (supports)
//                     |
//                OpenERC721 (NFT)
//                     |
//                OpenERC173 (Ownable)
//                     |
//                OpenERC2981 (RoyaltyInfo)
//                     |
//               OpenMarketable
//

pragma solidity 0.8.9;

import "./OpenERC2981.sol";
import "./OpenPauseable.sol";
import "../interfaces/IOpenMarketable.sol";

abstract contract OpenMarketable is IOpenMarketable, OpenERC2981, OpenPauseable {
    mapping(uint256 => uint256) public tokenPrice;
    uint256 public defaultPrice;

    modifier notTooExpensive(uint256 price) {
        /// otherwise may overflow
        require(price < 2**128, "Too expensive");
        _;
    }

    modifier lessThanMaxFee(uint256 fee) {
        require(fee <= _MAX_FEE, "Royalty fee exceed price");
        _;
    }

    /// @notice SET default royalty configuration
    /// @param receiver : address of the royalty receiver, or address(0) to reset
    /// @param fee : fee Numerator, less than 10000
    function setDefaultRoyalty(address receiver, uint96 fee)
        external
        override(IOpenMarketable)
        onlyOwner
        lessThanMaxFee(fee)
    {
        _royaltyInfo = RoyaltyInfo(receiver, fee);
        emit SetDefaultRoyalty(receiver, fee);
    }

    /// @notice SET token royalty configuration
    /// @param tokenID : token ID
    /// @param receiver : address of the royalty receiver, or address(0) to reset
    /// @param fee : fee Numerator, less than 10000
    function setTokenRoyalty(
        uint256 tokenID,
        address receiver,
        uint96 fee
    ) external override(IOpenMarketable) onlyTokenOwnerOrApproved(tokenID) lessThanMaxFee(fee) {
        _setTokenRoyalty(tokenID, receiver, fee);
    }

    function setDefaultPrice(uint256 price) external override(IOpenMarketable) onlyOwner notTooExpensive(price) {
        defaultPrice = price;
    }

    function setTokenPrice(uint256 tokenID) external override(IOpenMarketable) {
        setTokenPrice(tokenID, defaultPrice);
    }

    function setTokenPrice(uint256 tokenID, uint256 price)
        public
        override(IOpenMarketable)
        onlyTokenOwnerOrApproved(tokenID)
        notTooExpensive(price)
    {
        _setTokenPrice(tokenID, price);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(OpenERC2981, OpenPauseable)
        returns (bool)
    {
        return interfaceId == type(IOpenMarketable).interfaceId || super.supportsInterface(interfaceId);
    }

    function _setTokenRoyalty(
        uint256 tokenID,
        address receiver,
        uint96 fee
    ) internal {
        _tokenRoyaltyInfo[tokenID] = RoyaltyInfo(receiver, fee);
        emit SetTokenRoyalty(tokenID, receiver, fee);
    }

    function _setTokenPrice(uint256 tokenID, uint256 price) internal {
        tokenPrice[tokenID] = price;
    }

    function _mintPriceable(
        uint256 tokenID,
        address receiver,
        uint96 fee,
        uint256 price
    ) internal {
        _setTokenRoyalty(tokenID, receiver, fee);
        _setTokenPrice(tokenID, price);
    }

    function _burnPriceable(uint256 tokenID) internal {
        delete _tokenRoyaltyInfo[tokenID];
        delete tokenPrice[tokenID];
    }
}
