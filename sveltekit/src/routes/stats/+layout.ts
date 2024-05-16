import type { Load } from "@sveltejs/kit";

const prerender = false;
const ssr = false;

const load: Load = async () => {
  return {};
};

export { prerender, ssr, load };
