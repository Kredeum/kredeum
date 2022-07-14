// SPDX-License-Identifier: MITs
pragma solidity 0.8.9;

import "./ERC721.t.sol";
import "./ERC721Enumerable.t.sol";
import "./ERC721Metadata.t.sol";
import "./ERC165.t.sol";

abstract contract OpenNFTsTest is ERC721Test, ERC721MetadataTest, ERC721EnumerableTest, ERC165Test {
    string internal constant _TOKEN_URI = "ipfs://bafkreidfhassyaujwpbarjwtrc6vgn2iwfjmukw3v7hvgggvwlvdngzllm";
    bool private _transferable = true;

    function constructorTest(address owner_)
        public
        virtual
        override(ERC721MetadataTest, ERC721EnumerableTest, ERC165Test, ERC721Test)
        returns (address);

    function mintTest(address collection, address minter_)
        public
        virtual
        override(ERC721MetadataTest, ERC721EnumerableTest, ERC721Test)
        returns (uint256);

    function burnTest(address collection, uint256 tokenID) public virtual override(ERC721Test);

    function setUpOpenNFTs(
        string memory name_,
        string memory symbol_,
        bool nonTransferable_
    ) public {
        _transferable = nonTransferable_;
        setUpOpenNFTs(name_, symbol_);
    }

    function setUpOpenNFTs(string memory name_, string memory symbol_) public {
        setUpERC165();
        setUpERC721(_transferable);
        setUpERC721Metadata(name_, symbol_);
        setUpERC721Enumerable();
    }
}
