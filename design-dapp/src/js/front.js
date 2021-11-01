(function() {
    var accItem = document.getElementsByClassName("table-drop");
    var accHD = document.getElementsByClassName("more");

    for (i = 0; i < accHD.length; i++) {
        accHD[i].addEventListener("click", toggleItem, false);
    }

    function toggleItem() {
        var itemClass = this.parentNode.className;
        var detail = this.parentNode.getElementsByClassName('detail')[0].offsetHeight;
        var heightEl = detail + 70;
        var tableDrop = this.parentNode.getAttribute('id');

        /*for (i = 0; i < accItem.length; i++) {
            accItem[i].className = "table-row table-drop closed";
        }*/

        this.parentNode.className = "table-row table-drop closed";

        if (itemClass == "table-row table-drop closed") {
            this.parentNode.className = "table-row table-drop";
            document.getElementById(tableDrop).style.height = heightEl + "px";
        } else {
            document.getElementById(tableDrop).style.height = "auto";
        }
    }
})();
