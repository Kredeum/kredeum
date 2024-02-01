import type { Load } from "@sveltejs/kit";

const prerender = true;
const ssr = false;

const load: Load = async () => {
  console.log("typeof window:", typeof window);
  console.log("typeof localStorage:", typeof localStorage);

  return {};
};

export { prerender, ssr, load };
