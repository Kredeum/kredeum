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
//               OpenPriceable
//

pragma solidity 0.8.9;

import "./OpenERC2981.sol";
import "./OpenPausable.sol";
import "../interfaces/IOpenPriceable.sol";

abstract contract OpenPriceable is IOpenPriceable, OpenERC2981, OpenPausable {
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
        override(IOpenPriceable)
        onlyOwner
        lessThanMaxFee(fee)
    {
        if (receiver == address(0)) {
            delete _royaltyInfo;
        } else {
            _royaltyInfo = RoyaltyInfo(receiver, fee);
        }
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
    ) external override(IOpenPriceable) onlyTokenOwner(tokenID) lessThanMaxFee(fee) {
        if (receiver == address(0)) {
            delete _tokenRoyaltyInfo[tokenID];
        } else {
            _tokenRoyaltyInfo[tokenID] = RoyaltyInfo(receiver, fee);
        }
        emit SetTokenRoyalty(tokenID, receiver, fee);
    }

    function setDefaultPrice(uint256 price) external override(IOpenPriceable) onlyOwner notTooExpensive(price) {
        defaultPrice = price;
    }

    function setTokenPrice(uint256 tokenID) external override(IOpenPriceable) {
        setTokenPrice(tokenID, defaultPrice);
    }

    function setTokenPrice(uint256 tokenID, uint256 price)
        public
        override(IOpenPriceable)
        onlyTokenOwner(tokenID)
        notTooExpensive(price)
    {
        tokenPrice[tokenID] = price;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(OpenERC2981, OpenPausable)
        returns (bool)
    {
        return interfaceId == type(IOpenPriceable).interfaceId || super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenID) internal virtual override(OpenERC721) {
        delete _tokenRoyaltyInfo[tokenID];
        delete tokenPrice[tokenID];
        super._burn(tokenID);
    }
}
