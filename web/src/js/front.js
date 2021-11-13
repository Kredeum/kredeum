(function () {
  document.querySelector(".select-wrapper").addEventListener("click", function () {
    this.querySelector(".select").classList.toggle("open");
  });

  for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener("click", function () {
      if (!this.classList.contains("selected")) {
        this.parentNode.querySelector(".custom-option.selected").classList.remove("selected");
        this.classList.add("selected");
        this.closest(".select").querySelector(".select-trigger span").textContent =
          this.textContent;
        this.closest(".select").querySelector(".select-trigger span").className = "";
        this.closest(".select")
          .querySelector(".select-trigger span")
          .classList.add(this.dataset.value);
      }
    });
  }

  window.addEventListener("click", function (e) {
    const select = document.querySelector(".select");
    if (!select.contains(e.target)) {
      select.classList.remove("open");
    }
  });
})();
