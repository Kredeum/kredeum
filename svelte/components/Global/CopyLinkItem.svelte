<script lang="ts">
  /////////////////////////////////////////////////
  // <CopyLinkItem {copyData} {displayData}? {position}? />
  //  Display icon copy with data displayed on :hover
  /////////////////////////////////////////////////
  export let copyData: string;
  export let displayData: string = "";
  export let position: string = "0%, -100%";

  $: if (!displayData) displayData = copyData;

  const copyToClipboard = async (data, e): Promise<void> => {
    await navigator.clipboard.writeText(data).catch(() => console.error("Not copied"));
    const evtTarget = e.target as HTMLInputElement;
    evtTarget.closest(".copy-container").classList.add("hide-copy");
    evtTarget.closest(".copy-container").querySelector(".copied-msg").innerHTML = "Copied !";

    setTimeout(() => {
      evtTarget.closest(".copy-container").querySelector(".copied-msg").innerHTML = "";
      evtTarget.closest(".copy-container").classList.remove("hide-copy");
    }, 1000);

    console.log("Copied");
  };
</script>

<div
  class="copy-container"
  data-display={displayData}
  style="--position:{position};"
  on:click|preventDefault={(e) => copyToClipboard(copyData, e)}
>
  <i class="fa fa-clone" aria-hidden="true" />
  <div class="copied-msg" />
</div>

<style>
  .copy-container {
    display: inline-flex;
    position: relative;
    cursor: pointer;
  }

  @media (hover: hover) {
    .copy-container:hover::after {
      content: attr(data-display);
      font-family: Work Sans, Arial, sans-serif;
      font-weight: normal;
      color: rgba(30, 30, 67, 0.6);
      position: absolute;
      top: -5px;
      right: 0;
      padding: 5px 10px;
      border: 1px solid rgba(30, 30, 67, 0.2);
      border-radius: 6px;
      transform: translate(var(--position));
      box-shadow: 0 0 7px rgb(0 0 0 / 7%);
      background-color: white;
      width: max-content;
    }

    :global(.copy-container.hide-copy:hover::after) {
      display: none;
    }
  }

  i {
    width: 20px;
    height: 20px;
    color: rgba(30, 30, 67, 0.4);
  }

  @keyframes copied-anim {
    from {
      opacity: 1;
      top: -40px;
      right: -10px;
    }
    to {
      opacity: 0;
      top: -55px;
      right: -20px;
    }
  }

  .copied-msg {
    position: absolute;
    top: -30px;
    right: 0px;
    opacity: 0;
    animation-name: copied-anim;
    animation-duration: 1s;
    padding: 5px 10px;
    border: 1px solid rgba(30, 30, 67, 0.2);
    border-radius: 6px;
    transform: translateX(80%);
    width: max-content;
    color: rgba(30, 30, 67, 0.4);
    box-shadow: 0 0 7px rgb(0 0 0 / 7%);
    background-color: white;
  }

  .copied-msg:empty {
    display: none;
  }

  :global(.flex .link > a) {
    color: #1e1e43;
  }
</style>
