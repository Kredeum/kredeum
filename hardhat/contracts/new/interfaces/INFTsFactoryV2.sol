// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

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

    function version() external view returns (uint8);

    function balancesOf(address owner) external view returns (NftData[] memory);

    function templateSet(string calldata templateName, address template) external;

    function templates(string calldata) external view returns (address);

    function clone(
        string memory name,
        string memory symbol,
        string memory templateName
    ) external returns (address);
}
