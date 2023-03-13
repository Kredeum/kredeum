// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Receiver {
    fallback() external payable {}

    function sendTo() external payable returns (bool) {
        return true;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
