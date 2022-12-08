<script lang="ts">
  import { ensGetName } from "@lib/common/ens-get";
  export let account: string;
</script>

{#await ensGetName(account)}
  {account}
{:then accountEns}
  {accountEns}
{/await}
