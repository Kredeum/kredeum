// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IContractProbe.sol";
import "hardhat/console.sol";

contract CloneFactory is Ownable {
  // implementations : template or clone
  address[] public implementations;
  address public template;

  mapping(address => address) public templates;

  address private contractProbe;

  event NewImplementation(address implementation, address template, address creator);
  event NewTemplate(address template, address creator);

  constructor(address _contractProbe) {
    contractProbe = _contractProbe;
  }

  /*
   *  ADD Implementation
   *
   *  _implementation : Implementation address
   */
  function addImplementation(address _implementation) public onlyOwner {
    require(templates[_implementation] == address(0), "Implementation already exists");

    (bool _isContract, address _template) = IContractProbe(contractProbe).probe(_implementation);

    require(_isContract, "Implementation is not a Contract");

    implementations.push(_implementation);
    templates[_implementation] = _template;

    emit NewImplementation(_implementation, _template, msg.sender);
  }

  /*
   *  SET default Template to be Cloned
   *
   *  _template : Template address
   */
  function setDefaultTemplate(address _template) external onlyOwner {
    if (templates[_template] == address(0)) addImplementation(_template);
    require(templates[_template] == _template, "Template is a Clone");

    template = _template;

    emit NewTemplate(_template, msg.sender);
  }

  /*
   *  Implementations count
   *
   *  returns : Number of implementation
   */
  function implementationsCount() public view returns (uint256 count) {
    return implementations.length;
  }

  /*
   *  Clone Template
   *
   *  returns : Clone Address
   */
  function clone() public payable virtual returns (address _clone) {
    require(template != address(0), "Template doesn't exist");

    _clone = Clones.clone(template);
    addImplementation(_clone);
  }
}
