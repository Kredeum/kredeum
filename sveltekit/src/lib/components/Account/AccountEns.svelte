<script lang="ts">
  import { ens } from "@kredeum/common/lib/common/ens-get";
  export let account: string;
  export const accountName: string = undefined;
</script>

{#await ens.getName(account)}
  {account}
{:then accountName}
  {accountName}
{/await}
