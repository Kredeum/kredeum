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

    function getOpenNFTsResolverCollectionInfos(address collection, address account)
        external
        view
        override(IOpenNFTsResolver)
        returns (OpenNFTsCollectionInfos memory openNFTs)
    {
        CollectionInfos memory collectionInfos = OpenGetter._getCollectionInfos(collection, account, _interfaceIds);

        openNFTs.collectionInfos = collectionInfos;
        (openNFTs.version, openNFTs.template, openNFTs.open) = _addOtherDatas(collection, collectionInfos.supported);
    }

    function getOpenNFTsResolverCollectionsInfos(address account)
        external
        view
        override(IOpenNFTsResolver)
        returns (OpenNFTsCollectionInfos[] memory openNFTs)
    {
        CollectionInfos[] memory collectionsInfosAll = getCollectionsInfos(getAddresses(), account, _interfaceIds);

        uint256 len;
        for (uint256 i = 0; i < collectionsInfosAll.length; i++) {
            if (collectionsInfosAll[i].balanceOf > 0 || collectionsInfosAll[i].owner == account) len++;
        }

        openNFTs = new OpenNFTsCollectionInfos[](len);

        uint256 j;
        for (uint256 i = 0; i < collectionsInfosAll.length; i++) {
            if (collectionsInfosAll[i].balanceOf > 0 || collectionsInfosAll[i].owner == account) {
                openNFTs[j].collectionInfos = collectionsInfosAll[i];
                (openNFTs[j].version, openNFTs[j].template, openNFTs[j].open) = _addOtherDatas(
                    collectionsInfosAll[i].collection,
                    collectionsInfosAll[i].supported
                );
                j++;
            }
        }
    }

    function supportsInterface(bytes4 interfaceId) public view override(OpenResolver) returns (bool) {
        return interfaceId == type(IOpenNFTsResolver).interfaceId || super.supportsInterface(interfaceId);
    }

    function _addOtherDatas(address collection, bool[] memory supported)
        internal
        view
        returns (
            uint256 version,
            string memory template,
            bool open
        )
    {
        if (supported[13]) {
            // IOpenCloneable
            version = IOpenCloneable(collection).version(); // 4
            template = IOpenCloneable(collection).template(); // OpenNFTsV4 or OpenBound
            open = IOpenNFTsV4(collection).open();
        } else if (supported[19]) {
            // OpenNFTsV3
            version = 3;
            template = "OpenNFTsV3";
            open = IOpenNFTsV3(collection).open();
        } else if (supported[18]) {
            // OpenNFTsV2
            version = 2;
        } else if (supported[17]) {
            // OpenNFTsV1
            version = 1;
        } else if (supported[16]) {
            // OpenNFTsV0
            version = 0;
        }
    }
}
