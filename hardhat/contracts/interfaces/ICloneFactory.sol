// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ICloneFactory {
    function addImplementation(address implementation_) external;

    function setDefaultTemplate(address defaultTemplate_) external;

    function setContractProbe(address contractProbe_) external;

    function template() external view returns (address template_);

    function implementations(uint256 index) external view returns (address implementation_);

    function implementationsCount() external view returns (uint256 implementationsCount_);
}
