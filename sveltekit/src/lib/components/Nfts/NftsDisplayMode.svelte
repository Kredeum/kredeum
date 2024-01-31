<script lang="ts">
  import { onMount } from "svelte";

  ////////////////////////////////////////////////////////////////////////
  // <NftsDisplayMode {mode} />
  // Select Nfts display mode   gird3 grid4 grid6
  ////////////////////////////////////////////////////////////////////////
  export let mode: string = undefined;

  let modeGrid6: boolean;

  onMount(() => (modeGrid6 = mode === "grid6"));
  ////////////////////////////////////////////////////////////////////////
</script>

<div id="displayMode" class="col col-xs-12 col-sm-5">
  <div class="box-fields">
    <input
      bind:group={mode}
      class="box-field"
      id="display-line-type"
      name="nfts-display-type"
      type="radio"
      value="line"
    />
    <label class="field" for="display-line-type"><i class="fas fa-list" /></label>

    <input
      bind:group={mode}
      class="box-field"
      id="display-grid4-type"
      name="nfts-display-type"
      type="radio"
      value="grid4"
    />
    <label class="field" for="display-grid4-type"><i class="fas fa-th-large" /></label>

    <input
      bind:group={mode}
      class="box-field"
      id="display-grid6-type"
      name="nfts-display-type"
      type="radio"
      value="grid6"
    />
    <label class="field" for="display-grid6-type"><i class="fas fa-th" /></label>
  </div>
</div>

<style>
  #displayMode {
    float: right;
    text-align: right;
    padding: 0;
  }

  #displayMode .box-fields .field i {
    margin: 0;
  }
</style>
