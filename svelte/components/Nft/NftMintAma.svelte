<script lang="ts">
  import type { TransactionResponse } from "@ethersproject/abstract-provider";

  import type { NftType } from "lib/ktypes";
  import { nftMintTexts, nftMint1IpfsImage, nftMint2IpfsJson, nftMint3TxResponse, nftMint4 } from "lib/knft-mint";
  import { textShort, ipfsGatewayUrl, explorerTxUrl, explorerNftUrl, nftUrl } from "lib/kconfig";

  import { metamaskSigner } from "main/metamask";
  import cids from "config/ama.json";

  import CollectionList from "../Collection/CollectionList.svelte";

  /////////////////////////////////////////////////
  //  <NftMint {chainId} />
  // Mint NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  /////////////////////////////////////////////////

  let account: string;
  $: $metamaskSigner && handleSigner().catch(console.error);
  const handleSigner = async (): Promise<void> => {
    account = await $metamaskSigner.getAddress();
  };

  let address: string;

  $: $metamaskSigner && chainId && handleChange();
  const handleChange = async () => {
    // Get signer account
    account = await $metamaskSigner.getAddress();
  };

  let nftTitle: string = "";

  let files: FileList;
  let image: string;

  let ipfsImage: string;
  let ipfsJson: string;
  let minting: number;
  let mintingTxResp: TransactionResponse;
  let mintedNft: NftType;
  let mintingError: string;

  const mint = async (): Promise<NftType> => {
    const n = Math.floor(6 * Math.random());
    const ipfsJson = cids[n].json;

    minting = 3;

    mintingTxResp = await nftMint3TxResponse(chainId, address, ipfsJson, $metamaskSigner);
    // console.log("txResp", txResp);

    if (mintingTxResp) {
      minting = 4;

      mintedNft = await nftMint4(chainId, address, mintingTxResp, ipfsJson, account);
      // console.log("mintedNft", mintedNft);

      if (mintedNft) {
        minting = 5;
      } else {
        mintingError = "Problem with sent transaction.";
      }
    } else {
      mintingError = "Problem while sending transaction.";
    }

    if (mintingError) {
      console.error("ERROR", mintingError);
    }

    return mintedNft;
  };
</script>

<div class="btn btn-default" title="Mint NFT" onclick={() => ontimeupdate()}>Mint NFT</div>

{#if minting}
  minting
  {#if mintedNft}
    minted
  {:else if mintingError}
    Minting Error
  {:else}
    Minting NFT
  {/if}
{/if}
