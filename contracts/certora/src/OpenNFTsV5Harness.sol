// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {OpenNFTsV5} from "src/next/OpenNFTsV5.sol";

contract OpenNFTsV5Harness is OpenNFTsV5 {
    function getEthBalance(address account) public view returns (uint256) {
        return account.balance;
    }
}
