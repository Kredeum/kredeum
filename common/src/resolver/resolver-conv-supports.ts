const resolverConvSupports = (checks: Array<boolean>): Map<string, boolean> => {
  /// 0xffffffff :  O Invalid
  /// 0x01ffc9a7 :  1 ERC165
  ///
  /// 0x80ac58cd :  2 ERC721
  /// 0x5b5e139f :  3 ERC721Metadata
  /// 0x780e9d63 :  4 ERC721Enumerable
  /// 0x150b7a02 :  5 ERC721TokenReceiver
  ///
  /// 0xd9b67a26 :  6 ERC1155
  /// 0x0e89341c :  7 ERC1155MetadataURI
  /// 0x4e2312e0 :  8 ERC1155TokenReceiver
  ///
  /// 0x7f5828d0 :  9 ERC173
  /// 0x2a55205a : 10 ERC2981

  /// : 11 IOpenNFTs
  /// : 12 IOpenChecker
  /// : 13 IOpenCloneable
  /// : 14 IOpenMarketable
  /// : 15 IOpenPauseable

  /// : 16 IOpenNFTsV0
  /// : 17 IOpenNFTsV1
  /// : 18 IOpenNFTsV2
  /// : 19 IOpenNFTsV3
  /// 0xb6ea5501 : 20 IOpenNFTsV4
  /// : 21 IOpenAutoMarket
  /// : 22 IOpenBound

  if (!(checks && checks.length == 23)) throw `ERROR resolverConvSupports bad checks length ${checks?.length}`;

  let i = 1;
  const supportsObject = {
    IERC165: checks[i++],

    IERC721: checks[i++],
    IERC721Metadata: checks[i++],
    IERC721Enumerable: checks[i++],
    IERC721TokenReceiver: checks[i++],

    IERC1155: checks[i++],
    IERC1155MetadataURI: checks[i++],
    IERC1155TokenReceiver: checks[i++],

    IERC173: checks[i++],
    IERC2981: checks[i++],

    IOpenNFTs: checks[i++],
    IOpenChecker: checks[i++],
    IOpenCloneable: checks[i++],
    IOpenMarketable: checks[i++],
    IOpenPauseable: checks[i++],

    IOpenNFTsV0: checks[i++],
    IOpenNFTsV1: checks[i++],
    IOpenNFTsV2: checks[i++],
    IOpenNFTsV3: checks[i++],
    IOpenNFTsV4: checks[i++],
    IOpenAutoMarket: checks[i++],
    IOpenBound: checks[i++]
  };
  const supports = new Map(Object.entries(supportsObject));

  // console.log("resolverConvSupports", address, supports);

  // assert IERC165 to be always true and check 0xffffffff to be false
  if (!(supports.get("IERC165") && !checks[0] && i == 23)) throw "ERROR resolverConvSupports";
  for (const [key, value] of supports) {
    if (!value) supports.delete(key);
  }

  return supports;
};

export { resolverConvSupports };
