import "viem/window";
import {
  type Address,
  type WalletClient,
  type EIP1193Provider,
  type PublicClient,
  type Transport,
  type Chain,
  type WalletClientConfig,
  // createPublicClient,
  createWalletClient,
  custom
} from "viem";

import chains from "./chains";

///////////////////////////////////////////////////////////////////////////////////////////////////
// WRITE : onchain write functions via rpc, i.e. functions with walletClient
///////////////////////////////////////////////////////////////////////////////////////////////////

const send = (() => {
  const _windowEthereum = (): EIP1193Provider => {
    if (!window?.ethereum) throw new Error("windowEthereum: Install Web3 extension like Rabby or Metamask");

    return window.ethereum;
  };

  const _transportEthereum = (): WalletClientConfig<Transport, Chain | undefined> => {
    return { transport: custom(_windowEthereum()) };
  };

  const _walletClient = (): WalletClient => createWalletClient(_transportEthereum());
  // const _publicClient = (): PublicClient => createPublicClient(_transportEthereum());

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

  const getWalletClient = async (chainId: number): Promise<WalletClient> => {
    // console.info('getWalletClient ~ chainId:', chainId);
    const getWalletChainId = await getWalletChainId();

    if (chainId !== getWalletChainId) await switchWalletChain(chainId);

    return _walletClients.get(chainId) || _walletClientCreate(chainId);
  };

  const getWallet = async (chainId: number): Promise<[PublicClient, WalletClient, Address]> => {
    const publicClient = callPublicClient(chainId);
    const walletClient = await getWalletClient(chainId);
    const walletAddress = await getWalletAddress(true);

    return [publicClient, walletClient, walletAddress] as [PublicClient, WalletClient, Address];
  };

  const getWalletAddress = async (force = false, n = 0): Promise<Address> => {
    return force ? (await _walletClient().requestAddresses())[n] : (await _walletClient().getAddresses())[n];
  };

  const getWalletChainId = async (): Promise<number> => await _walletClient().getChainId();

  const switchWalletChain = async (chainId: number): Promise<void> =>
    await _walletClient().switchChain({ id: chainId });

  return { getWallet, getWalletClient, getWalletAddress, getWalletChainId, switchWalletChain };
})();

export default send;
