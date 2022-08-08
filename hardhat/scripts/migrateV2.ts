import type { NFTsFactory, NFTsFactoryV2 } from "soltypes/contracts";
import type { IERC165 } from "soltypes/contracts/interfaces";
import type { NetworkType } from "lib/ktypes";

import networks from "config/networks.json";

import abiIERC165 from "abis/contracts/interfaces/IERC165.sol/IERC165.json";
import abiINFTsFactory from "abis/contracts/interfaces/INFTsFactory.sol/INFTsFactory.json";
import abiICloneFactory from "abis/contracts/interfaces/ICloneFactory.sol/ICloneFactory.json";
import abiINFTsFactory2 from "abis/contracts/interfaces/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import abiICloneFactory2 from "abis/contracts/interfaces/ICloneFactoryV2.sol/ICloneFactoryV2.json";

import { ethers, getChainId } from "hardhat";
import Prompt from "prompt-sync";
const prompt = Prompt();

const random = "0x41ea3c9e0f803905983bda6f484d438f9a066106";

const addresses = async (nftsFactoryV2orV3: NFTsFactory | NFTsFactoryV2): Promise<string[]> => {
  const addresses: string[] = [];
  const balances = await nftsFactoryV2orV3.balancesOf(random);
  balances.forEach((balance) => addresses.push(balance[0]));
  return addresses;
};

const main = async () => {
  const { provider, getNamedSigners } = ethers;

  const chainId = Number(await getChainId());
  const { deployer } = await getNamedSigners();

  const network = networks.find((nw) => nw.chainId === chainId) as NetworkType;
  const nftsFactory: NFTsFactory = new ethers.Contract(
    network.nftsFactory || "",
    abiINFTsFactory.concat(abiICloneFactory),
    provider
  ) as NFTsFactory;

  const nftsFactoryV2: NFTsFactoryV2 = new ethers.Contract(
    network.nftsFactoryV2 || "",
    abiINFTsFactory2.concat(abiICloneFactory2),
    provider
  ) as NFTsFactoryV2;

  console.log("chainId      ", chainId);
  console.log("deployer     ", deployer.address);
  console.log("nftsFactory  ", nftsFactory.address);
  console.log("nftsFactoryV2", nftsFactoryV2.address);

  const impls = await addresses(nftsFactory);
  console.log(impls.length, "implementations NFTsFactory", impls);

  const implsV2 = await addresses(nftsFactoryV2);
  console.log(implsV2.length, "implementations V2", implsV2);

  const toMigrate: string[] = [];
  for await (const impl of impls) {
    let isERC721andNotV2 = false;

    // Not in V2
    if (implsV2.indexOf(impl) == -1) {
      const contract = new ethers.Contract(impl, abiIERC165, deployer);
      try {
        isERC721andNotV2 = await (contract as IERC165).supportsInterface("0x80ac58cd");
      } catch (e) {
        console.error(impl, e);
      }
    }
    if (isERC721andNotV2) {
      console.log(impl);
      toMigrate.push(impl);
    }
  }
  const n = toMigrate.length;

  if (n > 0) {
    console.log(n, "implementations to migrate to V2", toMigrate);
    console.log((await nftsFactoryV2.connect(deployer).estimateGas.implementationsAdd(toMigrate)).toString());

    const go: string = prompt("Proceed with Migration y/N ? ");
    if (go[0].toLowerCase() == "y") {
      console.log("START Migration...");
      await (await nftsFactoryV2.connect(deployer).implementationsAdd(toMigrate, { gasLimit: 700_000 })).wait();
      console.log("END   Migration !");

      const implV2new = await addresses(nftsFactoryV2);
      console.log(implV2new.length, "implementations NFTsFactoryV2", implV2new);
    }
  } else {
    console.log("Nothing to migrate to V2");
  }
};

main().catch(console.error);
