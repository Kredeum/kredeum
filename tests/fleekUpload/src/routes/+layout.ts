import type { Load } from '@sveltejs/kit';

const prerender = true;
const ssr = false;

const load: Load = async () => {
	return {};
};

export { prerender, ssr, load };
