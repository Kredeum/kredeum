<script lang="ts">
  import { ensGetName } from "@lib/common/ens-get";
  export let account: string;
  export const accountName: string = undefined;
</script>

{#await ensGetName(account)}
  {account}
{:then accountName}
  {accountName}
{/await}
