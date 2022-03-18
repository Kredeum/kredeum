<script lang="ts">
  import { Collection, Nft } from "lib/ktypes";
  import { nftListFromCache } from "lib/knft-list";

  let nfts;
  let nft;

  export let collection: Collection = undefined;
  export let tokenID: Number = undefined;

  nfts = nftListFromCache();
  console.log("nfts", nfts);
  //nft = nfts.filter((nft) => nft.values.tokenID === tokenID);
  nft = new Map([...nfts].filter(([, nftFromCollec]) => nftFromCollec.tokenID === tokenID.toString()))
    .values()
    .next().value;

  console.info("yo" + nft.image);
</script>

<h2 class="m-b-20 return">
  <i class="fa fa-arrow-left fa-left" /><a href="." class="link">Return to collection</a>
</h2>

<div class="row grid-detail-krd">
  <div class="col col-xs-12 col-sm-4 col-md-3">
    <div class="card-krd">
      <div class="media media-photo">
        <a href="#zoom">
          <i class="fas fa-search" />
          <img src={nft.image} alt={nft.name} />
        </a>
      </div>
    </div>
  </div>

  <div class="col col-xs-12 col-sm-8 col-md-9">
    <div class="card-krd">
      <h3>{nft.name} <a class="info-button" href="" target="_blank"><i class="fas fa-info-circle" /></a></h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac felis a sapien lobortis finibus nec vel
        lectus. Integer arcu est, laoreet ut dui ac, cursus suscipit metus.
      </p>

      <ul class="steps">
        <li>
          <div class="flex"><span class="label">Owner</span></div>
          <div class="flex"><strong>{nft.owner}</strong></div>
        </li>
        <li>
          <div class="flex"><span class="label">Token ref</span></div>
          <div class="flex">
            <a class="link" href={nft.nid} target="_blank"><strong>{nft.nid}</strong></a>
          </div>
        </li>
        <li>
          <div class="flex"><span class="label">Token ID</span></div>
          <div class="flex"><strong>#{nft.tokenID}</strong></div>
        </li>
        <li>
          <div class="flex"><span class="label">collection @</span></div>
          <div class="flex"><strong>{nft.collection}</strong></div>
        </li>
        <li>
          <div class="flex"><span class="label">Metadata ipfs cid</span></div>
          <div class="flex">
            <a class="link" href={nft.metadata.ipfs} target="_blank">{nft.metadata.ipfs}</a>
          </div>
        </li>
        <li>
          <div class="flex"><span class="label">Image</span></div>
          <div class="flex">
            <a class="link" href={nft.metadata.image} target="_blank">{nft.metadata.image}</a>
          </div>
        </li>
        <li>
          <div class="flex"><span class="label">Transaction</span></div>
          <div class="flex">
            <a class="link" href={nft.minter} target="_blank">{nft.minter}</a>
          </div>
        </li>
      </ul>

      <div class="p-t-40 p-b-40 grid-buttons">
        <a href="#schortcodes" class="btn btn-small btn-outline" title="Get shortcode"
          ><i class="fa fa-code" /><span>Get shortcode</span></a
        >
        <a href="#gift" class="btn btn-small btn-outline" title="Make a gift"
          ><i class="fa fa-gift" /><span>Make a gift</span></a
        >

        <a href="#" class="btn btn-small btn-sell" title="Sell">Sell</a>
      </div>
    </div>
  </div>
</div>

<!-- Modales of detail view -->
<!-- Modal Zoom -->
<div id="zoom" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
      <div class="modal-body">
        <div class="media media-photo">
          <a href="#zoom"><img src={nft.image} alt={nft.name} /></a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal Shortcodes -->
<div id="schortcodes" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
      <div class="modal-body">
        <div class="titre">
          <i class="fas fa-code fa-left c-green" />
          Shortcodes
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac felis a sapien lobortis finibus nec vel
          lectus.
        </p>

        <ul class="steps">
          <li>
            <div class="flex"><span class="label">Sell direclty on Opensea</span></div>
            <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
          </li>
          <li>
            <div class="flex"><span class="label">Sell direclty on Gamestop</span></div>
            <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
          </li>
          <li>
            <div class="flex"><span class="label">Mint on your front page</span></div>
            <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
          </li>
          <li>
            <div class="flex"><span class="label">Sell directly without market-places</span></div>
            <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- Modal gift -->
<div id="gift" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
      <div class="modal-body">
        <div class="titre">
          <i class="fas fa-gift fa-left c-green" />
          Make a gift
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac felis a sapien lobortis finibus nec vel
          lectus.
        </p>

        <form method="POST" action="" enctype="multipart/form-data">
          <div class="section">
            <div class="form-field">
              <input type="text" id="gift" name="gift" placeholder="Enter the recipient's address" />
            </div>
          </div>
          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
