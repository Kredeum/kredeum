<script lang="ts">
  import { currentAction } from "main/current";

  const create = () => ($currentAction = "create");
</script>

<span on:click={create} class="btn btn-default" title="Mint"><i class="fas fa-plus fa-left" />Mint</span>
