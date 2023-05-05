// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Script.sol";

contract OpenNFTsCommon is Script {
    address immutable treasuryAccount = 0x47e2382D9e1e985BA1F4064E7D8d753Fab99F209;
    uint96 immutable treasuryFee = 90;
    string constant ADDRESSES_FILE = "./addresses.json";
    address deployer;

    function writeAddress(string memory name, address addr) public {
        string memory path = string.concat(".", vm.toString(block.chainid), ".", name);
        vm.writeJson(vm.toString(addr), ADDRESSES_FILE, path);
    }

    function readAddress(string memory name) public view returns (address) {
        string memory jsonFile = vm.readFile(ADDRESSES_FILE);
        string memory path = string.concat(".", vm.toString(block.chainid), ".", name);

        return abi.decode(vm.parseJson(jsonFile, path), (address));
    }
}
