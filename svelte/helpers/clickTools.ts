// Base on https://github.com/rster2002/svelte-outside-click

import type { ActionReturn } from "svelte/action";

const clickOutside = (node: HTMLElement, onEventFunction: () => void): ActionReturn => {
  const handleClick = (event: Event) => !event.composedPath().includes(node) && onEventFunction();

  document.addEventListener("click", handleClick);

  return {
    destroy() {
      document.removeEventListener("click", handleClick);
    }
  };
};

const clickToClose = () => (location.href = "#");

export { clickOutside, clickToClose };
