<script lang="ts">
  import { onMount } from "svelte";

  import config from "@kredeum/config/dist/config.json";
  import {
    localConfigSet,
    mapStringify,
    jsonToMap,
    isUrlValid,
    isBatchIdValid,
    localConfigImport
  } from "@svelte/helpers/configHelper";
  import InputConfigFields from "./InputConfigFields.svelte";

  let userConfig: { [key: string]: Map<string, any> } = {};

  onMount(() => {
    userConfig.storage = jsonToMap(config.storage);

    userConfig = localConfigImport(userConfig);
  });

  ///////////////////////////////////////
  const saveUserConfig = () => {
    if (typeof localStorage !== "undefined") {
      deleteFieldErrors();

      Object.entries(userConfig).forEach(([namespace, configSection]) => {
        if (isSectionValid(namespace, configSection)) {
          localConfigSet(namespace, mapStringify(configSection));
        }
      });
    }
  };

  ///////////////////////////////////////
  const isSectionValid = (namespace: string, configSection: Map<string, any>) => {
    if (namespace === "storage") {
      configSection.forEach((value, key) => {
        if (key !== "errors" && typeof value === "object") {
          Object.entries(value).forEach(([storageParamKey, storageParamValue]) => {
            if (storageParamKey === "gateway" || storageParamKey === "apiEndpoint") {
              if (!isUrlValid(storageParamValue as string)) {
                addFieldError(namespace, key, storageParamKey, "Bad URL");
              }
            } else if (key === "swarm" && storageParamKey === "apiKey") {
              if (!isBatchIdValid(storageParamValue as string)) {
                addFieldError(namespace, key, storageParamKey, "Invalid BatchId");
              }
            }
          });
        }
      });
    }

    return !userConfig[namespace].get("errors");
  };

  const addFieldError = (namespace: string, storageType: string, key: string, errMessage: string) => {
    let section = userConfig[namespace];
    let errors = section.get("errors") || new Map();
    let storageErrors = errors.get(storageType) || new Map();

    storageErrors.set(key, errMessage);
    errors.set(storageType, storageErrors);
    section.set("errors", errors);

    userConfig[namespace] = section;
  };

  const deleteFieldErrors = () => {
    Object.values(userConfig).forEach((configSection) => configSection.delete("errors"));
    userConfig = { ...userConfig };
  };
</script>

{#each Object.keys(userConfig) as namespace}
  <div class="titre">{namespace}</div>
  <InputConfigFields bind:configSection={userConfig[namespace]} />
{/each}

<button type="submit" class="btn btn-default btn-sell" on:click|preventDefault={saveUserConfig}>Save</button>
