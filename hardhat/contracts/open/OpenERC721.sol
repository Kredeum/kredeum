// SPDX-License-Identifier: MIT
//
// Derived from OpenZeppelin Contracts (token/ERC721/ERC721.sol)
// https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721/ERC721.sol

//
//                OpenERC165
//                     |
//                OpenERC721
//

pragma solidity 0.8.9;

import "./OpenERC165.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IERC721TokenReceiver.sol";

abstract contract OpenERC721 is IERC721, OpenERC165 {
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    modifier onlyTokenOwner(uint256 tokenID) {
        require(ownerOf(tokenID) == msg.sender, "Not token owner");
        _;
    }

    modifier onlyTokenAuthorized(uint256 tokenID) {
        require(
            ownerOf(tokenID) == msg.sender ||
                _tokenApprovals[tokenID] == msg.sender ||
                _operatorApprovals[ownerOf(tokenID)][msg.sender],
            "Not token authorized"
        );
        _;
    }

    function approve(address to, uint256 tokenID) public override(IERC721) {
        require(ownerOf(tokenID) == msg.sender || _operatorApprovals[ownerOf(tokenID)][msg.sender], "Not authorized");

        _approve(to, tokenID);
    }

    function setApprovalForAll(address operator, bool approved) public override(IERC721) {
        _setApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenID
    ) public override(IERC721) {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenID), "Not token owner nor approved");

        _transfer(from, to, tokenID);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenID
    ) public override(IERC721) {
        safeTransferFrom(from, to, tokenID, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenID,
        bytes memory data
    ) public override(IERC721) {
        require(_isApprovedOrOwner(msg.sender, tokenID), "Not token owner nor approved");
        _safeTransfer(from, to, tokenID, data);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(OpenERC165) returns (bool) {
        return
            interfaceId == 0x80ac58cd || // = type(IERC721).interfaceId
            super.supportsInterface(interfaceId);
    }

    function balanceOf(address owner) public view override(IERC721) returns (uint256) {
        require(owner != address(0), "Address zero not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenID) public view override(IERC721) returns (address) {
        address owner = _owners[tokenID];
        require(owner != address(0), "Invalid token ID");
        return owner;
    }

    function getApproved(uint256 tokenID) public view override(IERC721) returns (address) {
        _requireMinted(tokenID);

        return _tokenApprovals[tokenID];
    }

    function isApprovedForAll(address owner, address operator) public view override(IERC721) returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function _safeTransfer(
        address from,
        address to,
        uint256 tokenID,
        bytes memory data
    ) internal {
        _transfer(from, to, tokenID);
        require(_checkOnERC721Received(from, to, tokenID, data), "Transfer not ERC721TokenReceiver");
    }

    function _mintNft(address to, uint256 tokenID) internal {
        require(to != address(0), "Mint to zero address");
        require(!_exists(tokenID), "Token already minted");

        _balances[to] += 1;
        _owners[tokenID] = to;

        emit Transfer(address(0), to, tokenID);
        require(_checkOnERC721Received(address(0), to, tokenID, ""), "Transfer not ERC721TokenReceiver");
    }

    function _burnNft(uint256 tokenID) internal {
        address owner = ownerOf(tokenID);

        // _beforeTokenTransfer(owner, address(0), tokenID);

        // Clear approvals
        _approve(address(0), tokenID);

        _balances[owner] -= 1;
        delete _owners[tokenID];

        emit Transfer(owner, address(0), tokenID);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenID
    ) internal {
        require(ownerOf(tokenID) == from, "Transfer from incorrect owner");
        require(to != address(0), "Transfer to zero address");

        // _beforeTokenTransfer(from, to, tokenID);

        // Clear approvals from the previous owner
        delete _tokenApprovals[tokenID];

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenID] = to;

        emit Transfer(from, to, tokenID);
    }

    function _approve(address to, uint256 tokenID) internal {
        _tokenApprovals[tokenID] = to;
        emit Approval(ownerOf(tokenID), to, tokenID);
    }

    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal {
        require(owner != operator, "Approve to caller");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenID
    // ) internal virtual {}

    function _requireMinted(uint256 tokenID) internal view {
        require(_exists(tokenID), "Invalid token ID");
    }

    function _exists(uint256 tokenID) internal view returns (bool) {
        return _owners[tokenID] != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenID) internal view virtual returns (bool) {
        address owner = ownerOf(tokenID);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenID) == spender);
    }

    function _isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }

    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenID,
        bytes memory data
    ) private returns (bool) {
        if (_isContract(to)) {
            try IERC721TokenReceiver(to).onERC721Received(msg.sender, from, tokenID, data) returns (bytes4 retval) {
                return retval == IERC721TokenReceiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("Transfer not ERC721TokenReceiver");
                } else {
                    /// @solidity memory-safe-assembly
                    // solhint-disable-next-line no-inline-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }
}
