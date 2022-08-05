// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface INFTsFactory {
    struct NftData {
        address nft;
        uint256 balanceOf;
        address owner;
        string name;
        string symbol;
        uint256 totalSupply;
    }

    function withdrawEther() external;

    function clone(string memory name, string memory symbol) external returns (address clone_);

    function balancesOf(address owner) external view returns (NftData[] memory nftDatas_);

    function balanceOf(address nft, address owner) external view returns (NftData memory nftData_);
}
