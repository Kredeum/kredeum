<script lang="ts">
  import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
  import { Web3Modal } from "@web3modal/html";
  import { configureChains, createClient } from "@wagmi/core";
  import { mainnet, arbitrum, polygon, type Chain } from "@wagmi/core/chains";
  import { getAccount, readContract, fetchSigner } from "@wagmi/core";
  import { onDestroy, onMount } from "svelte";

  export let chainId: number;
  export let account: string;

  const chains = [mainnet, arbitrum, polygon];
  const projectId = "dd8549a003009004ac4a5b2423bf0f1e";

  const refresh = () => {
    account = ethereumClient.getAccount().address || "";
    chainId = ethereumClient.getNetwork().chain?.id || 1;
  };

  const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider
  });
  const ethereumClient = new EthereumClient(wagmiClient, chains);
  const web3modal = new Web3Modal({ projectId }, ethereumClient);

  let unsubscribe = () => {};
  onMount(() => {
    refresh();
    unsubscribe = web3modal.subscribeModal(refresh);
  });
  onDestroy(unsubscribe);
</script>

<w3m-core-button icon="hide" />
