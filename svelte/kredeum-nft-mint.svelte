<script>
  import { Mint } from "../lib/open-nfts";
  import NftStorage from "../lib/nft-storage";
  import Metamask from "./kredeum-metamask.svelte";
  import { createEventDispatcher } from "svelte";
  import { getNetwork } from "lib/kconfig";
  const dispatch = createEventDispatcher();
  const ipfsGateway = "https://ipfs.io/ipfs";

  export let key = undefined;
  export let alt = undefined;
  export let src = undefined;
  export let pid = undefined;
  export let contract = undefined;
  export let metadata = undefined;
  export let width = 100;
  export let display = false;
  export let minted = "";

  let minting = false;
  let cidImage;
  let cidJson;

  let signer = "";
  let address = "";
  let network = "";
  let openSea;

  let chainId;
  let chainIdOld;

  // CONTRACT OR NETWORK CHANGE
  $: if (chainId) {
    // console.log("<kredeum-nft-mint/> chainId changed", chainId);
    init();
  }

  async function init() {
    // console.log(`<kredeum-nft-mint/> init ${chainId}`);
    network = getNetwork(chainId);
    if (network) {
      if (!contract && chainId != chainIdOld) {
        // chain changed : force contract to default
        contract = network.openNFTs;
      }

      openSea = network.openSea;
      chainIdOld = chainId;
    }
  }

  async function nftMint() {
    // console.log("<kredeum-nft-mint/> nftMint src alt", src, alt);

    if (signer) {
      minting = true;

      const nftStorage = new NftStorage(key);
      cidImage = await nftStorage.pinUrl(src);
      cidJson = await nftStorage.pinJson({
        name: alt,
        description: alt,
        cid: cidImage,
        image: `${ipfsGateway}/${cidImage}`,
        ipfs: "ipfs://" + cidImage,
        origin: src,
        minter: address,
        metadata: JSON.parse(metadata || {})
      });

      try {
        minted = await Mint(chainId, contract, signer, `${ipfsGateway}/${cidJson}`);
        dispatch("token", { nid: minted.nid });
      } catch (e) {
        console.error("<kredeum-nft-mint/> Minting ERROR", e);
        minted = false;
        minting = false;
      }
    } else {
      alert("You must be connected with Metamask to Mint");
    }
  }
</script>

<main id="kredeum-nft-min">
  IMAGE
  {#if display && src}
    <img src="{src}" alt="{alt}" width="{width}" /><br />
  {/if}

  {#if address}
    {#if minted}
      <a
        href="{`${openSea?.assets}/${minted.contract}/${minted.tokenID}`}"
        class="btn btn-small btn-sell"
        title="Sell">SELL NFT</a
      >

      <!-- </a> -->
    {:else if minting}
      <button id="mint-button" class="minting">MINTING...</button>
    {:else if !network}
      <button id="mint-button" class="switch">No network</button>
    {:else}
      <!-- <a href="#" class="btn btn-small btn-mint" title="Mint">Mint</a> -->

      <button id="mint-button-{pid}" on:click="{nftMint}" class="btn btn-small btn-mint">
        MINT NFT
      </button>
    {/if}

    {#if display}
      <small>
        <br /><a href="{src}">{src}@{alt}</a>

        <br /><a href="{ipfsGateway}/{cidImage}">{cidImage}@ipfs</a>
      </small>
    {/if}
  {:else}
    <small>
      <br /><Metamask autoconnect="off" bind:address bind:chainId bind:signer />
    </small>
  {/if}

  <div class="box-section">
    <span class="label label-big">Statut</span>
    <div class="box-fields">
      <input class="box-field" id="mint" name="statut" type="checkbox" value="Mint" />
      <label class="field" for="mint">Mint</label>

      <input class="box-field" id="inactive" name="statut" type="checkbox" value="Inactive" />
      <label class="field" for="inactive">Inactive</label>

      <input class="box-field" id="sell" name="statut" type="checkbox" value="Sell" />
      <label class="field" for="sell">Sell</label>
    </div>
  </div>
</main>
