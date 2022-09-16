import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumber, utils, constants } from "ethers";

import { explorerTxLog } from "@lib/common/kconfig";
import { factoryGetContract } from "@lib/common/kfactory-get";
import { resolverGetCount } from "@lib/resolver/resolver-get";

async function* collectionClone(
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner,
  defaultPrice: BigNumber = BigNumber.from(0),
  receiver: string = constants.AddressZero,
  fee: BigNumber = BigNumber.from(0)
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  console.log(`collectionClone ${chainId} '${templateConfig}' ${await cloner.getAddress()}`);

  const nftsFactoryV3 = await factoryGetContract(chainId, cloner);

  let n = 0;
  if (!(name && symbol)) n = (await resolverGetCount(chainId, cloner.provider)) + 1;
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFT#${n}`;

  const [template, config] = templateConfig.split("/");
  const options: boolean[] = [config == "generic"];
  let optionsBytes = "";

  if (template == "OpenNFTsV4") {
    optionsBytes = utils.defaultAbiCoder.encode(["bool[]"], [options]);
  } else if (template == "OpenAutoMarket") {
    optionsBytes = utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint96", "bool[]"],
      [defaultPrice, receiver, fee, options]
    );
  } else {
    console.error("ERROR unknown template", template);
  }
  // console.log("collectionCloneResponse nftsFactoryV3.clone", _name, _symbol, template, options, optionsBytes);
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
