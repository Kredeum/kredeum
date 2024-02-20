<script lang="ts">
  import type { StorageConfigType, StorageType } from "@common/common/types";

  import config from "@kredeum/config/dist/config.json";

  import InputConfigFields from "./InputConfigFields.svelte";
  import { onMount } from "svelte";

  const krdNamespace = "kredeum";

  interface UserConfigType {
    [key: string]: Map<string, any>;
  }

  let userConfig: UserConfigType = {};

  onMount(() => {
    userConfig.storage = jsonToMap(config.storage);

    localConfigImport();
  });

  ///////////////////////////////////////
  const localConfigGetKey = (key: string) => key.replace(`${krdNamespace}.`, "");

  const localConfigSet = (namespaceKey: string, value: string): void =>
    localStorage?.setItem(`${krdNamespace}.${namespaceKey}`, value);

  const localConfigImport = () => {
    if (typeof localStorage !== "undefined") {
      Object.entries(localStorage)
        .filter(([namespaceKey, _]) => namespaceKey.startsWith(`${krdNamespace}.`))
        .forEach(([namespaceKey, localConfigSection]) => {
          const namespace = localConfigGetKey(namespaceKey);
          let localSectionObject = jsonToMap(JSON.parse(localConfigSection));

          userConfig[namespace] = localSectionObject;
        });
    }
  };

  ///////////////////////////////////////
  const saveUserConfig = () => {
    if (typeof localStorage !== "undefined") {
      Object.entries(userConfig).forEach(([namespace, configSection]) => {
        if (!isSectionValid(namespace, configSection)) return;

        localConfigSet(namespace, mapStringify(configSection));
      });
    }
  };

  const mapStringify = (map: Map<string, any>): string => JSON.stringify(Object.fromEntries(map));
  const jsonToMap = (json: object): Map<string, any> => new Map(Object.entries(json));

  ///////////////////////////////////////
  const isSectionValid = (namespace: string, configSection: Map<string, any>) => {
    deleteFieldErrors();

    if (namespace === "storage") {
      configSection.forEach((value, key) => {
        if (key !== "errors" && typeof value === "object") {
          Object.entries(value).forEach(([storageParamKey, storageParamValue]) => {
            if (storageParamKey === "gateway" || storageParamKey === "apiEndpoint") {
              if (!isUrlValid(storageParamValue as string)) {
                addFieldError(namespace, key as StorageType, storageParamKey, "Bad URL");
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

    console.log("isSectionValid ~ userConfig:", userConfig);
    return !userConfig[namespace].get("errors");
  };

  const addFieldError = (namespace: string, storageType: StorageType, key: string, errMessage: string) => {
    let section = userConfig[namespace];
    if (!section.get("errors")) {
      section.set("errors", new Map().set(storageType, new Map().set(key, errMessage)));
    } else if (!section.get("errors").get(storageType)) {
      section.get("errors").set(storageType, new Map().set(key, errMessage));
    } else {
      section.get("errors").get(storageType).set(key, errMessage);
    }

    userConfig[namespace] = section;

    // if (userConfig[namespace].errors === undefined) userConfig[namespace].errors = {};
    // if (!userConfig[namespace].errors[storageType as StorageType])
    //   userConfig[namespace].errors[storageType as StorageType] = {};
    // userConfig[namespace].errors[storageType as StorageType][key] = errMessage;
  };

  const deleteFieldErrors = () => {
    Object.values(userConfig).forEach((configSection) => configSection.delete("errors"));
    userConfig = { ...userConfig };
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

{#each Object.keys(userConfig) as namespace}
  <div class="titre">{namespace}</div>
  <InputConfigFields bind:configSection={userConfig[namespace]} />
{/each}

<button type="submit" class="btn btn-default btn-sell" on:click|preventDefault={saveUserConfig}>Save</button>
