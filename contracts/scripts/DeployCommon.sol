// SPDX-License-Identifier: MITs
pragma solidity 0.8.17;

contract DeployCommon {
    address immutable treasuryAccount = 0x47e2382D9e1e985BA1F4064E7D8d753Fab99F209;
    uint96 immutable treasuryFee = 90;
    string constant ADDRESSES_FILE = "./addresses.json";
    address deployer;
}
