// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract CloneFactory is Ownable {
    address[] _templates;
    address[] _implementations;

    event NewImplementation(
        address implementation,
        uint256 indexed version,
        bool indexed isTemplate,
        address indexed creator
    );

    constructor() {}

    /*
     *  SET Template
     *
     *  _template : Template to clone
     */
    function template(address _template) public onlyOwner {
        _templates.push(_template);
        addImplementation(_template, version(), true, owner());
    }

    /*
     *  Clone the Template
     *
     *  returns : Clone Address
     */
    function clone() external returns (address _clone) {
        _clone = Clones.clone(template());
        addImplementation(_clone, version(), false, msg.sender);
    }

    /*
     *  ADD Clone
     *
     *  _clone : existing clone address
     *  _version : existing clone version
     */
    function addImplementation(
        address _implementation,
        uint256 _version,
        bool _isTemplate,
        address _creator
    ) public onlyOwner {
        _implementations.push(_implementation);

        emit NewImplementation(
            _implementation,
            _version,
            _isTemplate,
            _creator
        );
    }

    /*
     *  GET Version
     *
     *  returns : Template Version
     */
    function version() public view returns (uint256) {
        return _templates.length - 1;
    }

    /*
     *  GET Template
     *
     *  returns : Current Template
     */
    function template() public view returns (address) {
        return _templates[version()];
    }

    /*
     *  GET Templates
     *
     *  returns : all Templates
     */
    function templates() public view returns (address[] memory) {
        return _templates;
    }

    /*
     *  GET Implementations
     *
     *  returns : all Implementations
     */
    function implementations() public view returns (address[] memory) {
        return _implementations;
    }
}
