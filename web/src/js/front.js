(function() {
    var accItem = document.getElementsByClassName("table-drop");
    var accHD = document.getElementsByClassName("more");

    for (i = 0; i < accHD.length; i++) {
        accHD[i].addEventListener("click", toggleItem, false);
    }

    function toggleItem() {
        var itemClass = this.parentNode.className;
        var detail = this.parentNode.getElementsByClassName('detail')[0].offsetHeight;
        if (window.innerWidth > 991) {
            var heightEl = detail + 70;
        } else {
            var heightEl = detail + 120;
        }
        var tableDrop = this.parentNode.getAttribute('id');

        this.parentNode.className = "table-row table-drop closed";

        if (itemClass == "table-row table-drop closed") {
            this.parentNode.className = "table-row table-drop";
            document.getElementById(tableDrop).style.height = heightEl + "px";
        } else {
            document.getElementById(tableDrop).style.height = "auto";
        }
    }

    document.querySelector('.select-wrapper').addEventListener('click', function() {
        this.querySelector('.select').classList.toggle('open');
    })

    for (const option of document.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function() {
            if (!this.classList.contains('selected')) {
                this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                this.classList.add('selected');
                this.closest('.select').querySelector('.select-trigger span').textContent = this.textContent;
                this.closest('.select').querySelector('.select-trigger span').className = "";
                this.closest('.select').querySelector('.select-trigger span').classList.add(this.dataset.value);
            }
        })
    }

    window.addEventListener('click', function(e) {
        const select = document.querySelector('.select')
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    });

})();
