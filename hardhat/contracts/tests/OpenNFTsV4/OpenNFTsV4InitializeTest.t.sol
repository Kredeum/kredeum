// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "forge-std/Test.sol";

import "OpenNFTs/contracts/interfaces/IERC173.sol";
import "OpenNFTs/contracts/interfaces/IERC721Metadata.sol";
import "OpenNFTs/contracts/interfaces/IOpenCloneable.sol";
import "../../interfaces/IOpenNFTsV4.sol";

abstract contract OpenNFTsV4InitializeTest is Test {
    address private _collection;
    address private _owner = address(0x1);
    address private _minter = address(0x12);
    address private _buyer = address(0x13);
    address private _tester = address(0x4);
    bool[] private _options = new bool[](1);
    bytes private _optionsEncoded;

    function constructorTest(address owner_, bool init_) public virtual returns (address);

    function setUpOpenNFTsV4Initialize() public {
        _collection = constructorTest(_owner, false);

        _options[0] = true;
        _optionsEncoded = abi.encode(abi.encode(_options), address(0), 0);
    }

    function testInitializeName() public {
        IOpenCloneable(_collection).initialize("OpenNFTsV4InitializeTest", "TEST", _owner, _optionsEncoded);
        // assertEq(IERC721Metadata(_collection).name(), "OpenNFTsV4InitializeTest");
    }

    function testInitializeSymbol() public {
        IOpenCloneable(_collection).initialize("OpenNFTsV4InitializeTest", "TEST", _owner, _optionsEncoded);
        assertEq(IERC721Metadata(_collection).symbol(), "TEST");
    }

    function testInitializeOwner() public {
        IOpenCloneable(_collection).initialize("OpenNFTsV4InitializeTest", "TEST", _owner, _optionsEncoded);
        assertEq(IERC173(_collection).owner(), _owner);
    }

    function testInitializeOpen() public {
        IOpenCloneable(_collection).initialize("OpenNFTsV4InitializeTest", "TEST", _owner, _optionsEncoded);
        assertEq(IOpenNFTsV4(_collection).open(), true);
    }

    function testInitializeNotOpen() public {
        _options[0] = false;
        IOpenCloneable(_collection).initialize("OpenNFTsV4InitializeTest", "TEST", _owner, abi.encode(abi.encode(_options), address(0), 0));
        assertEq(IOpenNFTsV4(_collection).open(), false);
    }

    function testFailInitializeTwice() public {
        IOpenCloneable(_collection).initialize("OpenNFTsV4InitializeTest", "TEST", _owner, _optionsEncoded);
        IOpenCloneable(_collection).initialize("OpenNFTsOldTestTwice", "OPTEST2", _tester, _optionsEncoded);
    }
}
