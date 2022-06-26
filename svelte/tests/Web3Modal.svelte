<script lang="ts">
  import { ethers } from "ethers";

  import Web3Modal from "web3modal";
  import WalletConnect from "@walletconnect/web3-provider";

  let ethersProvider: ethers.providers.Web3Provider;
  let extProvider: ethers.providers.ExternalProvider;

  let signer: ethers.providers.JsonRpcSigner;
  let address: string;

  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: process.env.INFURA_KEY
      }
    }
  };

  async function connect() {
    const web3Modal = new Web3Modal({
      network: "mumbai", // optional
      cacheProvider: true, // optional
      disableInjectedProvider: false,
      providerOptions // required
    });
    extProvider = await web3Modal.connect();
    ethersProvider = new ethers.providers.Web3Provider(extProvider);

    signer = ethersProvider.getSigner();
    address = await signer.getAddress();
    console.log("address", address);
  }
</script>

<div>
  <button on:click={connect}>Connect</button>
  <p>
    {address}
  </p>
</div>
