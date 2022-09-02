import type { NFTsFactoryV2 } from "@soltypes/contracts";
import type { OpenNFTsResolver } from "@soltypes/contracts/next";

import networks from "@config/networks.json";
import type { NetworkType } from "@lib/common/ktypes";
import { getExplorer } from "@lib/common/kconfig";
import { resolverFilterCollectionsAddress } from "@lib/resolver/resolver-get-collection";

import abiINFTsFactory2 from "@abis/contracts/interfaces/INFTsFactoryV2.sol/INFTsFactoryV2.json";
import abiICloneFactory2 from "@abis/contracts/interfaces/ICloneFactoryV2.sol/ICloneFactoryV2.json";

import abiIOpenNFTsResolver from "@abis/contracts/next/OpenNFTsResolver.sol/OpenNFTsResolver.json";

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

const addressesRes = async (nftsResolver: OpenNFTsResolver): Promise<string[]> => await nftsResolver.getAddresses();

const main = async () => {
  const { provider, getNamedSigners } = ethers;
  const chainId = Number(await getChainId());
  const { deployer } = await getNamedSigners();
  const network = networks.find((nw) => nw.chainId === chainId) as NetworkType;
  if (!(chainId && network && network.nftsResolver && deployer)) return;

  const nftsFactoryV2: NFTsFactoryV2 = new ethers.Contract(
    network.nftsFactoryV2 || "",
    abiINFTsFactory2.concat(abiICloneFactory2),
    provider
  ) as unknown as NFTsFactoryV2;

  const nftsResolver = new ethers.Contract(
    network.nftsResolver || "",
    abiIOpenNFTsResolver,
    provider
  ) as unknown as OpenNFTsResolver;

  if (!(nftsFactoryV2 && nftsResolver)) return;

  console.log("chainId      ", chainId);
  console.log("deployer     ", deployer.address);
  console.log("nftsFactoryV2", nftsFactoryV2.address);
  console.log("nftsResolver  ", nftsResolver.address || "");

  const implsV2 = await addressesV2(nftsFactoryV2);
  console.log(implsV2.length, "implementations NFTsFactoryV2", implsV2);

  const implsRes = await addressesRes(nftsResolver);
  console.log(implsRes.length, "implementations OpenNFTsResolver", implsRes);

  const implsNotMigrated = implsV2.filter((addr) => !implsRes.includes(addr));
  // console.log(implsNotMigrated.length, "implementations NFTsFactoryV2 not OpenNFTsResolver", implsNotMigrated);

  ////////////////////////////
  const limit = 80;
  const gasLimit = 5_000_000;
  ////////////////////////////

  const implsToMigrate = (await resolverFilterCollectionsAddress(chainId, implsNotMigrated, provider)).slice(0, limit);
  console.log(implsToMigrate.length, "implementations to migrate", implsToMigrate);

  const n = implsToMigrate.length;

  if (n > 0) {
    console.log((await nftsResolver.connect(deployer).estimateGas.addAddresses(implsToMigrate)).toString());

    const go: string = prompt(`Proceed with the Migration of ${n} implementations => y/N ? `);
    if (go[0].toLowerCase() == "y") {
      console.log("STARTING Migration...");
      const tx = await nftsResolver.connect(deployer).addAddresses(implsToMigrate, {
        // maxFeePerGas: 5_000_000_000,
        // maxPriorityFeePerGas: 5_000_000_000,
        gasLimit
      });

      console.log(getExplorer(chainId) + "/tx/" + tx.hash || "");
      await tx.wait();
      console.log("END      Migration !");

      const implResNew = await addressesRes(nftsResolver);
      console.log(implResNew.length, "implementations OpenNFTsResolver", implResNew);
    }
  }
};

main().catch(console.error);
