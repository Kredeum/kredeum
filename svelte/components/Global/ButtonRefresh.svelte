<script lang="ts">
  import type { Writable } from "svelte/store";
  import { getContext } from "svelte";

  /////////////////////////////////////////////////
  // <ButtonRefresh {refresh} />
  // 1/ Refresh Collections and NFTs when clecked
  // 2/ Active when refresh
  /////////////////////////////////////////////////
  export let refresh: boolean = false;
  /////////////////////////////////////////////////

  let refreshAll: Writable<number> = getContext("refreshAll");
  const toRefresh = () => ($refreshAll += 1);
</script>

<button class="clear" on:click={toRefresh} title="      {refresh ? 'Refreshing datas...' : 'Click to Refresh datas'}">
  <i class="fas fa-redo-alt {refresh ? 'refresh' : ''}" />
</button>
