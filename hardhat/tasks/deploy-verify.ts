import { task, types } from "hardhat/config";

function pause(duration: number): Promise<void> {
  return new Promise((res) => setTimeout(res, duration * 1000));
}

task("deploy-verify", "Deploy and verify contracts")
  .addOptionalParam(
    "tags",
    "Specify which deploy script to execute via tags, separated by commas",
    undefined,
    types.string
  )
  .addFlag("now", "Wait 30 seconds between deploy and verify")
  .setAction(async ({ tags, now }, hre) => {
    await hre.run("deploy", tags);

    if (!now) {
      console.log("Waiting 30 seconds for etherscan to be ready...");
      await pause(30);
    }

    await hre.run("etherscan-verify");
  });
