// SPDX-License-Identifier: MIT
//
//    OpenERC165
//        |
//  OpenResolver
//        |
//  OpenNFTsResolver —— IOpenNFTsResolver
//
pragma solidity 0.8.9;

import "OpenNFTs/contracts/OpenResolver/OpenResolver.sol";
import "../interfaces/IOpenNFTsResolver.sol";
import "../interfaces/IAll.sol";

contract OpenNFTsResolver is IOpenNFTsResolver, OpenResolver {
    bytes4[] private _interfaceIds = new bytes4[](11);

    constructor(address owner_, address registerer_) {
        OpenERC173._initialize(owner_);
        OpenRegistry._setRegisterer(registerer_);
        /// 0xffffffff :  O Invalid
        /// 0x01ffc9a7 :  1 ERC165
        /// 0x80ac58cd :  2 ERC721
        /// 0x5b5e139f :  3 ERC721Metadata
        /// 0x780e9d63 :  4 ERC721Enumerable
        /// 0x150b7a02 :  5 ERC721TokenReceiver
        /// 0xd9b67a26 :  6 ERC1155
        /// 0x0e89341c :  7 ERC1155MetadataURI
        /// 0x4e2312e0 :  8 ERC1155TokenReceiver
        /// 0x7f5828d0 :  9 ERC173
        /// 0x2a55205a : 10 ERC2981

        _interfaceIds[0] = type(IOpenNFTs).interfaceId; //       11+0  = 11
        _interfaceIds[1] = type(IOpenChecker).interfaceId; //    11+1  = 12
        _interfaceIds[2] = type(IOpenCloneable).interfaceId; //  11+2  = 13
        _interfaceIds[3] = type(IOpenMarketable).interfaceId; // 11+3  = 14
        _interfaceIds[4] = type(IOpenPauseable).interfaceId; //  11+4  = 15

        _interfaceIds[5] = type(IOpenNFTsV0).interfaceId; //     11+5  = 16
        _interfaceIds[6] = type(IOpenNFTsV1).interfaceId; //     11+6  = 17
        _interfaceIds[7] = type(IOpenNFTsV2).interfaceId; //     11+7  = 18
        _interfaceIds[8] = type(IOpenNFTsV3).interfaceId; //     11+8  = 19
        _interfaceIds[9] = type(IOpenNFTsV4).interfaceId; //     11+9  = 20
        _interfaceIds[10] = type(IOpenBound).interfaceId; //     11+10 = 21
    }

    function getOpenNFTsNftsInfos(
        address collection,
        address account,
        uint256 limit,
        uint256 offset
    )
        external
        view
        override(IOpenNFTsResolver)
        returns (
            NftInfos[] memory nftInfos,
            OpenNFTsNftInfos[] memory openNTFsNftInfos,
            CollectionInfos memory collectionInfos,
            uint256 count,
            uint256 total
        )
    {
        collectionInfos = OpenGetter._getCollectionInfos(collection, account, _interfaceIds);

        (nftInfos, count, total) = OpenGetter.getNftsInfos(collection, account, limit, offset);

        openNTFsNftInfos = new OpenNFTsNftInfos[](nftInfos.length);
        for (uint256 i = 0; i < nftInfos.length; i++) {
            openNTFsNftInfos[i] = _getOpenNFTsNftInfos(collection, nftInfos[i].tokenID, collectionInfos.supported);
        }
    }

    function getOpenNFTsNftsInfos(address collection, uint256[] memory tokenIDs)
        external
        view
        override(IOpenNFTsResolver)
        returns (
            NftInfos[] memory nftInfos,
            OpenNFTsNftInfos[] memory openNTFsNftInfos,
            CollectionInfos memory collectionInfos
        )
    {
        collectionInfos = OpenGetter._getCollectionInfos(collection, address(0), _interfaceIds);

        nftInfos = OpenGetter.getNftsInfos(collection, tokenIDs);
        openNTFsNftInfos = new OpenNFTsNftInfos[](tokenIDs.length);
        for (uint256 i = 0; i < tokenIDs.length; i++) {
            openNTFsNftInfos[i] = _getOpenNFTsNftInfos(collection, tokenIDs[i], collectionInfos.supported);
        }
    }

    function getOpenNFTsNftInfos(address collection, uint256 tokenID)
        external
        view
        override(IOpenNFTsResolver)
        returns (
            NftInfos memory nftInfos,
            OpenNFTsNftInfos memory openNTFsNftInfos,
            CollectionInfos memory collectionInfos
        )
    {
        collectionInfos = OpenGetter._getCollectionInfos(collection, address(0), _interfaceIds);

        nftInfos = OpenGetter.getNftInfos(collection, tokenID);
        openNTFsNftInfos = _getOpenNFTsNftInfos(collection, tokenID, collectionInfos.supported);
    }

    function getOpenNFTsCollectionsInfos(address account)
        external
        view
        override(IOpenNFTsResolver)
        returns (
            CollectionInfos[] memory collectionsInfos,
            OpenNFTsCollectionInfos[] memory openNFTsCollectionsInfos,
            uint256 count,
            uint256 total
        )
    {
        CollectionInfos[] memory collectionsInfosAll = getCollectionsInfos(getAddresses(), account, _interfaceIds);
        total = collectionsInfosAll.length;

        for (uint256 i = 0; i < collectionsInfosAll.length; i++) {
            if (collectionsInfosAll[i].balanceOf > 0 || collectionsInfosAll[i].owner == account) count++;
        }

        collectionsInfos = new CollectionInfos[](count);
        openNFTsCollectionsInfos = new OpenNFTsCollectionInfos[](count);

        uint256 j;
        for (uint256 i = 0; i < total; i++) {
            if (collectionsInfosAll[i].balanceOf > 0 || collectionsInfosAll[i].owner == account) {
                collectionsInfos[j] = collectionsInfosAll[i];
                openNFTsCollectionsInfos[j] = _getOpenNFTsCollectionInfos(
                    collectionsInfosAll[i].collection,
                    collectionsInfosAll[i].supported
                );
                j++;
            }
        }
    }

    function getOpenNFTsCollectionInfos(address collection, address account)
        external
        view
        override(IOpenNFTsResolver)
        returns (CollectionInfos memory collectionInfos, OpenNFTsCollectionInfos memory openNTFscollectionInfos)
    {
        collectionInfos = OpenGetter._getCollectionInfos(collection, account, _interfaceIds);
        openNTFscollectionInfos = _getOpenNFTsCollectionInfos(collection, collectionInfos.supported);
    }

    function supportsInterface(bytes4 interfaceId) public view override(OpenResolver) returns (bool) {
        return interfaceId == type(IOpenNFTsResolver).interfaceId || super.supportsInterface(interfaceId);
    }

    function _getOpenNFTsNftInfos(
        address collection,
        uint256 tokenID,
        bool[] memory supported
    ) internal view returns (OpenNFTsNftInfos memory nftInfos) {
        if (supported[10]) {
            // ERC2981
            uint256 fee;
            (nftInfos.receiver, fee) = IERC2981(collection).royaltyInfo(tokenID, 10000);
            nftInfos.fraction = uint96(fee);
        }
        if (supported[14]) {
            // OpenMarketable
            nftInfos.price = IOpenMarketable(payable(collection)).tokenPrice(tokenID);
        }
    }

    function _getOpenNFTsCollectionInfos(address collection, bool[] memory supported)
        internal
        view
        returns (OpenNFTsCollectionInfos memory collInfos)
    {
        if (supported[13]) {
            // OpenCloneable
            collInfos.version = IOpenCloneable(collection).version(); // 4
            collInfos.template = IOpenCloneable(collection).template(); // OpenNFTsV4 or OpenBound
            collInfos.open = IOpenNFTsV4(collection).open();
        } else if (supported[19]) {
            // OpenNFTsV3
            collInfos.version = 3;
            collInfos.template = "OpenNFTsV3";
            collInfos.open = IOpenNFTsV3(collection).open();
        } else if (supported[18]) {
            // OpenNFTsV2
            collInfos.version = 2;
        } else if (supported[17]) {
            // OpenNFTsV1
            collInfos.version = 1;
        } else if (supported[16]) {
            // OpenNFTsV0
            collInfos.version = 0;
        }

        if (supported[14]) {
            // OpenMarketable
            (collInfos.receiver, collInfos.fraction) = IOpenMarketable(payable(collection)).getDefaultRoyaltyInfo();
            collInfos.price = IOpenMarketable(payable(collection)).defaultPrice();
        }
    }
}
