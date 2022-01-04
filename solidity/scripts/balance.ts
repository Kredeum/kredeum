import hre from "hardhat";
const { ethers } = hre;

const main = async (): Promise<string> =>
  ethers.utils.formatEther(await ethers.provider.getBalance("0xfA631B3A8C8F8A871f42DC18cA77DD924eEeC04D"));

main()
  .then(console.log)
  .catch((r) => console.error("ERROR", r));
