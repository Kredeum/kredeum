<svelte:options tag="kredeum-nft" />

<script>
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumNftMint from "./kredeum-nft-mint.svelte";
  import nft from "../lib/nft.mjs";
  import kimages from "../lib/kimages.mjs";

  const ipfsGateway = "https://ipfs.io/ipfs";

  let address = "";

  const chainIds = ["0x89", "0x13881"];
  let chainId;
  let network;

  export let all = 2;
  // 0 all NFTs
  // 1 NFTs I created
  // 2 NFTs I own
  // 3 NFTs I created and I own

  let NFTs = new Map();
  let loading = false;

  $: if (chainId > 0) nftInit();

  async function nftInit() {
    //console.log("chainId", chainId);
    network = await nft.init(chainId);

    if (network?.KRE) {
      //console.log(network);
      nftList();
    } else {
      alert("Wrong network detected");
    }
  }

  async function nftList() {
    loading = true;
    NFTs = await nft.list();
    loading = false;
    //console.log('NFTs', NFTs);
  }

  const sameAddress = (a, b = address) => a.toLowerCase() === b.toLowerCase();
  const short = (a) => `${a.substring(0, 6)}...${a.substring(a.length - 4, a.length)}`;

  $: arkaneLinkAssets = () => "https://arkane.market/inventory/MATIC";
  $: arkaneLinkKredeum = () => "https://arkane.market/search?contractName=Kredeum%20NFTs";
  $: arkaneAddress = () => "0x1ac1cA3665b5cd5fDD8bc76f924b76c2a2889D39";

  $: openSeaLink = () => `${network?.openSeaKredeum}`;
  $: openSeaLinkToken = (tokenId) => `${network?.openSeaAssets}/${network?.KRE}/${tokenId}`;

  $: kreLink = () => `${network?.explorer}/tokens/${network?.KRE}/inventory`;
  $: ownerLink = (item) => `${network?.explorer}/address/${item.ownerOf}/tokens`;
  $: minterLink = (item) => `${network?.explorer}/address/${item.tokenJson?.minter}/tokens`;

  $: show = (item) =>
    all == 0 ||
    ((all & 1) == 1 && sameAddress(item.tokenJson?.minter)) ||
    ((all & 2) == 2 && sameAddress(item.ownerOf));
</script>

<main>
  <h1>
    <img alt="img" width="160" src="data:image/jpeg;base64,{kimages.klogo_png}" />
    Kredeum NFTs
  </h1>

  <h3>
    Exchange my NFTs
    <a href="{arkaneLinkKredeum()}" target="_blank">on Arkane Market</a>
    -
    <a href="{openSeaLink()}" target="_blank">on OpenSea</a>
  </h3>

  <table>
    <tr>
      <td colspan="8">
        <button on:click="{(e) => (all = 0)}">All NFTs</button>
        -
        <button on:click="{() => (all = 1)}">NFTs I created</button>
        -
        <button on:click="{(e) => (all = 2)}">NFTs I own</button>
        <hr />
      </td>
    </tr>
    <tr>
      <td>id</td>
      <td width="200">name</td>
      <td>image</td>
      <td>Arkane Market</td>
      <td>OpenSea</td>
      <td>creator</td>
      <td>ipfs</td>
      <td>json</td>
    </tr>
    <tr><td colspan="8"><hr /></td></tr>
    {#each [...NFTs].sort(([k1], [k2]) => k2 - k1) as [tokenId, item]}
      {#if show(item)}
        <tr>
          <td>
            {short(tokenId)}
          </td>

          <td>
            {item.tokenJson?.name || ""}
          </td>

          <td>
            <img alt="" src="{ipfsGateway}/{item.cid}" height="100" />
          </td>

          <td>
            {#if item.ownerOf}
              {#if sameAddress(item.ownerOf, arkaneAddress())}
                <a href="{arkaneLinkKredeum()}" target="_blank">
                  <button class="buy">BUY NFT</button>
                </a>
              {:else if sameAddress(item.ownerOf)}
                <a href="{arkaneLinkAssets()}/{network?.KRE}/{tokenId}" target="_blank">
                  <button class="sell">SELL NFT</button>
                </a>
              {:else}
                <a href="{ownerLink(item)}" target="_blank">
                  <button class="grey">OWNER</button>
                </a>
              {/if}
            {/if}
          </td>

          <td>
            <a href="{openSeaLinkToken(tokenId)}" target="_blank">
              <button class="grey">OpenSea</button>
            </a>
          </td>

          <td>
            {#if item.tokenJson?.minter}
              <a href="{minterLink(item)}" target="_blank">
                {short(item.tokenJson?.minter)}
              </a>
              {#if sameAddress(item.tokenJson?.minter)}*{/if}
            {/if}
          </td>

          <td>
            <a href="{ipfsGateway}/{item.cid}" target="_blank">{short(item.cid)}</a>
          </td>

          <td>
            {#if item.tokenURI}
              <a href="{item.tokenURI}" target="_blank">{short(item.tokenURI.replace(/^.*ipfs\//, ""))}</a>
            {/if}
          </td>
        </tr>
      {/if}
    {/each}
    {#if loading}
      <p>Data loading, please wait ...</p>
      <img alt="img" width="160" src="data:image/jpeg;base64,{kimages.loader_png}" />
    {/if}
    <tr><td colspan="8"><hr /></td></tr>
  </table>

  <small>
    <Metamask autoconnect="off" bind:address bind:chainId chainIds="{chainIds}" />
    <br />
    {#if network} <a href="{kreLink()}" target="_blank">kredeum_nfts@{network?.KRE}</a> {/if}
  </small>
</main>

<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  td {
    padding: 10px;
  }
  h1 {
    color: #ff3e00;
    font-size: 4em;
    font-weight: 100;
  }
  img {
    vertical-align: middle;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  button {
    color: white;
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
  }
  button:hover {
    cursor: pointer;
  }
  button.sell {
    background-color: #36d06f;
  }
  button.grey {
    background-color: grey;
  }
</style>
