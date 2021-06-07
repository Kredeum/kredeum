<svelte:options tag="kredeum-nft" />

<script>
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumNftMint from "./kredeum-nft-mint.svelte";
  import OpenNfts from "../lib/open-nfts.mjs";
  import kimages from "../lib/kimages.mjs";

  const ipfsGateway = "https://ipfs.io/ipfs";

  const chainIds = ["0x89", "0x13881", "0x4"];
  let chainId,
    openNfts,
    network,
    openNftsAddress,
    explorer,
    address,
    selected,
    admin = "0x0";

  export let contract = undefined;
  export let all = 2;
  // 0 all NFTs
  // 1 NFTs I created
  // 2 NFTs I own
  // 3 NFTs I created and I own

  let NFTs = new Map();
  let NFTcontracts = [];
  let loadingTokens = false;
  let loadingContracts = false;
  let listBoxContracts = false;

  $: if (chainId > 0) nftInit(contract);

  async function nftInit(_contract) {
    // console.log("nftInit", _contract);

    openNfts = await OpenNfts(chainId, _contract);
    if (openNfts.ok) {
      openNftsAddress = openNfts.getAddress();
      explorer = openNfts.getExplorer();
      admin = openNfts.getAdmin();

      console.log("OpenNfts", openNftsAddress);

      nftListContracts();
      nftListTokens();
    } else {
      console.error(openNfts);
      alert("Wrong network detected");
    }
  }

  async function nftListTokens() {
    loadingTokens = true;
    NFTs = await openNfts.listTokens(address);
    loadingTokens = false;
    console.log("NFTs", NFTs);
  }

  async function nftListContracts() {
    if (openNfts.supportsSubgraph()) {
      listBoxContracts = true;
      loadingContracts = true;
      NFTcontracts = await openNfts.listContracts(address);
      if (NFTcontracts.length === 0) {
        NFTcontracts[0] = await openNfts.getSmartContract();
        all = 0;
      }
      loadingContracts = false;
      console.log("NFTcontracts", NFTcontracts);
    } else {
      console.info("Contract ListBox not supported by this network");
    }
  }

  const sameAddress = (a, b = address) => a && a?.toLowerCase() === b?.toLowerCase();
  const short = (a) => `${a?.substring(0, 6)}...${a?.substring(a?.length - 4, a?.length)}`;

  $: arkaneLinkAssets = () => "https://arkane.market/inventory/MATIC";
  $: arkaneLinkKredeum = () => "https://arkane.market/search?contractName=Kredeum%20NFTs";
  $: arkaneAddress = () => "0x1ac1cA3665b5cd5fDD8bc76f924b76c2a2889D39";
  $: arkaneLinkToken = (tokenId) => `${arkaneLinkAssets()}/${openNftsAddress}/${tokenId?.split(":", 1)[0]}`;

  $: openSeaLink = () => network?.openSeaKredeum;
  $: openSeaLinkToken = (tokenId) => `${network?.openSeaAssets}/${openNftsAddress}/${tokenId?.split(":", 1)[0]}`;
  $: kreLinkToken = (tokenId) =>
    `${explorer}/Contracts/${openNftsAddress}/instance/${tokenId?.split(":", 1)[0]}/metadata`;

  $: kreLink = () => `${explorer}/tokens/${openNftsAddress}/inventory`;
  $: ownerLink = (item) => `${explorer}/address/${item.ownerOf}/tokens`;
  $: minterLink = (item) => `${explorer}/address/${item.metadata?.minter}/tokens`;

  $: show = (item) =>
    all == 0 || ((all & 1) == 1 && sameAddress(item.metadata?.minter)) || ((all & 2) == 2 && sameAddress(item.ownerOf));
</script>

<main>
  <h1>
    <img alt="img" width="80" src="data:image/jpeg;base64,{kimages.klogo_png}" />
    Kredeum NFTs
  </h1>

  <!-- <h3>
    Exchange my NFTs
    <a href="{arkaneLinkKredeum()}" target="_blank">on Arkane Market</a>
    -
    <a href="{openSeaLink()}" target="_blank">on OpenSea</a>
  </h3> -->

  {#if listBoxContracts}
    <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value="{selected}" on:change="{() => nftInit(selected)}">
      {#each NFTcontracts as item}
        <option value="{item.address}">
          {item.totalSupply >= 0
            ? `${item.totalSupply} ${item.symbol || "NFT"}`
            : item.symbol || item.name || "NFT"}@{item.address}
        </option>
      {/each}
    </select>
  {/if}

  <table>
    <tr>
      <td colspan="8">
        <button on:click="{() => (all = 0)}" class="{all == 0 ? 'green' : ''}">All NFTs</button>
        -
        <button on:click="{() => (all = 1)}" class="{all == 1 ? 'green' : ''}">NFTs I created</button>
        -
        <button on:click="{() => (all = 2)}" class="{all == 2 ? 'green' : ''}">NFTs I own</button>
        <hr />
      </td>
    </tr>
    <tr>
      <td>id</td>
      <td width="200">name</td>
      <td>image</td>
      <!-- <td>Arkane Market</td> -->
      <td>OpenSea</td>
      <td>creator</td>
      <td>ipfs</td>
      <td>json</td>
      <td>IMPORT</td>
    </tr>
    <tr><td colspan="8"><hr /></td></tr>
    {#key all && address}
      {#each [...NFTs].sort(([k1], [k2]) => k2 - k1) as [tokenId, item]}
        {#if show(item) == true}
          <tr>
            <td>
              <a href="{kreLinkToken(tokenId)}">
                {short(tokenId)}
              </a>
            </td>

            <td>
              {item.metadata?.name || ""}
            </td>

            <td>
              <img alt="" src="{ipfsGateway}/{item.cid}" height="100" />
            </td>

            <!-- <td>
          {#if item.ownerOf}
            {#if sameAddress(item.ownerOf, arkaneAddress())}
              <a href="{arkaneLinkKredeum()}" target="_blank">
                <button class="buy">BUY NFT</button>
              </a>
            {:else if sameAddress(item.ownerOf)}
              <a href="{arkaneLinkToken(tokenId)}" target="_blank">
                <button class="sell">SELL NFT</button>
              </a>
            {:else}
              <a href="{ownerLink(item)}" target="_blank">
                <button class="grey">OWNER</button>
              </a>
            {/if}
          {/if}
        </td> -->

            <td>
              <a href="{openSeaLinkToken(tokenId)}" target="_blank">
                <button class="grey">OpenSea</button>
              </a>
            </td>

            <td>
              {#if item.metadata?.minter}
                <a href="{minterLink(item)}" target="_blank">
                  {short(item.metadata?.minter)}
                </a>
                {#if sameAddress(item.metadata?.minter)}*{/if}
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
            <td>
              <a href="./upload.php?cid={item.cid}" target="_blank">{short(item.cid)}</a>
            </td>
          </tr>
        {/if}
      {/each}
    {/key}
    {#if loadingTokens}
      <p>Data loadingTokens, please wait ...</p>
      <img alt="img" width="160" src="data:image/jpeg;base64,{kimages.loader_png}" />
    {/if}
    <tr><td colspan="8"><hr /></td></tr>
  </table>

  <small>
    <Metamask autoconnect="off" bind:address bind:chainId chainIds="{chainIds}" />
    <br />
    {#if openNfts} <a href="{kreLink()}" target="_blank">kredeum_nfts@{openNftsAddress}</a> {/if}
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
    font-size: 3em;
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
  button.green {
    background-color: #36d06f;
  }
  button.grey {
    background-color: grey;
  }
</style>
