<script lang="ts">
    import { StorageConfigType } from "@lib/common/types";

    import { onMount } from "svelte";
    import { clickOutside } from "@helpers/clickOutside";
    import { fade } from "svelte/transition";
    import { storageConfigGet, storageConfigSet } from "@lib/nft/storage/storage";

    import InputStorageChoice from "../Input/InputStorageChoice.svelte";
    import InputSwarmConfig from "../Input/InputSwarmConfig.svelte";

    /////////////////////////////////////////////////
    // <SetStorageConfig />
    // Dapp Modale to set the storage config
    /////////////////////////////////////////////////
    let storageDefault: string;
    let apiEndpoint: string;
    let apiKey: string;
    
    let open = false;

    $: console.log("storageDefault:", storageDefault);
    $: console.log("apiEndpoint:", apiEndpoint);
    $: console.log("apiKey:", apiKey);

    const toggle = () => (open = !open);

    $: storageDefault && setStorageChoice();
    const setStorageChoice = async () => {
        let storageConfig: StorageConfigType = await storageConfigGet();

        apiEndpoint = storageConfig[storageDefault].apiEndpoint;
        apiKey = storageConfig[storageDefault].apiKey;

        storageConfig = {...storageConfig, default: storageDefault}

        storageConfigSet(storageConfig);
    }

    $: apiEndpoint && apiKey && setStorageConfig()
    const setStorageConfig = async () => {
        let storageConfig: StorageConfigType = await storageConfigGet();
        console.log("setStorageConfig ~ setStorageConfig:")

        storageConfig = {...storageConfig, [storageDefault]: {apiEndpoint, apiKey}}

        storageConfigSet(storageConfig);
    }

    const getStorageConfig = () => {
        let storageConfig: StorageConfigType = storageConfigGet();
        console.log("getStorageConfig ~ storageConfig:", storageConfig)

        storageDefault = storageConfig.default;
        apiEndpoint = storageConfig[storageDefault].apiEndpoint;
        apiKey = storageConfig[storageDefault].apiKey

        storageConfigSet(storageConfig);
    }

    onMount(() => {
        getStorageConfig();
    });
</script>

<button class="kre-btn-config" on:click={toggle} on:keydown={toggle}>
    <i class="fas fa-user-cog"></i>
    <p>
        Storage<br>
        config
    </p>
</button>

{#if open}
<!-- Modal Storage config -->
<div class="kre-modal-window" transition:fade>
    <div class="modal-content" use:clickOutside={() => (open = false)} transition:fade>
      <span on:click={toggle} on:keydown={toggle} title="Close" class="btn modal-close"><i class="fa fa-times" /></span>
  
      <div class="modal-body">
        <div class="titre">
          <i class="fas fa-plus fa-left c-green" />Your decentralized settings
        </div>
  
        <div class="txtcenter">
          <InputStorageChoice bind:storageDefault />

          {#if 'ipfs' == storageDefault}
            <p in:fade>IPFS</p>
          {:else if 'swarm' == storageDefault}
            <div in:fade>
                <InputSwarmConfig bind:apiEndpoint bind:apiKey/>
            </div>
          {/if}
        </div>
      </div>
    </div>
</div>
{/if}

<style>
    .kre-btn-config {
        background-color: transparent;
        border: none;
        color: #fff;
        cursor: pointer;
        transition: all 300ms ease-in-out;
    }

    .kre-btn-config:hover {
        color: #3acf6e;
    }

    .modal-content {
        min-height: 360px;
    }
</style>