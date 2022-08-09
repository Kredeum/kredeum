import type { NFTsFactoryV2 } from "soltypes/contracts";
import type { NFTsResolver } from "soltypes/contracts/templates";

import type { IERC165 } from "soltypes/contracts/interfaces";
import type { NetworkType } from "lib/ktypes";

import networks from "config/networks.json";

import abiIERC165 from "abis/contracts/interfaces/IERC165.sol/IERC165.json";

import abiINFTsFactory2 from "abis/contracts/interfaces/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import abiICloneFactory2 from "abis/contracts/interfaces/ICloneFactoryV2.sol/ICloneFactoryV2.json";

import abiINFTsResolver from "abis/contracts/templates/NFTsResolver.sol/NFTsResolver.json";

import { ethers, getChainId } from "hardhat";
import Prompt from "prompt-sync";
const prompt = Prompt();

const random = "0x41ea3c9e0f803905983bda6f484d438f9a066106";

const addressesV2 = async (nftsFactoryV2: NFTsFactoryV2): Promise<string[]> => {
  const addresses: string[] = [];
  const balances = await nftsFactoryV2.balancesOf(random);
  balances.forEach((balance) => addresses.push(balance[0]));
  return addresses;
};

const addressesRes = async (nftsResolver: NFTsResolver): Promise<string[]> => {
  const addresses: string[] = [];
  const collectionsInfos = await nftsResolver.openResolver(random);
  collectionsInfos.forEach((collectionInfos) => addresses.push(collectionInfos[0]));
  return addresses;
};

const main = async () => {
  const { provider, getNamedSigners } = ethers;

  const chainId = Number(await getChainId());
  const { deployer } = await getNamedSigners();

  const network = networks.find((nw) => nw.chainId === chainId) as NetworkType;

  const nftsFactoryV2: NFTsFactoryV2 = new ethers.Contract(
    network.nftsFactoryV2 || "",
    abiINFTsFactory2.concat(abiICloneFactory2),
    provider
  ) as NFTsFactoryV2;

  let nftsResolver: NFTsResolver | undefined;
  if (network.nftsResolver) {
    nftsResolver = new ethers.Contract(network.nftsResolver || "", abiINFTsResolver, provider) as NFTsResolver;
  }

  console.log("chainId      ", chainId);
  console.log("deployer     ", deployer.address);
  console.log("nftsFactoryV2", nftsFactoryV2.address);
  console.log("nftsResolver  ", nftsResolver?.address || "");

  const implsV2 = await addressesV2(nftsFactoryV2);
  console.log(implsV2.length, "implementations NFTsFactoryV2", implsV2);

  let implsRes: string[] = [];
  if (nftsResolver) {
    implsRes = await addressesRes(nftsResolver);
  }
  console.log(implsRes.length, "implementations NFTsResolver", implsRes);

  const toMigrate: string[] = [];
  let i = 0;
  for await (const impl of implsV2) {
    let isERC721andNotRes = false;

    // Not in V2
    if (implsRes.indexOf(impl) == -1) {
      // isERC721andNotRes = true;
      const contract = new ethers.Contract(impl, abiIERC165, deployer);
      try {
        isERC721andNotRes = await (contract as IERC165).supportsInterface("0x80ac58cd");
      } catch (e) {
        console.error(impl, e);
      }
    }
    if (isERC721andNotRes) {
      console.log(String(++i), impl);
      toMigrate.push(impl);
    }
    if (i >= 70) break;
  }
  const n = toMigrate.length;

  if (nftsResolver && n > 0) {
    console.log(n, "implementations to migrate from V2 to NFTsResolver", toMigrate);
    console.log((await nftsResolver.connect(deployer).estimateGas.addAddresses(toMigrate)).toString());

    const go: string = prompt("Proceed with Migration y/N ? ");
    if (go[0].toLowerCase() == "y") {
      console.log("START Migration...");
      await (await nftsResolver.connect(deployer).addAddresses(toMigrate, { gasLimit: 2_000_000 })).wait();
      console.log("END   Migration !");

      const implResNew = await addressesRes(nftsResolver);
      console.log(implResNew.length, "implementations NFTsResolver", implResNew);
    }
  } else {
    console.log("Nothing to migrate from V2 to NFTsResolver");
  }
};

main().catch(console.error);
