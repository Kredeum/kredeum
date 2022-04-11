<script>
  import { get } from "svelte/store";
  import { map, mapFilter } from "./MapStore";
  import List from "./List.svelte";

  $: array__ = mapFilter();
  $: array_137_ = mapFilter(137);
  $: array__35 = mapFilter(null, 35);
  $: array_1_35 = mapFilter(1, 35);

  const handleClick = () => {
    map.setKey({ chainId: 137, addr: 35, name: "col5" });
    map.setKey({ chainId: 1, addr: 35, name: "col6" });
  };
</script>

<button on:click={handleClick}>MORE</button>

<List label="ALL" arr={$array__} />
<List label="Chain 137" arr={$array_137_} />
<List label="Addr 35" arr={$array__35} />
<List label="Chain 1 Addr 35" arr={$array_1_35} />
<List label="ALL" arr={[...$map]} />
