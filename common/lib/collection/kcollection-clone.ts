import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { utils, constants, BigNumberish } from "ethers";

import { explorerTxLog } from "@lib/common/kconfig";
import { factoryGetContract } from "@lib/common/kfactory-get";
import { resolverGetCount } from "@lib/resolver/resolver-get";

async function* collectionClone(
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner,
  mintPrice: BigNumberish = 0,
  royaltyReceiver: string = constants.AddressZero,
  royaltyFee = 0,
  minimum = false
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  console.log(`collectionClone ${chainId} ${name} ${symbol} ${templateConfig} ${await cloner.getAddress()}`);
  console.log(`collectionClone ${String(mintPrice)} ${royaltyReceiver} ${royaltyFee} ${String(minimum)}`);

  const nftsFactoryV3 = await factoryGetContract(chainId, cloner);

  let n = 0;
  if (!(name && symbol)) n = (await resolverGetCount(chainId, cloner.provider)) + 1;
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFT#${n}`;

  const [template, conf] = templateConfig.split("/");
  // console.log("template name", template);
  // console.log("template conf", conf);
  let options: boolean[];
  let optionsBytes = "";

  if (template == "OpenNFTsV4") {
    options = [conf == "generic"];
    optionsBytes = utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint96", "bool[]"],
      [0, constants.AddressZero, 0, options]
    );
  } else if (template == "OpenAutoMarket") {
    options = [conf == "generic", minimum];
    // console.log("options", options);
    optionsBytes = utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint96", "bool[]"],
      [mintPrice, royaltyReceiver, royaltyFee, options]
    );
  } else {
    console.error("ERROR unknown template", template);
  }
  // console.log("collectionCloneResponse nftsFactoryV3.clone", _name, _symbol, template, optionsBytes);
  const txResp = await nftsFactoryV3["clone(string,string,string,bytes)"](_name, _symbol, template, optionsBytes);

  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

const collectionCloneAddress = (txReceipt: TransactionReceipt): string => {
  let clone = "";

  console.log("collectionCloneAddress ~ txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = ["event Clone(string indexed templateName, address indexed clone, string indexed name, string symbol)"];
    const iface = new utils.Interface(abi);

    const eventTopic = iface.getEventTopic("Clone");
    const logs = txReceipt.logs.filter((_log) => _log.topics[0] == eventTopic);

    if (logs.length == 0) {
      console.error("ERROR no topics", txReceipt);
    } else {
      const log = iface.parseLog(logs[0]);
      clone = log.args[1] as string;
    }
  }

  // console.log("collectionCloneAddress", clone);
  return clone;
};

export { collectionClone, collectionCloneAddress };
