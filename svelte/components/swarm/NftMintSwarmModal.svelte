<script lang="ts">
  import type { NftType } from "lib/ktypes";
  import { TransactionResponse } from "@ethersproject/abstract-provider";

  import { textShort, swarmGatewayUrl, explorerTxUrl, explorerNftUrl, nftUrl } from "lib/kconfig";
  import { nftSwarmMintTexts } from "lib/knft-mint";

  export let chainId: number;

  export let image: string;

  export let swarm: string;
  export let swarmJson: string;

  export let minting: number;
  export let mintingTxResp: TransactionResponse;
  export let mintedNft: NftType;
  export let mintingError: string;
</script>

<!-- <div id="kredeum-create-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-plus fa-left c-green" />Mint Swarm NFT
      </div>

      {#if minting}
        <div class="media media-photo">
          <img src={image} alt="nft" />
        </div>

        <ul class="steps process">
          {#if mintedNft}
            <li class="complete">
              <div class="flex">
                <span class="titre"
                  >NFT Minted, congrats!
                  <i class="fas fa-check fa-left c-green" />
                </span>
              </div>
              <div class="flex">
                <a class="link" href={explorerNftUrl(chainId, mintedNft)} target="_blank">{nftUrl(mintedNft, 6)}</a>
              </div>
            </li>
          {:else}
            <li>
              <div class="flex">
                <span class="titre">
                  {#if mintingError}
                    Minting Error
                    <i class="fa fa-times fa-left" />
                  {:else}
                    Minting NFT
                    <i class="fas fa-spinner fa-left c-green refresh" />
                  {/if}
                </span>
              </div>
              <div class="flex">
                <span class="t-light">
                  {#if mintingError}
                    {mintingError}
                  {:else if 1 <= minting && minting <= 5}
                    {nftSwarmMintTexts[minting]}
                  {/if}
                </span>
              </div>
            </li>
          {/if}

          <li class={minting >= 2 ? "complete" : ""}>
            <div class="flex"><span class="label">Swarm Image link</span></div>
            <div class="flex">
              {#if swarm}
                <a class="link" href={swarmGatewayUrl(swarm)} target="_blank">{textShort(swarm, 15)}</a>
              {/if}
            </div>
          </li>
          <li class={minting >= 3 ? "complete" : ""}>
            <div class="flex"><span class="label">Swarm Metadata link</span></div>
            <div class="flex">
              {#if swarmJson}
                <a class="link" href={swarmGatewayUrl(swarmJson)} target="_blank">{textShort(swarmJson, 15)}</a>
              {/if}
            </div>
          </li>
          <li class={minting >= 4 ? "complete" : ""}>
            <div class="flex"><span class="label">Transaction</span></div>
            <div class="flex">
              {#if mintingTxResp}
                <a class="link" href={explorerTxUrl(chainId, mintingTxResp.hash)} target="_blank"
                  >{textShort(mintingTxResp.hash, 15)}</a
                >
              {/if}
            </div>
          </li>
          <li class={minting >= 5 ? "complete" : ""}>
            <div class="flex"><span class="label">Token ID</span></div>
            <div class="flex">
              {#if mintedNft}
                <strong>{mintedNft?.tokenID}</strong>
              {/if}
            </div>
          </li>
        </ul>
      {:else}
        <div class="section">
          <span class="label label-big">NFT file</span>
          <div class="box-file">
            {#if image}
              <div class="media media-photo mt-20">
                <img src={image} alt="nft" />
              </div>
            {:else}
              <input type="file" id="file" name="file" bind:files on:change={fileload} />
            {/if}
          </div>
        </div>
        <div class="section">
          <span class="label label-big">NFT title</span>
          <div class="form-field">
            <input type="text" placeholder="My NFT title" bind:value={nftTitle} id="title-nft" />
          </div>
        </div>

        <div class="section">
          <span class="label label-big">Media type</span>
          <div class="box-fields">
            <input class="box-field" id="create-type-video" name="media-type" type="checkbox" value="Video" disabled />
            <label class="field" for="create-type-video"><i class="fas fa-play" />Video</label>

            <input
              class="box-field"
              id="create-type-picture"
              name="media-type"
              type="checkbox"
              value="Picture"
              checked
            />
            <label class="field" for="create-type-picture"><i class="fas fa-image" />Picture</label>

            <input class="box-field" id="create-type-texte" name="media-type" type="checkbox" value="Text" disabled />
            <label class="field" for="create-type-texte"><i class="fas fa-file-alt" />Text</label>

            <input class="box-field" id="create-type-music" name="media-type" type="checkbox" value="Music" disabled />
            <label class="field" for="create-type-music"><i class="fas fa-music" />Music</label>

            <input class="box-field" id="create-type-web" name="media-type" type="checkbox" value="Web" disabled />
            <label class="field" for="create-type-web"><i class="fas fa-code" />Web</label>
          </div>
        </div>

        <div class="section">
          <span class="label label-big">Add to an existing address ?</span>
          <CollectionList {chainId} bind:address {account} mintable={true} label={false} />
        </div>
        <div class="txtright">
          <button class="btn btn-default btn-sell" on:click={mint}>Mint NFT</button>
        </div>
        {#if mintingError}
          <div class="section">
            <p class="txtright errormsg">
              {mintingError}
            </p>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div> -->
