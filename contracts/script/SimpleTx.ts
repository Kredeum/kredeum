import { JsonRpcProvider, Wallet, Contract, ContractTransactionResponse } from "ethers";

const rpcUrl = process.env.ETH_RPC_URL || "";
const privateKey = process.env.PKEY || "";

const chainId = 137;
const address = "0x4f1AC217A0D3515e0FD174B2a65ea431af30D212";
const tokenID = 16n;

const abi = [
  "function setTokenPrice(uint256,uint256)", //
  "function getTokenPrice(uint256) view returns (uint256)"
];

const main = async () => {
  console.log(chainId, address, tokenID);

  const provider = new JsonRpcProvider(rpcUrl);
  const signer = new Wallet(privateKey, provider);

  const contract = new Contract(address, abi, signer);
  let price = (await contract.getTokenPrice(tokenID)) as bigint;
  console.log("price 1", price);

  try {
    console.log("setTokenPrice try");
    await contract.setTokenPrice(tokenID, price + 1n, {
      maxFeePerGas: 100_000_000_000, //
      maxPriorityFeePerGas: 100_000_000_000
    });
  } catch (e) {
    console.error(e);
  }
  price = (await contract.getTokenPrice(tokenID)) as bigint;
  console.log("price 2", price);
};

main().catch(console.error);
