<script lang="ts">
  import { ensGetName } from "@lib/common/ens-get";
  import { getShortAddress, blockscanUrl } from "@lib/common/config";

  import CopyRefItem from "../Global/CopyRefItem.svelte";

  /////////////////////////////////////////////////
  // <Account {account} {txt} />
  // Display Account
  /////////////////////////////////////////////////
  export let account: string;
  export let txt = false;

  let accountName: string;

  $: account && handleAccount();
  const handleAccount = async (): Promise<void> => {
    accountName = account;
    accountName = await ensGetName(account);
  };
</script>

{#if txt}
  Address
  {accountName}
{:else}
  <span class="label"
    >Address
    <a
      class="info-button"
      href={blockscanUrl(`/address/${account}`)}
      target="_blank"
      rel="noreferrer"
      title="&#009;Owner address (click to view account in explorer )&#013;{accountName}"
      ><i class="fas fa-info-circle" /></a
    >
    <CopyRefItem copyData={account} />
  </span>

  <div class="form-field">
    <input type="text" value={getShortAddress(accountName, 10)} />
  </div>
{/if}
