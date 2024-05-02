import type { Writable } from "svelte/store";
import { get, writable } from "svelte/store";

// STORES //

// number of collection counts updates
const stats: Writable<number> = writable(0);

// collection count per chainId
const statsCounts: Writable<Map<number, number>> = writable(new Map());

// total collection count of all chainIds
const statsTotal: Writable<number> = writable(0);

// FUNCTIONS //

// chainIds with collection counts
const statsChainIds = (): number[] => [...get(statsCounts).keys()];

// get collection count of chainId
const statsChain = (chainId: number): number => get(statsCounts).get(chainId) || 0;

// subtotal collection count of specific set of chainIds
const statsSubTotal = (chainIds: number[]): number => chainIds.reduce((sum, chainId) => sum + statsChain(chainId), 0);

const statsSubTotalUpdated = (chainIds: number[]): number =>
  chainIds.reduce((sum, chainId) => sum + (get(statsCounts).get(chainId) ? 1 : 0), 0);

// update stats
const statsUpdate = (chainId: number, value: number) => {
  statsCounts.update((map) => {
    // update total collection count
    statsTotal.update((sum) => sum + value - (map.get(chainId) || 0));

    // set collection count for chainId
    map.set(chainId, value);

    // increment number of collection updates
    stats.update((n) => n + 1);

    console.log("statsCounts.update ~ map:", map);
    return map;
  });
};

const statsSort = (chainIds: number[]): number[] => chainIds.sort((a, b) => statsChain(b) - statsChain(a));

export { stats, statsCounts, statsTotal, statsChainIds, statsSort, statsChain, statsSubTotal, statsSubTotalUpdated, statsUpdate };
