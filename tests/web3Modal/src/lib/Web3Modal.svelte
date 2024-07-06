<script lang="ts">
  import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
  import { reconnect, type CreateConfigParameters } from "@wagmi/core";
  import { mainnet, arbitrum, optimism, polygon } from "viem/chains";

  // 1. Define constants
  const projectId = "dd8549a003009004ac4a5b2423bf0f1e";
  const METAMASK_ID = "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96";
  const SAFE_ID = "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f";

  // 2. Create wagmiConfig
  const metadata = {
    name: "Kredeum Web3Modal",
    description: "Kredeum Web3Modal Test",
    url: "https://app.kredeum.com", // origin must match your domain & subdomain
    icons: ["https://app.kredeum.com/assets/images/logo-kredeum-bl.svg"],
  };

  const chains = [mainnet, arbitrum, optimism, polygon] as CreateConfigParameters["chains"];
  const wagmiConfig = defaultWagmiConfig({
    projectId,
    metadata,
    chains,
    enableWalletConnect: true,
    enableInjected: true,
    enableEIP6963: true,
    enableCoinbase: true,
    auth: {
      // email: false,
      socials: [
        // "google",
        //  "github",
        "x",
        "discord",
        // "apple"
      ],
    },
  });
  reconnect(wagmiConfig);

  // 3. Create modal
  createWeb3Modal({
    wagmiConfig,
    projectId,
    // allWallets: "ONLY_MOBILE",
    featuredWalletIds: [
      // METAMASK_ID,
      // SAFE_ID,
    ],
  });
</script>

<w3m-button balance="hide"></w3m-button>
