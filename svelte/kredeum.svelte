<script type="text/javascript">
  import KredeumNft from "./kredeum-nft.svelte";

  // (function () {
  //   var accItem = document.getElementsByClassName("table-drop");
  //   var accHD = document.getElementsByClassName("more");

  //   for (i = 0; i < accHD.length; i++) {
  //     accHD[i].addEventListener("click", toggleItem, false);
  //   }

  //   function toggleItem() {
  //     var itemClass = this.parentNode.className;
  //     var detail = this.parentNode.getElementsByClassName("detail")[0].offsetHeight;
  //     var heightEl = detail + 70;
  //     var tableDrop = this.parentNode.getAttribute("id");

  //     /*for (i = 0; i < accItem.length; i++) {
  //                   accItem[i].className = "table-row table-drop closed";
  //               }*/

  //     this.parentNode.className = "table-row table-drop closed";

  //     if (itemClass == "table-row table-drop closed") {
  //       this.parentNode.className = "table-row table-drop";
  //       document.getElementById(tableDrop).style.height = heightEl + "px";
  //     } else {
  //       document.getElementById(tableDrop).style.height = "auto";
  //     }
  //   }
  // })();
</script>

<nav role="navigation">
  <div class="logo"><img src="assets/images/logo-kredeum.svg" alt="Logo Kredeum" /></div>

  <div class="menu">
    <input id="burger" type="checkbox" />

    <label for="burger">
      <span></span>
      <span></span>
      <span></span>
    </label>

    <div class="nav">
      <ul>
        <li class="active">
          <a href="."><i class="fas fa-columns"></i></a>
        </li>
        <li>
          <a href="."><i class="fas fa-cog"></i></a>
        </li>
        <li>
          <a href="."><i class="fas fa-user"></i></a>
        </li>
        <li>
          <a href="."><i class="fas fa-bell"></i></a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<main role="main">
  <KredeumNft />
</main>

<footer></footer>

<!-- Modal create -->
<div id="create" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

      <div class="modal-body">
        <div class="titre">
          <i class="fas fa-plus fa-left c-green"></i>What do you want to do ?
        </div>

        <div class="txtcenter">
          <a href="#create-nft" class="btn btn-default" title="Create NFT">Create NFT</a>
          <span class="or">Or</span>
          <a href="#add-collection" class="btn btn-second" title="Add a new collection"
            >Add a new collection</a
          >
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal create NFT -->
<div id="create-nft" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

      <div class="modal-body">
        <div class="titre"><i class="fas fa-plus fa-left c-green"></i>Create NFT</div>

        <form method="POST" action="" enctype="multipart/form-data">
          <div class="section">
            <div class="box-file"><input type="file" id="file" name="file" /></div>
          </div>

          <div class="section">
            <span class="label label-big">Media type</span>
            <div class="box-fields">
              <input
                class="box-field"
                id="create-type-video"
                name="media-type"
                type="checkbox"
                value="Video"
              />
              <label class="field" for="create-type-video"><i class="fas fa-play"></i>Video</label>

              <input
                class="box-field"
                id="create-type-picture"
                name="media-type"
                type="checkbox"
                value="Picture"
              />
              <label class="field" for="create-type-picture"
                ><i class="fas fa-image"></i>Picture</label
              >

              <input
                class="box-field"
                id="create-type-texte"
                name="media-type"
                type="checkbox"
                value="Texte"
              />
              <label class="field" for="create-type-texte"
                ><i class="fas fa-file-alt"></i>Texte</label
              >

              <input
                class="box-field"
                id="create-type-music"
                name="media-type"
                type="checkbox"
                value="Music"
              />
              <label class="field" for="create-type-music"><i class="fas fa-music"></i>Music</label>

              <input
                class="box-field"
                id="create-type-web"
                name="media-type"
                type="checkbox"
                value="Web"
              />
              <label class="field" for="create-type-web"><i class="fas fa-code"></i>Web</label>
            </div>
          </div>

          <div class="section">
            <span class="label label-big">Add to an existing collection ?</span>
            <div>
              <select class="custom">
                <option selected value="0">Collection 0</option>
                <option value="1">Collection 1</option>
                <option value="2">Collection 2</option>
                <option value="3">Collection 3</option>
              </select>
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit">Add file</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Modal add collection -->
<div id="add-collection" class="modal-window">
  <div>
    <div class="modal-content">
      <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

      <div class="modal-body">
        <div class="titre"><i class="fas fa-plus fa-left c-green"></i>Name your collection</div>

        <form method="POST" action="" enctype="multipart/form-data">
          <div class="section">
            <div class="form-field">
              <input type="text" id="collection" name="collection" placeholder="My collection" />
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
