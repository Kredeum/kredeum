import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { utils } from "ethers";

import { explorerTxLog } from "@lib/common/kconfig";
import { factoryGetContract } from "@lib/common/kfactory-get";
import { resolverGetCount } from "@lib/resolver/resolver-get";

async function* collectionClone(
  chainId: number,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  console.log(`collectionClone ${chainId} '${templateConfig}' ${await cloner.getAddress()}`);

  const nftsFactoryV3 = await factoryGetContract(chainId, cloner);

  let n = 0;
  if (!(name && symbol)) n = (await resolverGetCount(chainId, cloner.provider)) + 1;
  const _name = name || `Open NFTs #${n}`;
  const _symbol = symbol || `NFT#${n}`;

  const [template, config] = templateConfig.split("/");
  const options: boolean[] = [config == "generic"];

  // console.log("collectionCloneResponse nftsFactoryV3.clone", _name, _symbol, template, options);
  const txResp = await nftsFactoryV3.clone(_name, _symbol, template, options);
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

const collectionCloneAddress = (txReceipt: TransactionReceipt): string => {
  let clone = "";

  // console.log("collectionCloneAddress ~ txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = [
      "event Clone(string indexed templateName, address indexed clone, string indexed name, string symbol, bool[] options)"
    ];
    const iface = new utils.Interface(abi);
    const eventTopic = iface.getEventTopic("Clone");
    const logs = txReceipt.logs.filter((_log) => _log.topics[0] == eventTopic);
    const log = iface.parseLog(logs[0]);
    clone = log.args[1] as string;
  }

  // console.log("collectionCloneAddress", clone);
  return clone;
};

export { collectionClone, collectionCloneAddress };
