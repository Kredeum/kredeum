import type { NFTsResolver } from "@soltypes/contracts/next";
import type { NetworkType } from "@lib/ktypes";

import networks from "@config/networks.json";

import abiINFTsResolver from "@abis/contracts/next/NFTsResolver.sol/NFTsResolver.json";

import { ethers, getChainId } from "hardhat";

const main = async () => {
  const { provider, getNamedSigners } = ethers;

  const chainId = Number(await getChainId());
  const { deployer } = await getNamedSigners();

  const network = networks.find((nw) => nw.chainId === chainId) as NetworkType;

  console.log("chainId      ", chainId);
  console.log("deployer     ", deployer.address);

  let nftsResolver: NFTsResolver | undefined;
  if (network.nftsResolver) {
    nftsResolver = new ethers.Contract(network.nftsResolver || "", abiINFTsResolver, provider) as NFTsResolver;

    console.log("nftsResolver  ", nftsResolver?.address || "");

    const implsRes = await nftsResolver.getAddresses();
    console.log(implsRes.length, "implementations NFTsResolver", implsRes);

    const res = await nftsResolver.openResolver("0x981ab0D817710d8FFFC5693383C00D985A3BDa38");
    // const res = await nftsResolver.openResolver("0x0000002000000000001000000030000000000000");
    console.log("main ~ res", res);
  }
};

main().catch(console.error);
