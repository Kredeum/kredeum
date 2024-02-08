<script lang="ts">
  import type { UserConfig } from "./configTypes";

  import { clickOutside } from "@svelte/helpers/clickOutside";

  export let attributes: UserConfig;
  export let namespace;

  $: attribute = attributes[namespace];
  $: defaultChoice = attribute.default;
  $: fieldsGroups = Object.keys(attribute).filter((key) => !key.startsWith("kre_") && key !== "default");

  let open = false;

  const handleToggleOpen = () => (open = !open);
</script>

<div
  role="button"
  tabindex="0"
  class="select-wrapper select-network"
  use:clickOutside={() => (open = false)}
  on:click={handleToggleOpen}
  on:keydown={handleToggleOpen}
>
  <div class="select" class:open>
    <div class="select-trigger">
      <span>{attribute[defaultChoice].kre_display || defaultChoice}</span>
    </div>

    <div class="custom-options">
      {#each fieldsGroups as choice}
        <span
          role="button"
          tabindex="0"
          class="custom-option {choice == defaultChoice && 'selected'}"
          on:click={() => (attributes[namespace].default = choice)}
          on:keydown={() => (attributes[namespace].default = choice)}
        >
          {attribute[choice].kre_display || choice}
        </span>
      {/each}
    </div>
  </div>
</div>
