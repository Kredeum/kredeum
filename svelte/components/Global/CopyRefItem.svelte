<script lang="ts">
  /////////////////////////////////////////////////
  // <CopyRefItem {copyData} />
  //  Display icon to copy reference
  /////////////////////////////////////////////////
  export let copyData: string;
  export let displayData = "";

  $: if (!displayData) displayData = copyData;

  const copyToClipboard = async (data, e): Promise<void> => {
    await navigator.clipboard.writeText(data).catch(() => console.error("Not copied"));
    e.target.classList.add("copied");
    setTimeout(() => {
      e.target.classList.remove("copied");
    }, 1000);
  };
</script>

<i
  class="fa fa-clone copy-ref"
  data-display={displayData}
  on:click|preventDefault={(e) => copyToClipboard(copyData, e)}
  aria-hidden="true"
/>

<style>
  .copy-ref {
    vertical-align: baseline;
    color: rgba(30, 30, 67, 0.4);
    transition: all 0.3s ease-in-out;
  }

  .copy-ref:hover:not(.copied)::after {
    content: attr(data-display);
    font-family: Work Sans, Arial, sans-serif;
    font-weight: normal;
    color: rgba(30, 30, 67, 0.6);
    position: absolute;
    bottom: 107%;
    right: 0;
    padding: 5px 10px;
    border: 1px solid rgba(30, 30, 67, 0.2);
    border-radius: 6px;
    transform: translate(0%, 0%);
    box-shadow: 0 0 7px rgb(0 0 0 / 7%);
    background-color: white;
    width: max-content;
    z-index: 9999;
    padding: 10px;
  }

  :global(.copy-ref.copied) {
    position: relative;
    animation: icon_bounce 1s linear;
  }

  :global(.copy-ref.copied::after) {
    content: "copied";
    font-family: "Work Sans", Arial, sans-serif;
    position: absolute;
    top: 10%;
    left: 50%;
    animation: copied_fly 1s linear;
  }

  @keyframes icon_bounce {
    0% {
      transform: translate(0%, 0%);
    }
    25% {
      transform: translate(30%, -30%);
    }
    50% {
      transform: translate(0%, 0%);
    }
    100% {
      transform: translate(0%, 0%);
    }
  }

  @keyframes copied_fly {
    from {
      transform: translate(0%, 0%);
      opacity: 1;
    }
    to {
      transform: translate(100%, -100%);
      opacity: 0;
    }
  }
</style>
