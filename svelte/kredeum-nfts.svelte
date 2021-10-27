<script lang="ts">
  import type { Signer } from "ethers";
  import type { Collection } from "../lib/kconfig";
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumSelectCollection from "./kredeum-select-collection.svelte";
  import KredeumListNfts from "./kredeum-list-nfts.svelte";
  import KredeumCreateNft from "./kredeum-create-nft.svelte";
  import KredeumCreateCollection from "./kredeum-create-collection.svelte";

  let collection: Collection;
  let address: string;
  let chainId: number;
  let signer: Signer;
</script>

<nav role="navigation">
  <div class="logo"><img src="assets/images/logo-kredeum.svg" alt="Logo Kredeum" /></div>

  <div class="menu">
    <input id="burger" type="checkbox" />

    <label for="burger">
      <span></span>
      <span></span>
      <span></span>
    </label>

    <div class="nav">
      <ul>
        <li class="active"><a href="."><i class="fas fa-columns"></i></a></li>
        <li><a href="."><i class="fas fa-cog"></i></a></li>
        <li><a href="."><i class="fas fa-user"></i></a></li>
        <li><a href="."><i class="fas fa-bell"></i></a></li>
      </ul>
    </div>
  </div>
</nav>

<main role="main">
  <div id="kredeum-list">
    <section class="content">
      <header>
        <div class="row aligncenter">
          <div class="col col-xs-12 col-sm-3">
            <h1>My NFT wallet</h1>
          </div>

          <div class="col col-sm-6">
            <KredeumSelectCollection bind:address bind:chainId bind:collection />
          </div>

          <div class="col col-sm-3 txtright">
            <a href="#create" class="btn btn-light" title="Create"
              ><i class="fas fa-plus"></i><span class="hidden-xs">Create</span></a
            >
          </div>
        </div>
      </header>

      <div class="table">
        <div class="row">
          <div class="col col-xs-12 col-md-3 col-filters">
            <!-- <span class="label">Filter</span> -->
            <div class="box">
              <Metamask autoconnect="off" bind:address bind:chainId bind:signer />

              <div class="box-section">
                <span class="label label-big">Cache</span>
                <div>
                  <a href="." on:click="{() => localStorage.clear()}">clear</a>
                </div>
              </div>
            </div>
          </div>

          <div class="col col-xs-12 col-md-9">
            <KredeumListNfts bind:collection bind:address bind:chainId />
          </div>
        </div>
      </div>
    </section>
  </div>
</main>

<footer></footer>

<!-- Modal create -->
<div id="create" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

      <div class="modal-body">
        <div class="titre">
          <i class="fas fa-plus fa-left c-green"></i>What do you want to do ?
        </div>

        <div class="txtcenter">
          <a href="#create-nft" class="btn btn-default" title="Create NFT">Mint NFT</a>
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
