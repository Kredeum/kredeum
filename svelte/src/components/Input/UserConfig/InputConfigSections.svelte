<script lang="ts">
  import type { StorageConfigType, StorageType } from "@common/common/types";

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

  ///////////////////////////////////////
  const localConfigGetKey = (key: string) => key.replace(`${krdNamespace}.`, "");

  const localConfigSet = (namespaceKey: string, value: string): void =>
    localStorage?.setItem(`${krdNamespace}.${namespaceKey}`, value);

  ///////////////////////////////////////
  const saveUserConfig = () => {
    if (typeof localStorage !== "undefined") {
      Object.entries(userConfig).forEach(([namespace, configSection]) => {
        if (!isSectionValid(namespace, configSection)) return;

        localConfigSet(namespace, JSON.stringify(configSection));
      });
      console.log("saveUserConfig ~ storageConfig:", userConfig);
    }
  };
  ///////////////////////////////////////
  const isSectionValid = (namespace: string, configSection: StorageConfigType) => {
    if (namespace === "storage") {
      Object.entries(configSection).forEach(([key, value]) => {
        if (key !== "errors" && value && typeof value === "object") {
          Object.entries(value).forEach(([storageParamKey, storageParamValue]) => {
            if (storageParamKey === "gateway" || storageParamKey === "apiEndpoint") {
              if (!isUrlValid(storageParamValue)) {
                addFieldError(namespace, key as StorageType, storageParamKey, "Bad URL");
              } else {
                deleteFieldError(namespace, key as StorageType, storageParamKey);
              }
            } else if (key === "swarm" && storageParamKey === "apiKey") {
              if (!isBatchIdValid(storageParamValue)) {
                addFieldError(namespace, key, storageParamKey, "Invalid BatchId");
              } else {
                deleteFieldError(namespace, key as StorageType, storageParamKey);
              }
            }
          });
          if (typeof userConfig?.[namespace]?.errors?.[key as StorageType] === "object") {
            if (Object.keys(userConfig?.[namespace]?.errors?.[key as StorageType]).length == 0)
              delete userConfig?.[namespace]?.errors?.[key as StorageType];
          }
        }
      });
    }
    if (typeof userConfig?.[namespace]?.errors === "object") {
      if (Object.keys(userConfig?.[namespace]?.errors).length == 0) delete userConfig?.[namespace]?.errors;
    }

    console.log("isSectionValid ~ userConfig:", userConfig);

    return !userConfig[namespace].errors;
  };

  const addFieldError = (namespace: string, storageType: StorageType, key: string, errMessage: string) => {
    if (userConfig[namespace].errors === undefined) userConfig[namespace].errors = {};
    if (!userConfig[namespace].errors[storageType as StorageType])
      userConfig[namespace].errors[storageType as StorageType] = {};
    userConfig[namespace].errors[storageType as StorageType][key] = errMessage;
  };

  const deleteFieldError = (namespace: string, storageType: StorageType, key: string) => {
    if (userConfig?.[namespace].errors?.[storageType as StorageType]?.[key])
      delete userConfig?.[namespace].errors?.[storageType as StorageType]?.[key];
  };

  const isUrlValid = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isBatchIdValid = (batchId: string | undefined): boolean => Boolean(batchId?.replace(/^0x/, "").length === 64);
</script>

{#each Object.keys(userConfig) as key}
  <div class="titre">{key}</div>
  <InputConfigFields bind:configSection={userConfig[key]} />
{/each}

<button type="submit" class="btn btn-default btn-sell" on:click|preventDefault={saveUserConfig}>Save</button>
