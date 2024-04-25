<script lang="ts">
  import { networks } from "@kredeum/common/src/common/networks";
</script>

<h1>Stats</h1>

<ul>
  {#each networks.getAllMainnets() as network}
    <li>{network.chainName}</li>
  {/each}
</ul>
