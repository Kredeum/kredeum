<script lang="ts">
  import type { StorageConfigType } from "@common/common/types";

  import config from "@kredeum/config/dist/config.json";

  import InputConfigFields from "./InputConfigFields.svelte";
  import { onMount } from "svelte";

  const krdNamespace = "kredeum";
  let storageConfig: StorageConfigType = config.storage;

  interface UserConfigType {
    [key: string]: StorageConfigType;
  }

  let userConfig: UserConfigType = {
    storage: storageConfig
  };

  onMount(() => {
    if (typeof localStorage !== "undefined") {
      Object.entries(localStorage)
        .filter(([namespaceKey, _]) => namespaceKey.startsWith(`${krdNamespace}.`))
        .forEach(([namespaceKey, localConfigSection]) => {
          const namespace = localConfigGetKey(namespaceKey);
          let localSectionObject = JSON.parse(localConfigSection);

          userConfig[namespace] = localSectionObject;
        });
    }
  });

  const isUrlValid = (url: string): boolean => {
		if (!url) return false;
		try {
			new URL(url);
			return true;
		} catch (e) {
			return false;
		}
	};

	const isBatchIdValid = (batchId: string | undefined): boolean =>
		Boolean(batchId?.replace(/^0x/, '').length === 64);

  ///////////////////////////////////////
  const localConfigGetKey = (key: string) => key.replace(`${krdNamespace}.`, "");

  const localConfigSet = (namespaceKey: string, value: string): void =>
    localStorage?.setItem(`${krdNamespace}.${namespaceKey}`, value);

  ///////////////////////////////////////
  const saveUserConfig = () => {
    console.log("saveUserConfig ~ storageConfig:", userConfig);

    if (typeof localStorage !== "undefined") {
      Object.entries(userConfig).forEach(([namespace, configSection]) => {
        localConfigSet(namespace, JSON.stringify(configSection));
      });
    }
  };
</script>

{#each Object.keys(userConfig) as key}
  <div class="titre">{key}</div>
  <InputConfigFields bind:configSection={userConfig[key]} />
{/each}

<button type="submit" class="btn btn-default btn-sell" on:click|preventDefault={saveUserConfig}>Save</button>
