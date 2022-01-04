import type { DeployFunction } from "hardhat-deploy/types";

const deployInterfacesIds: DeployFunction = async function ({ deployments, ethers }) {
  const deployer = await ethers.getNamedSigner("deployer");

  await deployments.deploy("InterfacesIds", {
    from: deployer.address,
    args: [],
    log: true
  });
};
deployInterfacesIds.tags = ["InterfacesIds"];
// eslint-disable-next-line @typescript-eslint/require-await
deployInterfacesIds.skip = async ({ network }) => network.name !== "hardhat";

export default deployInterfacesIds;
