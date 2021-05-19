import hre from "hardhat";
const { ethers } = hre;
const ethscan = hre.network.config.ethscan;

const OpenNFTsAddresses = {
  matic: "",
  mumbai: [
    "0x17Fb61016939409E6b7Cd7cFaE468b707A896Bae",
    "0xAFE822240383dd0ab8A19253212Ea9e1D6BA5E3b",
    "0x5c960b1ffd17eade16a82293e6f591f35af60cee"
  ]
};

OpenNFTsAddresses[network.name].forEach(async (OpenNFTsAddress, i) => {
  console.log(`Contract OpenNFTs${i} ${ethscan}/address/${OpenNFTsAddress}`);

  const OpenNFTs = await ethers.getContractAt("OpenNFTs", OpenNFTsAddress);

  console.log(await OpenNFTs.symbol());
  console.log((await OpenNFTs.totalSupply()).toString());
});
