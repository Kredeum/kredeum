<script lang="ts">
    import { clickOutside } from "@helpers/clickOutside";
  
    /////////////////////////////////////////////////
    // <InputStorageChoice bind:storageDefault />
    // Choose decentralized storage
    /////////////////////////////////////////////////
    export let storageDefault = '';

    let open = false;
  
    const handleToggleOpen = () => (open = !open);
    
    const setStorageChoice = (storageChoice) => (storageDefault = storageChoice);
</script>
  
    <div
      class="select-wrapper select-network"
      use:clickOutside={() => (open = false)}
      on:click={handleToggleOpen}
      on:keydown={handleToggleOpen}
    >
      <div class="select" class:open>
        <div class="select-trigger">
          <span>{storageDefault}</span>
        </div>
  
        <div class="custom-options">
            <span
              class="custom-option {'ipfs' == storageDefault && 'selected'}"
              on:click={() => setStorageChoice('ipfs')}
              on:keydown={() => setStorageChoice('ipfs')}
            >
              IPFS
            </span>

            <span
              class="custom-option {'swarm' == storageDefault && 'selected'}"
              on:click={() => setStorageChoice('swarm')}
              on:keydown={() => setStorageChoice('swarm')}
            >
              Swarm
            </span>
          <!-- {#each networksFilter() as nwk}
            <span
              class="custom-option {nwk.chainId == chainId && 'selected'}"
              on:click={(evt) => _switchChain(nwk.chainId, evt)}
              on:keydown={(evt) => _switchChain(nwk.chainId, evt)}
            >
              <Network chainId={nwk.chainId} pre={true} />
            </span>
          {/each} -->
        </div>
      </div>
    </div>
  

    <style>
        .select-trigger {
            border: 1px solid #eaeff8;
        }
    </style>