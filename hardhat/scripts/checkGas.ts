import type { HardhatEthersHelpers } from "hardhat-deploy-ethers/types";
import type { DeployResult, DeployOptions, Create2DeployOptions } from "hardhat-deploy/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { Signer } from "ethers";
import { BigNumber, ethers as etrs } from "ethers";
import { exit } from "process";
import Prompt from "prompt-sync";
import readlineSync from "readline-sync";
const prompt = Prompt();

///////////////////////////////////////////
const ethPrice = 3000; //  $
const gasPriceGwei = 20; //  Gwei
///////////////////////////////////////////

let gasPrice: BigNumber;
let gasPriceTotal: number = 0;
const gasPriceDefault = etrs.utils.parseUnits(String(gasPriceGwei), "gwei");

const _checkGasPriceDollar = (gasAmount: number, gasPrice: BigNumber = gasPriceDefault) =>
  etrs.utils.formatUnits(gasPrice.mul(gasAmount).mul(ethPrice), 18);

// Calculate gas cost in $ on this network with this gasPrice (not significant if testnet)
// AND on a default network with default gasPrice (to be used as mainnet estimate)
const _checkGasInit = async (hre: HardhatRuntimeEnvironment, contractName: string): Promise<void> => {
  const gasPriceNetwork = await hre.ethers.provider.getGasPrice();
  gasPrice = hre.network.live ? gasPriceNetwork : gasPriceDefault;
  console.log(contractName, "gasPrice network        gwei", etrs.utils.formatUnits(gasPriceNetwork, "gwei"));
  console.log(contractName, "gasPrice used           gwei", etrs.utils.formatUnits(gasPrice, "gwei"));
  console.log(contractName, "gasPrice used * 21000      $", _checkGasPriceDollar(21000, gasPrice));
};

const _checkGasConsoleLog = (contractName: string, label: string, gasAmount: number) => {
  console.log(contractName, label, "      gas #", String(gasAmount));
  console.log(contractName, label, "    price $", _checkGasPriceDollar(gasAmount, gasPrice));
};

const _checkGasLog = (contractName: string, label?: string, gasAmount?: number, real = false) => {
  if (gasAmount) {
    if (real) {
      _checkGasConsoleLog(contractName, label + " real ", gasAmount);
      gasPriceTotal += gasAmount;
    } else {
      _checkGasConsoleLog(contractName, label + " estim", gasAmount);

      if (prompt(`${contractName} ${label} Return to continue... `) == null) exit(1);
    }
  } else {
    _checkGasConsoleLog(contractName, label || "Total cumul real", gasPriceTotal);
  }
};

const checkGasDeploy = async (
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  deployOptions: Create2DeployOptions
): Promise<DeployResult> => {
  if (!gasPrice) await _checkGasInit(hre, contractName);

  const fetchIf = await hre.deployments.fetchIfDifferent(contractName, deployOptions);
  if (fetchIf.differences) {
    const deployArgs = deployOptions.args as string[];
    // Calculate estimed gas before deployment
    const tx = await (await hre.ethers.getContractFactory(contractName)).getDeployTransaction(...deployArgs);

    const estimatedGas = Number(await hre.ethers.provider.estimateGas(tx));
    _checkGasLog(contractName, "deployment", estimatedGas);
  }

  let deployResult: DeployResult;
  if (deployOptions.salt) {
    const deployDeterministic = await hre.deployments.deterministic(contractName, deployOptions);
    deployResult = await deployDeterministic.deploy();
  } else {
    deployResult = await hre.deployments.deploy(contractName, deployOptions);
  }

  if (fetchIf.differences) {
    _checkGasLog(contractName, "deployment", hre.deployments.getGasUsed(), true);
  }
  return deployResult;
};

const checkGasMethod = async (
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  method: string,
  signer: Signer,
  ...args: any
) => {
  const smartcontract = await hre.ethers.getContract(contractName, signer);

  const estimatedGas = Number(await smartcontract.estimateGas[method](...args));
  _checkGasLog(contractName, method, estimatedGas);

  const tx1 = await smartcontract[method](...args);
  console.log(contractName, method, "tx", tx1.hash);

  const tx2 = await tx1.wait();
  _checkGasLog(contractName, method, Number(tx2.gasUsed), true);
  console.log(contractName, method, "tx status", tx2.status);

  _checkGasLog(contractName);
};

export { checkGasDeploy, checkGasMethod };
