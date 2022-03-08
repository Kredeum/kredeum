<script lang="ts">
  import { onMount } from "svelte";

  export let template = "Ownable";
  let index = 1;

  const templates = ["Ownable", "Generic", "FixedPrice"];
  const templatesDescription = [
    "Ownable NFT smartcontract, own your collection: only you can Mint NFTs",
    "Generic NFT smartcontract, anyone can Mint NFTs",
    "FixedPrice NFT smartcontract, sell your NFT at a fixed price you decide"
  ];

  let open = false;

  const _setTemplate = (tmpl: string, i: number): void => {
    template = tmpl;
    index = i + 1;
  };

  onMount(async () => {
    window.addEventListener("click", (e: Event): void => {
      if (!document.querySelector(".select-template")?.contains(e.target as HTMLElement)) {
        open = false;
      }
    });
  });
</script>

<div class="select-wrapper select-template" on:click={() => (open = !open)}>
  <div class="select" class:open>
    <div class="select-trigger">
      <span>{template}</span>
    </div>
    <div class="custom-options">
      {#each templates as tmpl, i}
        <span
          class="custom-option {tmpl == template ? 'selected' : ''}"
          data-value={tmpl}
          on:click={() => _setTemplate(tmpl, i)}
        >
          {tmpl}
        </span>
      {/each}
    </div>
  </div>
</div>

<div class="txtcenter">
  <p>
    <i>
      {#if index >= 1}
        {templatesDescription[index - 1]}
      {/if}
    </i>
  </p>
</div>
