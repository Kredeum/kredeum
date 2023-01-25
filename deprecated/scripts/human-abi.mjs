import fs from "fs";
import hre from "hardhat";
const { ethers } = hre;
const network = hre.network.name;

const contracts = JSON.parse(fs.readFileSync("../config/contracts.json"));
const abis = JSON.parse(fs.readFileSync("../config/abis.json"));

contracts.forEach(async (contract) => {
  if (network === contract.network) {
    const openNFTs = await ethers.getContractAt(contract.name, contract.address);

    let abi = [];
    contract.interfaces.forEach((iface) => {
      abi = abi.concat(abis[iface]);
    });
    const abiReal = await openNFTs.interface.format(["json"]);

    if (JSON.stringify(abi) === JSON.stringify(abiReal)) {
      console.log(contract.address, contract.name, abi, "OK");
    } else {
      console.log(contract);
      console.log("abi", abi);
      console.log("abiReal", abiReal);
    }
  }
});
