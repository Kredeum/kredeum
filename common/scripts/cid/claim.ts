import { ethers, deployments, network } from "hardhat";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

import { OpenMulti } from "@soltypes/dev/OpenMulti";
import { BigNumber } from "ethers";

const ten = BigNumber.from(10);
const gwei = ten.pow(9);

const main = async (): Promise<string> => {
  const admin: SignerWithAddress = await ethers.getNamedSigner("admin");

  if (network.name === "hardhat") {
    await deployments.fixture("OpenMulti");
  }
  const openMulti: OpenMulti = await ethers.getContract("OpenMulti", admin);
  console.log(`OpenMulti contract ${openMulti.address}@${network.name}`);

  // console.log(openMulti?.interface.format(ethers.utils.FormatTypes.full));

  console.log(
    await openMulti.functions.tokenURI(1, {
      type: 2,
      maxPriorityFeePerGas: gwei.mul(10),
      maxFeePerGas: gwei.mul(50),
      gasLimit: ten.pow(7)
    })
  );
  // console.log(await openMulti.tokenURI(87586))

  // const tx = await openMulti.claim(1, {
  //   type: 2,
  //   maxPriorityFeePerGas: gwei.mul(2),
  //   maxFeePerGas: gwei.mul(50),
  // });
  // console.log(tx);
  // console.log(await tx.wait());

  return "END";
};

main().then(console.log).catch(console.error);
