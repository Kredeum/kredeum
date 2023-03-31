import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import { TransactionResponse, TransactionRequest, JsonRpcProvider } from "ethers";

type TxError = {
  error: string;
};

task("tx", "Prints the detail for the transaction hash")
  .addPositionalParam("hash", "The transaction's hash")
  .setAction(async (taskArgs: { hash: string }, { ethers }) => {
    const provider: JsonRpcProvider = ethers.provider as JsonRpcProvider;
    const receipt = await provider.getTransactionReceipt(taskArgs.hash);
    if (!receipt) return;

    console.log(`
      From: ${receipt.from}
      To: ${receipt.to || ""}
      Status: ${receipt.status === 1 ? "Ok" : "Error"}
      BlockNumber: ${receipt.blockNumber}
      GasUsed: ${receipt.gasUsed.toString()}
      Confirmations: ${await receipt.confirmations()}`);

    if (receipt.status !== 0) return;

    const txResp: TransactionResponse | null = await provider.getTransaction(taskArgs.hash);
    if (!txResp) return;

    try {
      await txResp.wait();
      console.log("NO ERROR");
    } catch (e) {
      try {
        const txReq: TransactionRequest = txResp as TransactionRequest;
        await provider.call(txReq);
      } catch (e: unknown) {
        console.error("\n", (e as TxError).error);
      }
    }
    // also possible with 'npm install eth-revert-reason'
  });
