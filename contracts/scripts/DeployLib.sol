// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DeployLib is Script {
    using Strings for uint256;

    string constant ADDRESSES_FILE = "./addresses.json";

    function writeAddress(string memory name, address addr) public {
        string memory path = string.concat(".", block.chainid.toString(), ".", name);
        vm.writeJson(Strings.toHexString(uint160(addr), 20), ADDRESSES_FILE, path);
    }

    function readAddress(string memory name) public view returns (address) {
        string memory jsonFile = vm.readFile(ADDRESSES_FILE);
        string memory path = string.concat(".", block.chainid.toString(), ".", name);

        return abi.decode(vm.parseJson(jsonFile, path), (address));
    }

    function isDeployed(string memory name) public view returns (bool deployed, address addr) {
        addr = readAddress(name);
        bytes memory code = vm.getDeployedCode(string.concat(name, ".sol:", name));
        deployed = (keccak256(addr.code) == keccak256(code));
    }

    function saveDeployed(string memory name, address addr) public {
        writeAddress(name, addr);
        console.log(name, "deployed to @", addr);
    }

    function deploy(string memory name) public returns (address) {
        (bool deployed, address addr) = isDeployed(name);

        if (deployed) {
            console.log(name, "already deployed at @", addr);
        } else {
            console.log(name, "deploying...");
            
            string memory deployFunction = string.concat("deploy", name, "()");
            (bool success, bytes memory result) = address(this).call(abi.encodeWithSignature(deployFunction));

            require(success, "deploy failed");
            (addr) = abi.decode(result, (address));

            saveDeployed(name, addr);
        }

        return addr;
    }
}
