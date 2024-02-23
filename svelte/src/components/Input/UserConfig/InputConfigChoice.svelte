<script lang="ts">
  import { clickOutside } from "@svelte/helpers/clickOutside";

  export let defaultChoice = "";
  export let choices: string[];
  export let type = "tab";

  let open = false;

  const handleToggleOpen = () => (open = !open);
</script>

{#if type === "tab"}
  <div class="section">
    <div class="box-fields">
      {#each choices as choice}
        <input
          bind:group={defaultChoice}
          class="box-field"
          id="type-{choice}"
          name="storage-type"
          type="radio"
          value={choice}
        />
        <label class="field" for="type-{choice}"><span class="icon icon-{choice}" />{choice}</label>
      {/each}
    </div>
  </div>
{:else}
  <div
    class="select-wrapper select-network"
    use:clickOutside={() => (open = false)}
    on:click={handleToggleOpen}
    on:keydown={handleToggleOpen}
    role="listbox"
    tabindex="0"
  >
    <div class="select" class:open>
      <div class="select-trigger">
        <span>
          <span class="icon icon-{defaultChoice}" />
          {defaultChoice}
        </span>
      </div>

      <div class="custom-options">
        {#each choices as choice}
          <span
            class="custom-option {choice == defaultChoice && 'selected'}"
            on:click={() => (defaultChoice = choice)}
            on:keydown={() => (defaultChoice = choice)}
            role="option"
            tabindex="-1"
            aria-selected={choice == defaultChoice ? "true" : "false"}
          >
            <span class="icon icon-{choice}" />
            {choice}
          </span>
        {/each}
      </div>
    </div>
  </div>
{/if}
