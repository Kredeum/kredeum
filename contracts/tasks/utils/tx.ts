import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import type {
  TransactionRequest,
  TransactionResponse
} from "@ethersproject/abstract-provider";

type Error = {
  error: string;
}
task("tx", "Prints the detail for the transaction hash")
  .addPositionalParam("hash", "The transaction's hash")
  .setAction(async (taskArgs: { hash: string }, { ethers }) => {
    const receipt = await ethers.provider.getTransactionReceipt(taskArgs.hash);

    console.log(`
From: ${receipt.from}
To: ${receipt.to}
Status: ${receipt.status === 1 ? "Ok" : "Error"}
BlockNumber: ${receipt.blockNumber}
GasUsed: ${receipt.gasUsed.toString()}
Confirmations: ${receipt.confirmations}`);

    if (receipt.status === 0) {
      const txResp: TransactionResponse = await ethers.provider.getTransaction(taskArgs.hash);
      try {
        await txResp.wait();
        console.log("NO ERROR");
      } catch (e) {
        try {
          const txReq: TransactionRequest = txResp as TransactionRequest;
          await ethers.provider.call(txReq, txResp.blockNumber);
        } catch (e: unknown) {
          console.error("\n", (e as Error).error);
        }
      }
    }
    // also possible with 'npm install eth-revert-reason'
  });
