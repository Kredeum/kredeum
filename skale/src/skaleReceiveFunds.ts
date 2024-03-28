import {
    type PublicClient,
    type WalletClient,
    http,
    createPublicClient,
    createWalletClient,
    extractChain,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { skaleEuropa, skaleEuropaTestnet, skaleCalypso, skaleCalypsoTestnet, skaleNebula, skaleNebulaTestnet, skaleTitan, skaleTitanTestnet } from "viem/chains";

import mineGasForTransaction from "./skale-miner";
import { scaleFaucets } from "./skaleFaucets";

interface ExtendedTransaction {
    to: `0x${string}`;
    data: `0x${string}`;
    nonce: number;
    gas?: bigint;
    gasPrice?: bigint;
}

let _sessionPrivateKey: `0x${string}`;

const rmBytesSymbol = (address: string) => address.replace(/^0x/, "");

const chains = [skaleEuropa, skaleEuropaTestnet, skaleCalypso, skaleCalypsoTestnet, skaleNebula, skaleNebulaTestnet, skaleTitan, skaleTitanTestnet];
const chainsId = chains.map((chain) => chain.id);
type ChainIdsType = (typeof chainsId)[number];
type ChainType = (typeof chains)[number];

const getChainFromId = (chainId: number): ChainType => {
    return extractChain({
        chains: chains,
        id: chainId as ChainIdsType,
    });

};

const faucetAddressGet = (chainId: number): `0x${string}` => scaleFaucets[chainId];

const functionSignatureGet = (chainId: number): `0x${string}` => {
    const functionSignature = chainId === skaleEuropa.id ? "0x6a627842" : "0x0c11dedd";
    return `${functionSignature}000000000000000000000000`;
};

////////////////////////////////////////////////
const receiveFunds = async (account: string, chainId: number) => {
    try {
        if (!account) throw new Error("No account provided");
        if (!chainsId.includes(chainId as ChainIdsType)) throw new Error("You Must be on a Skale chain");

        if (!_sessionPrivateKey) {
            _sessionPrivateKey = generatePrivateKey();
        }

        const signer = privateKeyToAccount(_sessionPrivateKey);
        const sessionAccount = signer.address;
        console.info("New sessionAccount generated: " + sessionAccount);

        const chain = getChainFromId(chainId);
        console.log("testReceive ~ chain:", chain.name);
        const publicClient: PublicClient = createPublicClient({ chain, transport: http() });
        const walletClient: WalletClient = createWalletClient({ account: sessionAccount, chain, transport: http() });
        console.log("testReceive ~ chainId:", chainId);

        const nonce = await publicClient.getTransactionCount({ address: sessionAccount });
        console.info("sessionAccount ~ nonce:", nonce);

        let tx: ExtendedTransaction = {
            to: faucetAddressGet(chainId),
            data: (functionSignatureGet(chainId) + rmBytesSymbol(account)) as `0x${string}`,
            nonce: nonce
        };

        const gas = await publicClient.estimateGas(tx);
        const { duration, gasPrice } = await mineGasForTransaction(nonce, Number(gas), sessionAccount);
        console.info("POW duration:", duration);

        tx = { ...tx, gas, gasPrice };
        console.info("Prepared ~ Tx:", tx);

        const signedTx = await signer.signTransaction(tx);
        console.info("Signed ~ Tx:", signedTx);

        const hash = await walletClient.sendRawTransaction({
            serializedTransaction: signedTx
        });
        console.log("Tx ~ hash:", hash);

        const transactionReceipt = await publicClient.waitForTransactionReceipt({
            hash: hash,
        });
        console.log("receiveFunds ~ transactionReceipt:", transactionReceipt);

        return transactionReceipt;
    } catch (err) {
        console.error((err as Error).message);
        return;
    }
};

export { receiveFunds };