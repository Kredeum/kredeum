<script lang="ts">
  import { ens } from "@kredeum/common/src/viem/ens-get";
  export let account: string;
  export const accountName: string | undefined = undefined;
</script>

{#await ens.getName(account)}
  {account}
{:then accountName}
  {accountName}
{/await}
