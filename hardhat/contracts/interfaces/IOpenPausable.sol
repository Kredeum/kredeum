// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IOpenPausable {
    event SetPaused(bool indexed paused, address indexed account);

    function paused() external returns (bool);

    function togglePause() external;
}
