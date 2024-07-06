<script lang="ts">
  import config from "@kredeum/config/dist/config.json";
  import { versionGet } from "../../helpers/version";
  import Logo from "./LogoKredeum.svelte";
  import { networks } from "@kredeum/common/src/common/networks";
  import ConfigModal from "./ConfigModal.svelte";

  ///////////////////////////////////
  // <Navigation {chainid} {back} />
  ///////////////////////////////////
  export let chainId: number | undefined = undefined;
  export let back: string | undefined = undefined;
  ///////////////////////////////////

  const onProd = versionGet().branch === "main";
  $: onMainNet = networks.isMainnet(chainId);

  const toggle = () => {
    location.href = `./#/${onMainNet ? "sepolia" : "mainnet"}`;
    location.reload();
  };
</script>

<div class="logo">
  <a href="https://www.kredeum.com" target="_blank" rel="noreferrer" title="Kredeum website">
    <Logo />
  </a>
</div>

<div class="menu">
  <input id="burger" type="checkbox" />

  <label for="burger">
    <span />
    <span />
    <span />
  </label>

  <nav>
    <ul>
      {#if !onProd}
        <li class="active">
          <p>
            <a href={config.base}>
              <i class="fas fa-columns" /><br />
              stable<br />
              version
            </a>
          </p>
        </li>
      {/if}
      {#if back}
        <li class="active">
          <a href={back}>
            <i class="fa fa-arrow-left"></i><br />
            back
          </a>
        </li>
      {:else}
        <li class="active">
          <p>
            <a href="." on:click|preventDefault={toggle}>
              <i class="fas {onMainNet ? 'fa-flask' : 'fa-road'}" /><br />
              {@html onMainNet ? "testnet" : "mainnet"}<br />
              networks
            </a>
          </p>
        </li>

        <li class="active">
          <ConfigModal />
        </li>

        <!-- experimental   -->
        {#if !onProd}
          <li class="active">
            <a href="/stats">
              <i class="fas fa-database"></i><br />
              stats
            </a>
          </li>
        {/if}
      {/if}
    </ul>
  </nav>
</div>

<a class="discord-link" href="https://discord.gg/Vz5AyU2Nfx" target="_blank" rel="noreferrer" title="Discord Kredeum"
  ><i class="icon-discord" /></a
>
