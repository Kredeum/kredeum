<script lang="ts">
  import HomeLayout from "../Global/HomeLayout.svelte";
  import BreadCrumb from "../Global/BreadCrumb.svelte";
  import Nfts from "../Nfts/Nfts.svelte";
  import Nft from "../Nft/Nft.svelte";

  // const chainId = 1;
  // const address = "0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c";
  // const tokenIDs = "23,34,2,123,928,7777";

  const chainId = 137;
  const address = "0x4f1AC217A0D3515e0FD174B2a65ea431af30D212";
  const tokenIDs = "1,2,3";

  // const account = "0x981ab0D817710d8FFFC5693383C00D985A3BDa38";
  const account = undefined;

  let tokenID = "2";
</script>

<HomeLayout>
  <span slot="header">
    <Nfts {chainId} {address} {account} {tokenIDs} bind:tokenID />
  </span>
  <span slot="content">
    <Nft {chainId} {address} {tokenID} {account} />
    <BreadCrumb {chainId} {address} {account} {tokenID} display={true} />
  </span>

</HomeLayout>
