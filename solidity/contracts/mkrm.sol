// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MKRM is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("Kredeum", "KRM") {    }

    function deposit(address user, bytes calldata depositData) external {
        uint256 amount = abi.decode(depositData, (uint256));
        _mint(user,  amount);
    }

    function withdraw(uint256 amount) external {
      _burn(msg.sender, amount);
    }
}