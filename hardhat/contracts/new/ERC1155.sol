// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Open1155 is ERC1155, Ownable {
    constructor() ERC1155("") {}

    // solhint-disable-next-line comprehensive-interface
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
