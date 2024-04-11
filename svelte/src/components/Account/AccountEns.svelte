<script lang="ts">
  import { type Address } from "viem";
  import { ens } from "@kredeum/common/src/common/ens-get";
  export let account: Address;
  export const accountName: string | undefined = undefined;
</script>

{#await ens.getName(account)}
  {account}
{:then accountName}
  {accountName}
{/await}
