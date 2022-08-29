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

    function getOpenNFTsNftInfos(address collection, uint256 tokenID)
        external
        view
        override(IOpenNFTsResolver)
        returns (NftInfos memory nftInfos, OpenNFTsNftInfos memory openNTFsNftInfos)
    {
        CollectionInfos memory collectionInfos = OpenGetter._getCollectionInfos(collection, address(0), _interfaceIds);

        nftInfos = OpenGetter.getNftInfos(collection, tokenID, collectionInfos.supported[3]);
        openNTFsNftInfos = _getOpenNFTsNftInfos(collection, tokenID, collectionInfos.supported);
    }

    function getOpenNFTsCollectionsInfos(address account)
        external
        view
        override(IOpenNFTsResolver)
        returns (CollectionInfos[] memory collectionsInfos, OpenNFTsCollectionInfos[] memory openNFTsCollectionsInfos)
    {
        CollectionInfos[] memory collectionsInfosAll = getCollectionsInfos(getAddresses(), account, _interfaceIds);

        uint256 len;
        for (uint256 i = 0; i < collectionsInfosAll.length; i++) {
            if (collectionsInfosAll[i].balanceOf > 0 || collectionsInfosAll[i].owner == account) len++;
        }

        collectionsInfos = new CollectionInfos[](len);
        openNFTsCollectionsInfos = new OpenNFTsCollectionInfos[](len);

        uint256 j;
        for (uint256 i = 0; i < collectionsInfosAll.length; i++) {
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
            (nftInfos.receiver, nftInfos.fraction) = IOpenMarketable(payable(collection)).getTokenRoyaltyInfo(tokenID);
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

        if (supported[10]) {
            // ERC2981
            (collInfos.receiver, collInfos.fraction) = IOpenMarketable(payable(collection)).getDefaultRoyaltyInfo();
        }
        if (supported[14]) {
            // OpenMarketable
            collInfos.price = IOpenMarketable(payable(collection)).defaultPrice();
        }
    }
}
