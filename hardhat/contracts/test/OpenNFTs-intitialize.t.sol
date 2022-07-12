// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./OpenNFTs.t.sol";

contract OpenNFTsInitializeTest is OpenNFTsTest {
    function testInitialize() public {
        assertEq(options[0], true);
        opn.initialize("OpenNFTsTest", "OPTEST", owner, options);
        assertEq(opn.open(), true);
    }

    function testInitializeNotOpen() public {
        options[0] = false;
        opn.initialize("OpenNFTsTest", "OPTEST", owner, options);
        assertEq(opn.open(), false);
    }

    function testInitializeTwice() public {
        opn.initialize("OpenNFTsTest", "OPTEST", owner, options);

        options[0] = false;
        vm.expectRevert("Only once!");
        opn.initialize("OpenNFTsTestTwice", "OPTEST2", tester, options);
        assertEq(opn.open(), true);
    }
}
