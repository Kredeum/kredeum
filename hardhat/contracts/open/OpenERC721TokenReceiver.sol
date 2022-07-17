// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./OpenERC721.sol";

contract OpenERC721TokenReceiver is OpenERC721 {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external virtual returns (bytes4) {
        return OpenERC721TokenReceiver.onERC721Received.selector;
    }
}
