// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import {IOpenNFTs as IOpenNFTsOld} from "../interfaces/IOpenNFTs.sol";

import "OpenNFTs/contracts/OpenNFTs.sol";
import "../interfaces/IOpenNFTsV4.sol";

/// @title OpenNFTs smartcontract
contract OpenNFTsV4 is IOpenNFTsV4, OpenNFTs {
    /// @notice Mint NFT allowed to everyone or only collection owner
    bool public open;

    /// @notice onlyOpenOrOwner, either everybody in open collection,
    /// @notice either only owner in specific collection
    modifier onlyOpenOrOwner() {
        require(open || (owner() == msg.sender), "Not minter");
        _;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        bool[] memory options
    ) external override(IOpenNFTsV4) {
        OpenNFTs.initialize(name_, symbol_, owner_);
        open = options[0];
    }

    function mint(string memory jsonURI)
        external
        override(IOpenNFTsV4)
        onlyOpenOrOwner
        onlyWhenNotPaused
        returns (uint256)
    {
        return _mint(msg.sender, jsonURI);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenNFTs) returns (bool) {
        return
            interfaceId == type(IOpenNFTsV4).interfaceId ||
            interfaceId == type(IOpenNFTsOld).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
