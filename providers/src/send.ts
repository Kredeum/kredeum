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
import { chainGet } from "./chains";

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

const _walletClientCreate = (bzzChainId?: number): WalletClient => {
  const transportPlusOptionalChain: WalletClientConfig<Transport, Chain> = _transportEthereum();
  let walletClient: WalletClient;

  if (bzzChainId) {
    const chain = chainGet(bzzChainId);
    if (chain) transportPlusOptionalChain.chain = chain;
    walletClient = createWalletClient(transportPlusOptionalChain);

    _walletClients.set(bzzChainId, walletClient);
  } else {
    walletClient = _walletClient();
  }

  return walletClient;
};

const sendWalletClient = async (bzzChainId: number): Promise<WalletClient> => {
  // console.info('sendWalletClient ~ bzzChainId:', bzzChainId);
  const walletChainId = await sendWalletChainId();

  if (bzzChainId !== walletChainId) await sendWalletSwitchChain(bzzChainId);

  return _walletClients.get(bzzChainId) || _walletClientCreate(bzzChainId);
};

const sendWallet = async (bzzChainId: number): Promise<[PublicClient, WalletClient, Address]> => {
  const publicClient = callPublicClient(bzzChainId);
  const walletClient = await sendWalletClient(bzzChainId);
  const walletAddress = await sendWalletAddress(true);

  return [publicClient, walletClient, walletAddress] as [PublicClient, WalletClient, Address];
};

const sendWalletAddress = async (force = false, n = 0): Promise<Address> => {
  return force ? (await _walletClient().requestAddresses())[n] : (await _walletClient().getAddresses())[n];
};

const sendWalletChainId = async (): Promise<number> => await _walletClient().getChainId();

const sendWalletSwitchChain = async (bzzChainId: number): Promise<void> =>
  await _walletClient().switchChain({ id: bzzChainId });

export { sendWallet, sendWalletClient, sendWalletAddress, sendWalletChainId, sendWalletSwitchChain };
