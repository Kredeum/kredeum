// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./OpenERC721.sol";
import "../interfaces/IERC721TokenReceiver.sol";

contract OpenERC721TokenReceiver is IERC721TokenReceiver, OpenERC721 {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external virtual override(IERC721TokenReceiver) returns (bytes4) {
        return OpenERC721TokenReceiver.onERC721Received.selector;
    }

    function _transferFromBefore(
        address from,
        address to,
        uint256 tokenID
    ) internal override(OpenERC721) {}
}
