<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut, bounceOut } from "svelte/easing";
  import { clickOutside } from "@svelte/helpers/clickOutside";

  let open = false;
  let status = "";
  let title = "";
  let alertMsg = "";
  let alertTimeoutId: ReturnType<typeof setTimeout>;

  interface KreAlertEvent extends Event {
    detail: {
      status: string;
      title: string;
      text: string;
    };
  }

  onMount(() => {
    if (window) {
      window.addEventListener("KreAlertEvent", (event) => {
        const alert = event as KreAlertEvent;

        status = alert.detail.status;
        title = alert.detail.title;
        alertMsg = alert.detail.text;
        open = true;
      });

      // Global Error Listener for Uncaught Exceptions
      window.onerror = function (message, source, lineno, colno, error) {
        // console.log("Global error:", { message, source, lineno, colno, error });
        status = "error";
        title = `${error?.name}`;
        alertMsg = error?.message || "";
        open = true;
      };

      // Global Listener for Unhandled Promise Rejections
      window.onunhandledrejection = function (event) {
        console.log("Unhandled rejection:", event);
        status = "error";
        title = `Unhandled rejection #${event.reason.code}`;
        alertMsg = event.reason.message;
        open = true;
      };
    }
  });

  //////////////////////////////////
  const alertEasingMode = () => (status === "error" ? bounceOut : quintOut);

  $: alertMsg && alertDisplay();
  const alertDisplay = () => {
    clearTimeout(alertTimeoutId);
    if (status !== "error") alertTimeoutId = setTimeout(() => alertReset(), 4000);
  };

  const alertReset = () => {
    open = false;
    status = "";
    title = "";
    alertMsg = "";
    clearTimeout(alertTimeoutId);
  };
</script>

{#if open}
  <dialog
    class="kre-alert-message kre-{status}-message"
    role="alert"
    in:fly={{ delay: 0, duration: 300, x: 0, y: 100, opacity: 0.5, easing: alertEasingMode() }}
    out:fade={{ duration: 500 }}
    use:clickOutside={alertReset}
    {open}
  >
    <button on:click={alertReset} on:keydown={alertReset} class="modal-close" title="Close" aria-label="Close">
      <i class="fa fa-times" />
    </button>
    <p class="kre-msg-title">
      {#if status === "error"}
        <i class="fas fa-exclamation-circle" />
      {:else if status === "success"}
        <i class="fas fa-check-circle" />
      {:else}
        <i class="fas fa-info-circle"></i>
      {/if}
      <span>{title || ""}</span>
    </p>
    <div>
      <pre>{alertMsg || ""}</pre>
    </div>
  </dialog>
{/if}

<style>
  .kre-alert-message {
    background-color: #fff;
    border-radius: 6px;
    position: fixed;
    left: 50%;
    bottom: 3em;
    transform: translateX(-50%);
    margin: 0;
    padding: 2.3em 4em 2.3em 4.5em;
    max-width: 90%;
    color: #000;
    border-color: transparent;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    z-index: 10000;
  }

  .kre-msg-title {
    font-weight: 700;
    font-size: 1.5em;
    margin-left: -1.6em;
  }

  .kre-msg-title i {
    vertical-align: baseline;
  }

  span {
    margin-left: 0.3em;
  }

  .kre-alert-message div {
    max-height: 20vh;
    overflow-y: auto;
  }

  .modal-close {
    position: absolute;
    top: 0.8em;
    right: 0.8em;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  .modal-close i {
    font-size: 1.5em;
    color: rgba(30, 30, 67, 0.4);
  }

  .fa-exclamation-circle {
    color: red;
  }

  .fa-check-circle {
    color: rgb(16, 163, 16);
  }

  .fa-info-circle {
    color: orange;
  }

  pre {
    margin: 0;
    white-space: pre-line;
    word-wrap: break-word;
  }
</style>
