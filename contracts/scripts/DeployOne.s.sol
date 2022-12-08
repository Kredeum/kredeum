// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import "src/OpenNFTsFactoryV3.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Simple {}

contract DeployOne is Script {
    address treasury = makeAddr("treasury");
    uint96 treasuryFee = 90;

    OpenNFTsFactoryV3 openNFTsFactoryV3;

    function run() public {
        string memory path = string.concat(
            vm.projectRoot(), "/broadcast/DeployOne.s.sol/", Strings.toString(block.chainid), "/run-latest.json"
        );
        console.log("path", path);

        string memory json = vm.readFile(path);
        bytes memory bytecodeLatest = vm.parseJson(json, ".transactions[0].transaction.data");
        console.log("bytecodeLatest", bytecodeLatest.length);
        console.logBytes(vm.parseJson(json, ".transactions[0].transaction"));
        console.logBytes(vm.parseJson(json, ".transactions[0].hash"));
        // console.logBytes32(keccak256(bytecodeLatest));

        // bytes memory args = abi.encode(owner, treasury, treasuryFee);
        // bytes memory bytecodeNew = abi.encodePacked(vm.getCode("OpenNFTsFactoryV3.sol:OpenNFTsFactoryV3"), args);
        bytes memory bytecodeNew = abi.encodePacked(vm.getCode("DeployOne.s.sol:Simple"));

        console.log("bytecodeNew", bytecodeNew.length);
        console.logBytes(bytecodeNew);
        // console.logBytes32(keccak256(bytecodeNew));

        if (keccak256(bytecodeLatest) == keccak256(bytecodeNew)) {
            console.log("Already deployed !");
        } else {
            vm.startBroadcast();

            new Simple();
            // openNFTsFactoryV3 = new OpenNFTsFactoryV3(owner, treasury, treasuryFee);

            vm.stopBroadcast();
        }
    }
}
