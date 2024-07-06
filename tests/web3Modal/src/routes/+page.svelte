<script lang="ts">
  import Web3Modal from "$lib/Web3Modal.svelte";

  import "viem/window";
  import { zeroAddress, formatEther, createPublicClient, createWalletClient, custom, http, type Address, publicActions } from "viem";
  import { type Chain, mainnet, arbitrum, polygon } from "viem/chains";

  const chains: Chain[] = [mainnet, arbitrum, polygon];
  type ChainType = (typeof chains)[number];
  const chainsMap: Map<number, ChainType> = new Map();
  for (const chain of chains) chainsMap.set(chain.id, chain);

  let chain: Chain = mainnet;
  let address: Address = zeroAddress;
  let chainId: number = 1;
  let balance: bigint = 0n;

  const ethereumProvider = window.ethereum;
  if (ethereumProvider) {
    console.log("ethereumProvider OK");
    const walletClient = createWalletClient({ chain, transport: custom(ethereumProvider) }).extend(publicActions);
    const handleChange = async () => {
      console.log("handleChange");
      const addresses = await walletClient.getAddresses();
      if (!(addresses && addresses.length > 0)) {
        console.error("No addresses");
        return;
      }
      chainId = await walletClient.getChainId();
      chain = chainsMap.get(chainId) || mainnet;

      address = addresses[0];
      console.log("ethereumProvider OK", address);
      balance = await walletClient.getBalance({ address });
    };
    ethereumProvider.on("chainChanged", handleChange);
    ethereumProvider.on("accountsChanged", handleChange);
  }

  // $: address, handleAddressChanged();
</script>

<h1>Tests</h1>

<p>{address} = {formatEther(balance)} ETH on {chain.name}</p>

<Web3Modal />
