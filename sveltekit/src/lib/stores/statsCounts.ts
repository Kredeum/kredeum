import type { Writable } from "svelte/store";
import { get, writable } from "svelte/store";
import {
  localStorageGet,
  localStorageKeys,
  localStorageRemove,
  localStorageSet
} from "@kredeum/common/src/common/local";
import { keyStats } from "@kredeum/common/src/common/keys";

type StatsCounts = Map<number, number>;

// LOADER //
const _statsCountLoadLocalStorage = (): StatsCounts => {
  const _statsCounts: StatsCounts = new Map();

  localStorageKeys("stats://")
    .map((key) => _statsCounts.set(Number(key.replace("stats://", "")), Number(localStorageGet(key))));

  // console.log("_statsCountLoadLocalStorage", _statsCounts);
  return _statsCounts;
};

// STORES //

// collection count per chainId
const statsCounts: Writable<StatsCounts> = writable(_statsCountLoadLocalStorage());

// number of collection counts updates
const stats: Writable<number> = writable(1);

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
  statsCounts.update(($statsCounts) => {
    // increment number of collection updates
    stats.update((n) => n + 1);

    // set collection count for chainId in localstorage
    localStorageSet(keyStats(chainId), String(value));

    // set collection count for chainId in svelte store
    return $statsCounts.set(chainId, value);
  });
};

const statsSort = (chainIds: number[]): number[] => chainIds.sort((a, b) => statsChain(b) - statsChain(a));

const statsClean = () =>
  localStorageKeys("stats://")
    .map((key) => localStorageRemove(key));

export {
  stats,
  statsCounts,
  statsClean,
  statsChainIds,
  statsSort,
  statsChain,
  statsSubTotal,
  statsSubTotalUpdated,
  statsUpdate
};
