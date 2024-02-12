<script lang="ts">
  import type { UserConfig } from "./configTypes";

  import { clickOutside } from "@svelte/helpers/clickOutside";

  export let attributes: UserConfig;
  export let namespace;

  $: attribute = attributes[namespace];
  $: fieldsGroups = attribute.fieldsGroups;
  $: defaultChoice = attribute.default.value;
  $: defaultChoiceDisplay = attribute.fieldsGroups[defaultChoice].display;

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
      <span>{defaultChoiceDisplay || defaultChoice}</span>
    </div>

    <div class="custom-options">
      {#each Object.entries(fieldsGroups) as [key, choice]}
        <span
          role="button"
          tabindex="0"
          class="custom-option {key == defaultChoice && 'selected'}"
          on:click={() => (attributes[namespace].default.value = key)}
          on:keydown={() => (attributes[namespace].default.value = key)}
        >
          {choice.display || key}
        </span>
      {/each}
    </div>
  </div>
</div>
