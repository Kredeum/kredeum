// SPDX-License-Identifier: MITs
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import "src/OpenNFTsResolver.sol";
import "./OpenNFTsResolverSupportsTest.t.sol";
import "./OpenNFTsResolverGetterTest.t.sol";

import "OpenNFTs/tests/units/OpenResolverTest.t.sol";
import "OpenNFTs/tests/units/OpenCheckerTest.t.sol";
import "OpenNFTs/tests/units/OpenGetterTest.t.sol";
import "OpenNFTs/tests/units/OpenRegistryTest.t.sol";

contract OpenNFTsResolverTest is
    Test,
    OpenResolverTest,
    OpenCheckerTest,
    OpenGetterTest,
    OpenRegistryTest,
    OpenNFTsResolverSupportsTest,
    OpenNFTsResolverGetterTest
{
    function constructorTest(address owner)
        public
        override(
            OpenResolverTest,
            OpenGetterTest,
            OpenCheckerTest,
            OpenRegistryTest,
            OpenNFTsResolverSupportsTest,
            OpenNFTsResolverGetterTest
        )
        returns (address)
    {
        OpenNFTsResolver smartcontract = new OpenNFTsResolver(owner, owner);

        return address(smartcontract);
    }

    function setUp() public {
        setUpOpenResolver();
        setUpOpenRegistry();
        setUpOpenChecker();
        setUpOpenGetter();
        setUpOpenNFTsResolverSupports();
        setUpOpenNFTsResolverGetter();
    }
}
