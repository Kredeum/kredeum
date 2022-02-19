// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface INFTsFactoryV2 {
    struct NftData {
        address nft;
        uint256 balanceOf;
        address owner;
        string name;
        string symbol;
        uint256 totalSupply;
    }

    function withdrawEther() external;

    function clone(
        string memory name,
        string memory symbol,
        address template
    ) external returns (address);

    function balancesOf(address owner) external view returns (NftData[] memory);

    function balanceOf(address nft, address owner) external view returns (NftData memory);
}
