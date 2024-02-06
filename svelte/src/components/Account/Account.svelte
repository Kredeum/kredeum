<script lang="ts">
  import { ens } from "@common/common/ens-get";
  import { getShortAddress, blockscanUrl } from "@common/common/config";

  import CopyRefItem from "../Global/CopyRefItem.svelte";

  /////////////////////////////////////////////////
  // <Account {account} {txt} />
  // Display Account
  /////////////////////////////////////////////////
  export let account: string;
  export let txt = false;
  export let label = true;

  let accountName: string = "";
  let accountAvatar: string = "";

  $: account && handleAccount();
  const handleAccount = async (): Promise<void> => {
    accountName = account;
    accountName = await ens.getName(account);
    accountAvatar = await ens.getAvatar(accountName);

    // console.log("address name avatar =>", account, accountName, accountAvatar);
  };
</script>

{#if txt}
  {#if label}Address{/if}
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

  <div class="col col-xs-12 col-sm-3">
    <div class="btn btn-light">
      <div class="account">
        {#if accountAvatar}
          <img src={accountAvatar} width="30px" alt="avatar" /> &nbsp;&nbsp;
        {/if}
        <span>
          {getShortAddress(accountName, 10)}&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
  </div>
{/if}

<style>
  .account {
    display: flex;
    align-items: center;
  }
  .account img {
    border-radius: 50%;
  }
</style>
