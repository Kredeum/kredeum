<script lang="ts">
  import config from "@kredeum/config/dist/config.json";

  import InputConfigFields from "./InputConfigFields.svelte";
  import { onMount } from "svelte";

  const krdNamespace = "kredeum";

  let userConfig: { [key: string]: Map<string, any> } = {};

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
          console.log(".forEach ~ localConfigSection:", localConfigSection);
          const namespace = localConfigGetKey(namespaceKey);
          let localSectionMap = jsonToMap(JSON.parse(localConfigSection));
          console.log(".forEach ~ JSON.parse(localConfigSection:", JSON.parse(localConfigSection));
          console.log(".forEach ~ localSectionMap:", localSectionMap);

          userConfig[namespace] = localSectionMap;
        });
    }
  };

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

  const mapStringify = (map: Map<string, any>): string => JSON.stringify(Object.fromEntries(map));
  const jsonToMap = (json: object): Map<string, any> => new Map(Object.entries(json));

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
