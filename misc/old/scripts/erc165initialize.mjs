async function initialize() {
  // Check contract
  const checkContract = new ethers.Contract(this.configContract.address, abis["ERC165"], this.provider);

  const waitCheck0 = checkContract.supportsInterface("0xffffffff"); // FALSE
  const waitCheck1 = checkContract.supportsInterface("0x01ffc9a7"); // ERC165
  const waitCheck2 = checkContract.supportsInterface("0x80ac58cd"); // ERC721
  const [check0, check1, check2] = await Promise.all([waitCheck0, waitCheck1, waitCheck2]);

  // checkContract ok
  if (!check0 && check1 && check2) {
    let abi = abis["ERC721"];

    const waitMetadata = checkContract.supportsInterface("0x5b5e139f");
    const waitEnumerable = checkContract.supportsInterface("0x780e9d63");
    // const waitVersion0 = checkContract.supportsInterface("0x4b68d431");
    // const waitVersion1 = checkContract.supportsInterface("0xeacabe14");
    [this.supportsMetadata, this.supportsEnumerable] = await Promise.all([
      // waitVersion0,
      // waitVersion1,
      waitMetadata,
      waitEnumerable
    ]);

    if (this.supportsMetadata) abi = abi.concat(abis["ERC721Metadata"]);
    if (this.supportsEnumerable) abi = abi.concat(abis["ERC721Enumerable"]);
    // if (this._version0) abi = abi.concat(abis["KREDEUMv0"]);
    // if (this._version1) abi = abi.concat(abis["KREDEUMv1"]);
    abi = abi.concat(abis["KREDEUMv1"]);

    // console.log("contract abi", abi);
    this.smartContract = new ethers.Contract(this.configContract.address, abi, this.provider);
    this.ok = true;
  }
}
