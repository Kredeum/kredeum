import fs from "fs";
import hre from "hardhat";
const { ethers } = hre;
const network = hre.network.name;

const contracts = JSON.parse(fs.readFileSync("../config/contracts.json"));
const abis = JSON.parse(fs.readFileSync("../config/abis.json"));

contracts.forEach(async (contract) => {
  if (network === contract.network) {
    const openNFTs = await ethers.getContractAt(contract.name, contract.address);

    const abi = await openNFTs.interface.format(["json"]);
    if (JSON.stringify(abi) === JSON.stringify(abis[contract.abi])) {
      console.log(contract.address, contract.name, contract.abi, "OK");
    } else {
      console.log(contract);
      console.log("contract.abi", abis[contract.abi]);
      console.log("contract.interface", abi);
    }
  }
});
