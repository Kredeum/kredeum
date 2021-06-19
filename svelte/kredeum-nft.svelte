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
    openNftsAddress,
    explorer,
    openSea,
    address,
    selected,
    admin = "0x0";

  export let contract = undefined;
  export let all = 2;
  // 0 all NFTs
  // 1 NFTs I created
  // 2 NFTs I own
  // 3 NFTs I created and I own

  let NFTs = [];
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
      openSea = openNfts.getOpenSea();
      admin = openNfts.getAdmin();

      console.log("OpenNfts", openNftsAddress);

      nftListContracts();
      nftListTokens();
    } else {
      console.error(openNfts);
      alert("Wrong network detected");
    }
  }

  $: nftListTokens(all);
  async function nftListTokens(_all) {
    if (openNfts?.ok) {
      loadingTokens = true;
      if (_all == 0) {
        NFTs = await openNfts.listTokens();
      } else {
        NFTs = await openNfts.listTokens(address);
      }
      loadingTokens = false;
      console.log("NFTs", NFTs);
    }
  }

  async function nftListContracts() {
    if (openNfts.supportsSubgraph()) {
      listBoxContracts = true;
      loadingContracts = true;
      NFTcontracts = await openNfts.listContractsFromTheGraph(address);
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

  $: openSeaLinkKredeum = () => openSea?.kredeum;
  $: openSeaLinkToken = (item) => `${openSea?.assets}/${item.contract}/${item.tokenID}`;
  $: kreLinkToken = (item) =>
    `${explorer}/tokens/${item.contract}/instance/${item.tokenID}/metadata`;

  $: kreLink = () => `${explorer}/tokens/${openNftsAddress}/inventory`;
  $: addressLink = (address) => `${explorer}/address/${address}/tokens`;

  $: show = (item) =>
    all == 0 ||
    ((all & 1) == 1 && sameAddress(item.minter)) ||
    ((all & 2) == 2 && sameAddress(item.owner));
</script>

<main>
  <h1>
    <img alt="img" width="80" src="data:image/jpeg;base64,{kimages.klogo_png}" />
    Kredeum NFTs
  </h1>

  {#if listBoxContracts}
    {#if NFTcontracts.length > 1}
      <strong>Choose NFT Collection</strong>
    {:else}
      <strong>Default NFT Collection</strong>
    {/if}
    <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value="{selected}" on:change="{() => nftInit(selected)}">
      {#each NFTcontracts as item}
        <option value="{item.address}">
          {item.totalSupply || ""}
          {item.symbol || "NFT"}@{item.address}
          {item.name ? `- ${item.name}` : ""}
        </option>
      {/each}
    </select>
  {/if}

  <table>
    <tr>
      <td colspan="9">
        <button on:click="{() => (all = 0)}" class="{all == 0 ? 'green' : ''}">All NFTs</button>
        -
        <button on:click="{() => (all = 1)}" class="{all == 1 ? 'green' : ''}"
          >NFTs I created</button
        >
        -
        <button on:click="{() => (all = 2)}" class="{all == 2 ? 'green' : ''}">NFTs I own</button>
        <hr />
      </td>
    </tr>
    <tr>
      <td>tokenID</td>
      <td width="200">description</td>
      <td>image</td>
      <td>OpenSea</td>
      <td>owner</td>
      <td>creator</td>
      <td>ipfs</td>
      <td>json</td>
      <!-- <td>import</td> -->
    </tr>
    <tr><td colspan="8"><hr /></td></tr>
    {#key all && address}
      {#each NFTs as item}
        {#if show(item) == true}
          <tr>
            <td>
              <a href="{kreLinkToken(item)}">
                &nbsp;{item.tokenID}&nbsp;
              </a>
            </td>

            <td>
              <strong>{item.name || ""}</strong><br />
              {(item.name != item.description && item.description) || ""}
            </td>

            <td>
              <img alt="" src="{ipfsGateway}/{item.cid}" height="100" />
            </td>

            <td>
              <a href="{openSeaLinkToken(item)}" target="_blank">
                {#if sameAddress(item.owner)}
                  <button class="green">SELL NFT</button>
                {:else}
                  <button class="blue">BUY NFT</button>
                {/if}
              </a>
            </td>

            <td>
              {#if item.owner}
                <a href="{addressLink(item.owner)}" target="_blank">
                  {short(item.owner)}
                </a>
                {#if sameAddress(item.owner)}*{/if}
              {/if}
            </td>

            <td>
              {#if item.minter}
                <a href="{addressLink(item.minter)}" target="_blank">
                  {short(item.minter)}
                </a>
                {#if sameAddress(item.minter)}*{/if}
              {/if}
            </td>

            <td>
              <a href="{ipfsGateway}/{item.cid}" target="_blank">{short(item.cid)}</a>
            </td>

            <td>
              {#if item.tokenURI}
                <a href="{item.tokenURI}" target="_blank"
                  >{short(item.tokenURI.replace(/^.*ipfs\//, ""))}</a
                >
              {/if}
            </td>
            <!-- <td>
              <a href="./upload.php?cid={item.cid}" target="_blank">{short(item.cid)}</a>
            </td> -->
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
  button.blue {
    background-color: #2a81de;
  }
</style>
