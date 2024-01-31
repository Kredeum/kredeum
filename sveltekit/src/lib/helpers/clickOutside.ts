// Base on https://github.com/rster2002/svelte-outside-click

import type { ActionReturn } from "svelte/action";

const clickOutside = (node: HTMLElement, onEventFunction: () => void): ActionReturn => {
  const handleClick = (event: Event) => !event.composedPath().includes(node) && onEventFunction();

  document.addEventListener("mousedown", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("mousedown", handleClick, true);
    }
  };
};

export { clickOutside };
