module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { admin } = await getNamedAccounts();

  await deploy("OpenNFTs", {
    from: admin,
    args: [],
    log: true
  });
};
module.exports.tags = ["OpenNFTs"];
