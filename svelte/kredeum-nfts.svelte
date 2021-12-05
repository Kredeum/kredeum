<script lang="ts">
  import type { Signer } from "ethers";
  import type { Collection } from "lib/ktypes";
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumListCollection from "./kredeum-list-collections.svelte";
  import KredeumListNfts from "./kredeum-list-nfts.svelte";
  import KredeumCreateNft from "./kredeum-create-nft.svelte";
  import KredeumCreateCollection from "./kredeum-create-collection.svelte";
  import { getCreate, getNftsFactory, nftsUrl } from "lib/kconfig";
  import { explorerCollectionUrl } from "lib/knfts";

  let collection: Collection;
  let address: string;
  let chainId: number;
  let signer: Signer;
  let refreshing: boolean;
  let refreshNFTs;

  const _refreshNFTs = (): void => {
    if (chainId && collection?.address) {
      refreshNFTs(true);
    }
  };
  const _explorerCollectionUrl = (_collectionAddress: string): string => {
    const ret = explorerCollectionUrl(chainId, _collectionAddress);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  const _nftsUrl = (_collectionAddress: string): string => nftsUrl(chainId, _collectionAddress);
</script>

<div id="kredeum-nfts">
  <nav class="nav-krd" role="navigation">
    <div class="logo"><img src="assets/images/logo-kredeum.svg" alt="Logo Kredeum" /></div>

    <div class="menu">
      <input id="burger" type="checkbox" />

      <label for="burger">
        <span />
        <span />
        <span />
      </label>

      <div class="nav">
        <ul>
          <li class="active"><a href="."><i class="fas fa-columns" /></a></li>
        </ul>
      </div>
    </div>

    <a
      class="discord-link"
      href="https://discord.gg/Vz5AyU2Nfx"
      target="_blank"
      alt="Discord Kredeum"
      title="Discord Kredeum"><i class="icon-discord" /></a
    >
  </nav>

  <main class="main-krd" role="main">
    <div id="kredeum-list">
      <section class="content">
        <header>
          <h1>My NFT wallet</h1>
          {#if address && getCreate(chainId)}
            <a href="#create" class="btn btn-default" title="Mint"
              ><i class="fas fa-plus fa-left" />Mint</a
            >
          {/if}

          <div class="row alignbottom">
            <Metamask autoconnect="off" bind:address bind:chainId bind:signer />

            <div class="col col-xs-12 col-sm-3">
              {#if address && getNftsFactory(chainId)}
                <span class="label"
                  >Collection
                  {#if collection}
                    <a
                      class="info-button"
                      href={_explorerCollectionUrl(collection.address)}
                      title="&#009;Collection address (click to view in explorer )&#013;{_nftsUrl(
                        collection.address
                      )}"
                      target="_blank"><i class="fas fa-info-circle" /></a
                    >
                  {/if}
                </span>
                <KredeumListCollection bind:address bind:chainId bind:collection />
              {/if}
            </div>

            <div class="col col-sm-3">
              {#if address && getNftsFactory(chainId)}
                <button class="clear" on:click={_refreshNFTs}>
                  <i class="fas fa-redo-alt {refreshing ? 'refresh' : ''}" />
                </button>
              {/if}
            </div>
          </div>
        </header>

        <KredeumListNfts
          bind:collection
          bind:owner={address}
          bind:chainId
          bind:refreshing
          bind:refreshNFTs
        />
      </section>
    </div>
  </main>

  <!-- Modal create -->
  <div id="create" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="." title="Close" class="modal-close"><i class="fa fa-times" /></a>

        <div class="modal-body">
          <div class="titre">
            <i class="fas fa-plus fa-left c-green" />What do you want to do ?
          </div>

          <div class="txtcenter">
            <a href="#create-nft" class="btn btn-default" title="Mint NFT">Mint NFT</a>
            <span class="or">Or</span>
            <a href="#add-collection" class="btn btn-second" title="Add a new collection"
              >Add a new collection</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal create NFT -->
  <div id="create-nft" class="modal-window">
    <KredeumCreateNft bind:collection bind:address bind:chainId bind:signer />
  </div>

  <!-- Modal add collection -->
  <div id="add-collection" class="modal-window">
    <KredeumCreateCollection bind:collection bind:address bind:chainId bind:signer />
  </div>
</div>
