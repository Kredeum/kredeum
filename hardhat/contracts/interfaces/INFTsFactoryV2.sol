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

    event TemplateNew(address indexed template, string indexed templateName);

    function balancesOf(address owner) external view returns (NftData[] memory);

    function templateSet(address template, string calldata templateName) external;

    function clone(
        string memory name,
        string memory symbol,
        string memory templateName
    ) external returns (address);
}
