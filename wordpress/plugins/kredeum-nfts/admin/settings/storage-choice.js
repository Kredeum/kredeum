window.onload = (e) => {
    const displayOption = (storage) => {
        document.querySelectorAll(`.kre-${storage}-storage`).forEach(box => {
            box.style.display = 'table-row';
        });
    }
    const el = document.querySelector('#_kre_storage_choice');

    displayOption(el.value);

    el.addEventListener('change', (event) => {
        document.querySelectorAll('.kre-storage-option').forEach(box => {
            box.style.display = 'none';
        });
        displayOption(event.target.value);
    });
    
    // Storage options on localstorage
    let settingsForm = document.querySelector(".nfts_page_storage_settings form");
    // console.log("settingsForm:", settingsForm)
    
    settingsForm.addEventListener('submit', (event) => {
       let storageChoice = document.querySelector('#_kre_storage_choice').value;
    //    console.log("settingdForm.addEventListener ~ storageChoice:", storageChoice);
       let storageEndpoint = document.querySelector(`#_kre_${storageChoice}_endpoint`)?.value || "";
    //    console.log("settingdForm.addEventListener ~ storageEndpoint:", storageEndpoint);
       let storageKey = document.querySelector(`#_kre_${storageChoice}_storage_key`)?.value || "";
    //    console.log("//settingdForm.addEventListener ~ storageKey:", storageKey)
       
       const storageOptions = {
        default: storageChoice,
       }
       storageOptions[storageChoice] = {
        apiEndpoint: storageEndpoint,
        apiKey: storageKey
      };
      
      if (typeof localStorage !== "undefined") {
        const storage = JSON.stringify(storageOptions);
        localStorage.setItem("storage", storage);
      }
       
    });
}