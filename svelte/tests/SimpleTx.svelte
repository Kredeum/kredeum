<script lang="ts">
  import { BrowserProvider, Contract, ContractTransactionResponse, Eip1193Provider, formatEther } from "ethers";

  type WindowEthereumProvider = Window & typeof globalThis & { ethereum: Eip1193Provider };

  const chainId = 137;
  const address = "0x4f1AC217A0D3515e0FD174B2a65ea431af30D212";
  const tokenID = 16n;
  const abi = [
    "function setTokenPrice(uint256,uint256)", //
    "function getTokenPrice(uint256) view returns(uint256)"
  ];

  const _setTokenPrice = async () => {
    console.log("_setTokenPrice", chainId, address, tokenID);

    const browserProvider = new BrowserProvider((window as WindowEthereumProvider).ethereum, "any");
    const signer = await browserProvider.getSigner(0);

    // const hash = "0xee67b6e22005e6bc8b3eddb20465b4a4573a49767bd01f2542339f5bb83f81df";
    // const tx = await browserProvider.getTransaction(hash);
    // console.log("tx", tx);

    const contract = new Contract(address, abi, signer);

    let price: bigint = await contract.getTokenPrice(tokenID);
    console.log("_setTokenPrice price", price);

    try {
      console.log("try setTokenPrice");
      const tx = await contract.setTokenPrice(tokenID, price + 1n);
      console.log("tx", tx);
    } catch (err) {
      console.error(err);
    }
    price = await contract.getTokenPrice(tokenID);
    console.log("_setTokenPrice price", await contract.getTokenPrice(tokenID));
  };
</script>

<button class="btn btn-default" style="margin: 20px;" on:click={_setTokenPrice} on:keypress={_setTokenPrice}>
  Set Token Price
</button>
