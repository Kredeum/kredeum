window.onload = (e) => {
  const displayOption = (storage) => {
    document.querySelectorAll(`.kre-${storage}-storage`).forEach((box) => {
      box.style.display = "table-row";
    });
  };
  const el = document.querySelector("#_kre_storage_choice");

  displayOption(el.value);

  el.addEventListener("change", (event) => {
    document.querySelectorAll(".kre-storage-option").forEach((box) => {
      box.style.display = "none";
    });
    displayOption(event.target.value);
  });

  let settingsForm = document.querySelector(".nfts_page_storage_settings form");

  settingsForm.addEventListener("submit", (event) => {
    if (typeof localStorage === "undefined") return;

    const type = document.querySelector("#_kre_storage_choice")?.value?.trim() || "";
    if (!type) return;

    const storage = localStorage.getItem("kredeum.storage") || "{}";
    const storageConfig = JSON.parse(storage) || {};
    storageConfig.default = type;

    const apiEndpoint = document.querySelector(`#_kre_${type}_endpoint`)?.value?.trim();
    const apiKey = document.querySelector(`#_kre_${type}_storage_key`)?.value?.trim();
    if (apiEndpoint || apiKey) {
      const storageFieldsParams = { apiEndpoint: apiEndpoint ? apiEndpoint : undefined, apiKey: apiKey ? apiKey : undefined };
      storageConfig[type] = { ...storageFieldsParams };
    } else delete storageConfig[type];

    localStorage.setItem("kredeum.storage", JSON.stringify(storageConfig));
  });
};
