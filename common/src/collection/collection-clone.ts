import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { ADDRESS_ZERO, explorerTxLog } from "../common/config";
import { factoryGetContract } from "../common/factory-get";
import { resolverGetCount } from "../resolver/resolver-get";
import { Address, Log, decodeEventLog, encodeAbiParameters, parseAbiParameters, parseEventLogs } from "viem";

async function* collectionClone(
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  mintPrice: bigint = 0n,
  royaltyReceiver: Address = ADDRESS_ZERO,
  royaltyFee = 0n,
  minimum = false
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log(`collectionClone ${chainId} ${name} ${symbol} ${templateConfig}`);
  // console.log(`collectionClone ${String(mintPrice)} ${royaltyReceiver} ${royaltyFee} ${String(minimum)}`);

  const nftsFactoryV3 = await factoryGetContract(chainId, true);

  let n = 0;
  if (!(name && symbol)) n = (await resolverGetCount(chainId)) + 1;
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFT#${n}`;

  const [template, conf] = templateConfig.split("/");
  // console.log("template name", template);
  // console.log("template conf", conf);
  let options: boolean[];
  let optionsBytes = "";

  if (template == "OpenNFTsV4") {
    options = [conf == "generic"];
    optionsBytes = encodeAbiParameters(parseAbiParameters("uint256, address, uint96, bool[]"), [
      0n,
      ADDRESS_ZERO,
      0n,
      options
    ]);
  } else if (template == "OpenAutoMarket") {
    options = [conf == "generic", minimum];
    // console.log("options", options);
    optionsBytes = encodeAbiParameters(parseAbiParameters("uint256, address, uint96, bool[]"), [
      mintPrice,
      royaltyReceiver,
      royaltyFee,
      options
    ]);
  } else {
    console.error("ERROR unknown template", template);
  }
  // console.log("collectionCloneResponse nftsFactoryV3.clone", _name, _symbol, template, optionsBytes);
  const txResp = await nftsFactoryV3["clone(string,string,string,bytes)"](_name, _symbol, template, optionsBytes);

  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

const collectionCloneAddress = (txReceipt: TransactionReceipt): Address => {
  // console.log("collectionCloneAddress ~ txReceipt", txReceipt);
  if (!txReceipt.logs) throw new Error("collectionCloneAddress: ERROR no logs");

  const abi = ["event Clone(string indexed templateName, address indexed clone, string indexed name, string symbol)"];

  // const iface = new utils.Interface(abi);
  // const eventTopic = iface.getEventTopic("Clone");
  // const logs = txReceipt.logs.filter((_log) => _log.topics[0] == eventTopic);

  // if (logs.length == 0) {
  //   console.error("ERROR no topics", txReceipt);
  // } else {
  //   const log = iface.parseLog(logs[0]);
  //   clone = log.args[1] as string;
  // }

  const logs = parseEventLogs({
    abi: abi,
    eventName: "Clone",
    // TODO: `as unknown as Log[]` to remove when txReceipt from viem
    logs: txReceipt.logs as unknown as Log[]
  });

  if (logs.length == 0) {
    console.error("collectionCloneAddress: ERROR no topics", txReceipt);
    throw new Error("collectionCloneAddress: ERROR no topics");
  }
  const topics = decodeEventLog({ abi, data: logs[0].data, topics: logs[0].topics });
  if (!topics.args) throw new Error("collectionCloneAddress: ERROR no args");

  const clone = topics.args[0] as Address;

  console.log("collectionCloneAddress", clone);
  return clone;
};

export { collectionClone, collectionCloneAddress };
