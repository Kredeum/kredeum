// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface INftPass {
    function setTokenURI(string memory tokenURI) external;

    function safeMint(address to) external;
}
