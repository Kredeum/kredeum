<script>
  import config from "@config/config.json";
  import { versionGet } from "@helpers/version";
  import logo from "../Images/logo-kredeum.svg";

  const { branch } = versionGet();
</script>

<div class="logo">
  <a href="https://www.kredeum.com" target="_blank" rel="noreferrer" alt="Kredeum website" title="Kredeum website"
    ><img src={logo} alt="Logo Kredeum" /></a
  >
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
      <li class="active">
        <a href={branch !== "main" ? config.base : "."}>
          <i class="fas fa-columns" />
          <p>
            Kredeum<br />
            Dapp
          </p>
        </a>
      </li>
    </ul>
  </nav>
</div>

<a
  class="discord-link"
  href="https://discord.gg/Vz5AyU2Nfx"
  target="_blank"
  rel="noreferrer"
  alt="Discord Kredeum"
  title="Discord Kredeum"><i class="icon-discord" /></a
>
