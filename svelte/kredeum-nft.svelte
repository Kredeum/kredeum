<svelte:options tag="kredeum-nft" />

<script>
  import Metamask from "./kredeum-metamask.svelte";
  import KredeumNftMint from "./kredeum-nft-mint.svelte";
  import OpenNfts from "../lib/open-nfts.mjs";
  import kimages from "../lib/kimages.mjs";

  const ipfsGateway = "https://ipfs.io/ipfs";

  const chainIds = ["0x89", "0x13881"];
  let chainId, openNFTs, explorer, openSea, address;

  export let contract = undefined;

  let NFTsListPromise;
  let NFTsContractsPromise = [];

  $: chainId && init();
  $: contract && nftsListTokens();

  async function init() {
    console.log("init", chainId);

    openNFTs = await OpenNfts(chainId);
    if (openNFTs.ok) {
      explorer = openNFTs.configNetwork?.blockExplorerUrls[0];
      openSea = openNFTs.configNetwork?.openSea;

      NFTsContractsPromise = openNFTs.listContracts(address);
      await NFTsContractsPromise;
      contract = openNFTs.currentContract?.address;
    } else {
      console.error(openNFTs);
      alert("Wrong network detected");
    }
  }

  async function nftsListTokens() {
    console.log("nftsListTokens", contract);
    if (openNFTs?.ok) {
      await openNFTs.setContract(contract);
      NFTsListPromise = openNFTs.listTokens(address);
      console.log("nftsListTokens", await NFTsListPromise);
    }
  }

  const sameAddress = (a, b = address) => a && a?.toLowerCase() === b?.toLowerCase();
  const short = (a) => `${a?.substring(0, 6)}...${a?.substring(a?.length - 4, a?.length)}`;

  $: openSeaLinkKredeum = () => openSea?.kredeum;
  $: openSeaLinkToken = (item) => `${openSea?.assets}/${item.contract}/${item.tokenID}`;
  $: kreLinkToken = (item) =>
    `${explorer}/tokens/${item.contract}/instance/${item.tokenID}/metadata`;

  $: kreLink = () => `${explorer}/tokens/${contract}/inventory`;
  $: addressLink = (address) => `${explorer}/address/${address}/tokens`;
</script>

<main>
  <h1>
    <img alt="img" width="80" src="data:image/jpeg;base64,{kimages.klogo_png}" />
    My NFTs
  </h1>

  <h3>
    <div>
      <strong>Collection @{contract || ""}</strong>
    </div>
    {#await NFTsContractsPromise}
      <div>Loading Collections...</div>
    {:then NFTsContracts}
      {#if NFTsContracts.length > 0}
        <select bind:value="{contract}">
          <option value="">Choose another Collection</option>
          {#each NFTsContracts as item}
            <option value="{item.address}">
              {item.totalSupply || " "}
              {item.symbol || "NFT"}@{item.address}
              {item.name ? `- ${item.name}` : " "}
            </option>
          {/each}
        </select>
      {/if}
    {/await}
  </h3>

  <table>
    <tr>
      <td>tokenID</td>
      <td width="200">description</td>
      <td>image</td>
      <td>OpenSea</td>
      <!-- <td>owner</td>
      <td>creator</td>
      <td>ipfs</td>
      <td>json</td>
      <td>import</td> -->
    </tr>

    <tr><td colspan="4"><hr /></td></tr>
    {#key address}
      {#await NFTsListPromise}
        <p>Loading NFT Collection @{short(contract)} ...</p>
        <img alt="img" width="160" src="data:image/jpeg;base64,{kimages.loader_png}" />
      {:then NFTs}
        {#if NFTs && NFTs.length > 0}
          {#each NFTs as item}
            <tr>
              <td>
                <a href="{kreLinkToken(item)}">
                  &nbsp;{item.tokenID}&nbsp;
                </a>
              </td>

              <td>
                <a href="{item.tokenURI}" target="_blank">
                  <strong>{item.name || "___"}</strong>
                </a>
                <br />
                {(item.name != item.description && item.description) || " "}
              </td>

              <td>
                <a href="{ipfsGateway}/{item.cid}" target="_blank">
                  <img alt="___" src="{ipfsGateway}/{item.cid}" height="100" />
                </a>
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

              <!-- <td>
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

              <td>
                <a href="./upload.php?cid={item.cid}" target="_blank">{short(item.cid)}</a>
              </td> -->
            </tr>
          {/each}
        {/if}
      {/await}
    {/key}
    <tr><td colspan="4"><hr /></td></tr>
  </table>

  <small>
    <Metamask autoconnect="off" bind:address bind:chainId chainIds="{chainIds}" />
    <br />
    {#if openNFTs} <a href="{kreLink()}" target="_blank">kredeum_nfts@{contract}</a> {/if}
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
