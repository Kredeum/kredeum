// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsInitializeTest is OpenNFTsOldTest {
    function testInitialize() public {
        assertEq(options[0], true);
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, options);
        assertEq(opn.open(), true);
    }

    function testInitializeNotOpen() public {
        options[0] = false;
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, options);
        assertEq(opn.open(), false);
    }

    function testFailInitializeTwice() public {
        options[0] = false;
        opn.initialize("OpenNFTsOldTest", "OPTEST", owner, options);
        opn.initialize("OpenNFTsOldTestTwice", "OPTEST2", tester, options);
    }
}
