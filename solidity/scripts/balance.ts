import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log(
    ethers.utils.formatEther(
      await ethers.provider.getBalance("0xfA631B3A8C8F8A871f42DC18cA77DD924eEeC04D")
    )
  );
}
main();
