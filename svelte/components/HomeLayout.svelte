<script lang="ts">
  import type { Collection } from "lib/ktypes";

  import KredeumSelectCollection from "./CollectionSelect.svelte";
  import KredeumListNfts from "./NftListView.svelte";
  import KredeumCreateCollection from "./CollectionCreateView.svelte";
  import KredeumCreateNft from "./NftMintView.svelte";
  import { onMount } from "svelte";
  import semverSatisfies from "semver/functions/satisfies";

  import { getCreate, config } from "lib/kconfig";
  import { factoryGetAddress } from "lib/kfactory-get";

  import { chainId, owner } from "main/network";

  export let platform = "dapp";

  let collection: Collection;
  let refreshing: boolean;
  let nftsList;
  let label = "";
  let version = "";

  const cacheVersion = (_version: string) => {
    const versionOld = localStorage.getItem("version") || "";
    if (!semverSatisfies(_version, `~${versionOld}`)) {
      console.info(`New version, previously ${versionOld} => cache cleared!`);
      localStorage.clear();
    }
    localStorage.setItem("version", _version);
  };

  onMount(() => {
    version = config.version.latest;
    console.log(`INIT Kredeum NFTs Factory v${version}`);

    label = process.env.GIT_BRANCH === "main" ? "" : `(${process.env.GIT_BRANCH})`;

    cacheVersion(version);
  });
</script>

<div id="kredeum-nfts">
  <nav class="nav-krd">
    <div class="logo">
      <a href="https://www.kredeum.com" target="_blank" alt="Kredeum website" title="Kredeum website"
        ><img src="assets/images/logo-kredeum.svg" alt="Logo Kredeum" /></a
      >
    </div>

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

  <main class="main-krd">
    <div id="kredeum-list">
      <section class="content">
        <header>
          <h1 title="Kredeum NFTs v{config.version.latest} ({process.env.GIT_SHORT})">
            My NFTs Factory {label}
          </h1>
          {#if $owner && getCreate($chainId)}
            <a href="#create" class="btn btn-default" title="Mint"><i class="fas fa-plus fa-left" />Mint</a>
          {/if}

          <div class="row alignbottom">
            <KredeumSelectCollection bind:collection />

            <div class="col col-sm-3">
              {#if $owner && collection && factoryGetAddress($chainId)}
                <button
                  class="clear"
                  on:click={() => nftsList()}
                  title="      {refreshing ? 'Refreshing NFTs...' : 'Refresh NFTs from this Collection'}"
                >
                  <i class="fas fa-redo-alt {refreshing ? 'refresh' : ''}" />
                </button>
              {/if}
            </div>
          </div>
        </header>
        <KredeumListNfts {collection} refreshing bind:nftsList {platform} />
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
            <a href="#add-collection" class="btn btn-second" title="Add a new collection">Add a new collection</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal create NFT -->
  <div id="create-nft" class="modal-window">
    <KredeumCreateNft bind:collection />
  </div>

  <!-- Modal add collection -->
  <div id="add-collection" class="modal-window">
    <KredeumCreateCollection bind:collection />
  </div>
</div>
