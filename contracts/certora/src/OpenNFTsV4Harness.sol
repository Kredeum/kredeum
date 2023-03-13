// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {OpenNFTsV4} from "../../src/OpenNFTsV4.sol";

contract OpenNFTsV4Harness is OpenNFTsV4 {
    function getEthBalance(address account) public view returns (uint256) {
        return account.balance;
    }
}