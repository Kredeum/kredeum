<script lang="ts">
  import config from "@kredeum/config/dist/config.json";
  import { versionGet } from "@kredeum/sveltekit/src/lib/helpers/version";
  import logo from "../Images/logo-kredeum.svg";
  import { networks } from "@kredeum/common/lib/common/networks";

  export let chainId: number;

  $: mainnets = networks.isMainnet(chainId);

  const toggle = () => {
    location.href = `./#/${mainnets ? "sepolia" : "mainnet"}`;
    location.reload();
  };

  const { branch } = versionGet();
</script>

<div class="logo">
  <a href="https://www.kredeum.com" target="_blank" rel="noreferrer" title="Kredeum website">
    <img src={logo} alt="Logo Kredeum" />
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
      {#if branch !== "main"}
        <li class="active">
          <p>
            <a href={config.base}>
              <i class="fas fa-columns" /><br />
              stable<br />
              version
            </a>
          </p>
        </li>
        <li class="active">
          <p>
            <a href="." on:click|preventDefault={toggle}>
              <i class="fas {mainnets ? 'fa-flask' : 'fa-road'}" /><br />
              {@html mainnets ? "testnet" : "mainnet"}<br />
              networks
            </a>
          </p>
        </li>
      {/if}
    </ul>
  </nav>
</div>

<a class="discord-link" href="https://discord.gg/Vz5AyU2Nfx" target="_blank" rel="noreferrer" title="Discord Kredeum"
  ><i class="icon-discord" /></a
>
