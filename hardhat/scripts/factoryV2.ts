import hre from "hardhat";

import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

const main = async (): Promise<void> => {
  const signer = await hre.ethers.getNamedSigner("deployer");
  const address = await signer.getAddress();
  const chainId = Number(await hre.getChainId());

  console.log(`network ${hre.network.name} ${chainId}\nsigner@${address}`);

  const nftsFactoryV2: NFTsFactoryV2 = await hre.ethers.getContract("NFTsFactoryV2", signer);

  const n = String(await nftsFactoryV2.implementationsCount());
  console.log(`nftsFactoryV2@${nftsFactoryV2.address} ${n}`);

  await nftsFactoryV2.balancesOf(address);
};

main().catch(console.error);
