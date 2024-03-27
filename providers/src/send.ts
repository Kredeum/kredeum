import "viem/window";
import {
  createWalletClient,
  type Address,
  type WalletClient,
  type EIP1193Provider,
  custom,
  type PublicClient,
  type Transport,
  type Chain,
  type WalletClientConfig
} from "viem";

import { callPublicClient } from "./call";
import chains from "./chains";

///////////////////////////////////////////////////////////////////////////////////////////////////
// WRITE : onchain write functions via rpc, i.e. functions with walletClient
///////////////////////////////////////////////////////////////////////////////////////////////////

const _windowEthereum = (): EIP1193Provider => {
  if (!window?.ethereum) throw new Error("windowEthereum: Install Web3 extension like Rabby or Metamask");

  return window.ethereum;
};

const _transportEthereum = (): WalletClientConfig<Transport, Chain | undefined> => {
  return { transport: custom(_windowEthereum()) };
};

const _walletClient = (): WalletClient => createWalletClient(_transportEthereum());

// walletClients Map used as cache
const _walletClients: Map<number, WalletClient> = new Map();

const _walletClientCreate = (chainId?: number): WalletClient => {
  const transportPlusOptionalChain: WalletClientConfig<Transport, Chain> = _transportEthereum();
  let walletClient: WalletClient;

  if (chainId) {
    const chain = chains.get(chainId);
    if (chain) transportPlusOptionalChain.chain = chain;
    walletClient = createWalletClient(transportPlusOptionalChain);

    _walletClients.set(chainId, walletClient);
  } else {
    walletClient = _walletClient();
  }

  return walletClient;
};

const sendWalletClient = async (chainId: number): Promise<WalletClient> => {
  // console.info('sendWalletClient ~ chainId:', chainId);
  const walletChainId = await sendWalletChainId();

  if (chainId !== walletChainId) await sendWalletSwitchChain(chainId);

  return _walletClients.get(chainId) || _walletClientCreate(chainId);
};

const sendWallet = async (chainId: number): Promise<[PublicClient, WalletClient, Address]> => {
  const publicClient = callPublicClient(chainId);
  const walletClient = await sendWalletClient(chainId);
  const walletAddress = await sendWalletAddress(true);

  return [publicClient, walletClient, walletAddress] as [PublicClient, WalletClient, Address];
};

const sendWalletAddress = async (force = false, n = 0): Promise<Address> => {
  return force ? (await _walletClient().requestAddresses())[n] : (await _walletClient().getAddresses())[n];
};

const sendWalletChainId = async (): Promise<number> => await _walletClient().getChainId();

const sendWalletSwitchChain = async (chainId: number): Promise<void> =>
  await _walletClient().switchChain({ id: chainId });

export { sendWallet, sendWalletClient, sendWalletAddress, sendWalletChainId, sendWalletSwitchChain };
