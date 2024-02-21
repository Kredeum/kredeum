<script lang="ts">
  import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
  import { reconnect, type CreateConfigParameters } from "@wagmi/core";
  import { mainnet, arbitrum, polygon } from "viem/chains";

  // 1. Define constants
  const projectId = "dd8549a003009004ac4a5b2423bf0f1e";

  // 2. Create wagmiConfig
  const metadata = {
    name: "Kredeum Web3Modal",
    description: "Kredeum Web3Modal Test",
    url: "https://app.kredeum.com", // origin must match your domain & subdomain
    icons: ["https://app.kredeum.com/assets/images/logo-kredeum-bl.svg"],
  };

  const chains = [mainnet, arbitrum, polygon] as CreateConfigParameters["chains"];
  const wagmiConfig = defaultWagmiConfig({
    projectId,
    metadata,
    chains,
    enableWalletConnect: false,
    enableInjected: true,
    enableEIP6963: true,
    enableCoinbase: true,
  });
  reconnect(wagmiConfig);

  // 3. Create modal
  createWeb3Modal({ wagmiConfig, projectId });
</script>

<w3m-button balance="hide"></w3m-button>
