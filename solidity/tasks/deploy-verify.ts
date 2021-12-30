import { task } from "hardhat/config";
import * as paramType from "hardhat/internal/core/params/argumentTypes";

function pause(duration: number): Promise<void> {
  return new Promise((res) => setTimeout(res, duration * 1000));
}

task("deploy-verify", "Deploy and verify contracts")
  .addOptionalParam(
    "tags",
    "Specify which deploy script to execute via tags, separated by commas",
    undefined,
    paramType.string
  )
  .addOptionalParam("sec", "Pause duration between deploy and verify", 30, paramType.int)
  .setAction(async (taskArgs: { tags: string; sec: number }, hre) => {
    await hre.run("deploy", taskArgs);

    console.log(`Waiting ${taskArgs.sec} seconds for etherscan to be ready...`);
    await pause(taskArgs.sec);

    await hre.run("etherscan-verify");
  });
