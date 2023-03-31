import { ethers, deployments, network } from "hardhat";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

import { OpenMulti } from "@soltypes/src/dev/OpenMulti";

const ten = 10n;
const gwei = ten ** 9n;

const main = async (): Promise<string> => {
  const admin: SignerWithAddress = await ethers.getNamedSigner("admin");

  if (network.name === "hardhat") {
    await deployments.fixture("OpenMulti");
  }
  const openMulti: OpenMulti = await ethers.getContract("OpenMulti", admin);
  console.log(`OpenMulti contract ${openMulti.address}@${network.name}`);

  // console.log(openMulti?.interface.format(FormatTypes.full));

  console.log(
    await openMulti.functions.tokenURI(1, {
      type: 2,
      maxPriorityFeePerGas: gwei * 10n,
      maxFeePerGas: gwei * 50n,
      gasLimit: ten ** 7n
    })
  );
  // console.log(await openMulti.tokenURI(87586))

  // const tx = await openMulti.claim(1, {
  //   type: 2,
  //   maxPriorityFeePerGas: gwei * 2,
  //   maxFeePerGas: gwei * 50,
  // });
  // console.log(tx);
  // console.log(await tx.wait());

  return "END";
};

main().then(console.log).catch(console.error);
