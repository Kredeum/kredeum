<script type="text/javascript">
  import KredeumNfts from "./kredeum-nfts.svelte";

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
  <KredeumNfts />
</main>

<footer></footer>
