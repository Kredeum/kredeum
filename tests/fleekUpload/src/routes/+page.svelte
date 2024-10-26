<script lang="ts">
	import { onMount } from 'svelte';
	import { fleek } from '$lib/fleek';

	onMount(async () => {
		const projects = await fleek.projects();
		console.log(projects);
	});
</script>

OK
