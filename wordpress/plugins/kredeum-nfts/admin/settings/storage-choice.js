window.onload = (e) => {
    const displayOption = (Element) => {
        document.querySelectorAll(`.kre-${el.value}-storage`).forEach(box => {
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
}