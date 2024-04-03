import {
  type PublicClient,
  type WalletClient,
  type TransactionRequestLegacy,
  type TransactionReceipt,
  http,
  createPublicClient,
  createWalletClient,
  extractChain,
  parseEther
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  skaleEuropa,
  skaleEuropaTestnet,
  skaleCalypso,
  skaleCalypsoTestnet,
  skaleNebula,
  skaleNebulaTestnet,
  skaleTitan,
  skaleTitanTestnet
} from "viem/chains";

import mineGasForTransaction from "./skale-miner";
import { scaleFaucets } from "./skaleFaucets";

let _sessionPrivateKey: `0x${string}`;

////////////////////////////////////////////////
const chains = [
  skaleEuropa,
  skaleEuropaTestnet,
  skaleCalypso,
  skaleCalypsoTestnet,
  skaleNebula,
  skaleNebulaTestnet,
  skaleTitan,
  skaleTitanTestnet
];
const chainsId = chains.map((chain) => chain.id);
type ChainIdsType = (typeof chainsId)[number];
type ChainType = (typeof chains)[number];

const _getChainFromId = (chainId: number): ChainType => {
  return extractChain({
    chains,
    id: chainId as ChainIdsType
  });
};

const _faucetAddressGet = (chainId: number): `0x${string}` => scaleFaucets[chainId].proofOfWork;
const _faucetThresholdGet = (chainId: number): bigint => parseEther(String(scaleFaucets[chainId].threshold));

const _functionSignatureGet = (chainId: number): `0x${string}` => {
  const functionSignature = chainId === skaleEuropa.id ? "0x6a627842" : "0x0c11dedd";
  return `${functionSignature}000000000000000000000000`;
};
const _rmBytesSymbol = (address: string) => address.replace(/^0x/, "");

////////////////////////////////////////////////
const receiveFunds = async (account: `0x${string}`, chainId: number): Promise<TransactionReceipt | undefined> => {
  try {
    if (!account) throw new Error("No account provided");
    if (!chainsId.includes(chainId as ChainIdsType)) throw new Error("You Must be on a Skale chain");

    const chain = _getChainFromId(chainId);
    const publicClient: PublicClient = createPublicClient({ chain, transport: http() });

    const receiverBalance = await publicClient.getBalance({ address: account });
    if (receiverBalance >= _faucetThresholdGet(chainId)) return;

    if (!_sessionPrivateKey) {
      _sessionPrivateKey = generatePrivateKey();
    }

    const signer = privateKeyToAccount(_sessionPrivateKey);
    const sessionAccount = signer.address;
    // console.info("sessionAccount:", sessionAccount);

    const walletClient: WalletClient = createWalletClient({ account: sessionAccount, chain, transport: http() });
    const nonce = await publicClient.getTransactionCount({ address: sessionAccount });

    let tx: TransactionRequestLegacy = {
      from: sessionAccount,
      to: _faucetAddressGet(chainId),
      data: (_functionSignatureGet(chainId) + _rmBytesSymbol(account)) as `0x${string}`,
      nonce: nonce
    };
    const gas = await publicClient.estimateGas(tx);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { duration, gasPrice } = await mineGasForTransaction(nonce, Number(gas), sessionAccount);
    // console.info("POW duration:", duration);
    tx = { ...tx, gas, gasPrice };
    // console.info("Prepared ~ Legacy Tx:", tx);

    const signedTx = await signer.signTransaction(tx);
    const hash = await walletClient.sendRawTransaction({
      serializedTransaction: signedTx
    });
    console.info("Tx ~ hash: ", `${hash} => ${scaleFaucets[chainId].explorer}/tx/${hash}`);

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash: hash
    });
    console.info("TransactionReceipt:", transactionReceipt);

    return transactionReceipt;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export { receiveFunds };
