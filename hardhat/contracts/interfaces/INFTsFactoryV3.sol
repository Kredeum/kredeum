// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface INFTsFactoryV3 {
    event SetTemplate(string indexed templateName, address indexed template);

    function setTemplate(string calldata templateName, address template) external;

    function templates(string calldata templateName) external view returns (address template);

    function clone(
        string memory name,
        string memory symbol,
        string memory templateName,
        bool[] memory options
    ) external returns (address);
}
