// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsInitializeTest is OpenNFTsOldTest {
    function testInitialize() public {
        assertEq(options[0], true);
        changePrank(owner);
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner,  0, address(0), 0,options);
        assertEq(opn.open(), true);
    }

    function testInitializeNotOpen() public {
        options[0] = false;
        changePrank(owner);
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, 0, address(0), 0, options);
        assertEq(opn.open(), false);
    }

    function testFailInitializeTwice() public {
        options[0] = false;
        changePrank(owner);
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner,  0, address(0), 0,options);
        opn.initialize("OpenNFTsOldTestTwice", "OPTEST2", owner, 0, address(0), 0, options);
    }
}
