// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface INFTsFactoryV3 {
    event SetResolver(address indexed resolver);

    event SetTemplate(string indexed templateName, address indexed template);

    function setResolver(address resolver) external;

    function setTemplate(string calldata templateName, address template) external;

    function clone(
        string memory name,
        string memory symbol,
        string memory templateName,
        bool[] memory options
    ) external returns (address);

    function templates(string calldata templateName) external view returns (address template);
}
