<script lang="ts">
  import { StorageConfigType } from "@lib/common/types";
  import type { UserConfig } from "./configTypes";
  import config from "@config/config.json";

  import { onMount } from "svelte";
  import Config from "./Config";
  import ConfigFieldChoice from "./ConfigFieldChoice.svelte";
  import ConfigFieldsLoop from "./ConfigFieldsLoop.svelte";

  /////////////////////////////////////////////////
  // <InputConfigFields />
  // Set User config
  /////////////////////////////////////////////////
  let attributesObject;
  let attributes: UserConfig;

  const krdNamespace = "kredeum";

  onMount(() => {
    attributesObject = new Config();
    attributes = attributesObject.attributes;

    document.addEventListener("propertyChanged", () => {
      console.log("La propriété a été changée");
      attributes = attributesObject.attributes;
    });

    localConfigInit();
  });

  const localConfigGet = (key: string): string | null => {
    try {
      return localStorage.getItem(`${krdNamespace}.${key}`);
    } catch (e) {
      return null;
    }
  };

  const localConfigSet = (namespaceKey: string, value: string): void =>
    localStorage?.setItem(`${krdNamespace}.${namespaceKey}`, value);

  const localConfigRemove = (namespaceKey: string) => localStorage?.removeItem(`${krdNamespace}.${namespaceKey}`);

  const localConfigGetKey = (key) => key.replace(`${krdNamespace}.`, "");

  const importFieldsGroups = (namespace, fieldsGroups) => {
    if (!attributes[namespace].fieldsGroups) attributes[namespace].fieldsGroups = {};

    Object.entries(fieldsGroups).forEach(([fieldGroupKey, fieldGroupFields]) => {
      if (fieldGroupFields && fieldGroupKey !== "default" && typeof fieldGroupFields === "object") {
        if (!Object.keys(attributes[namespace].fieldsGroups).some((key) => key === fieldGroupKey)) {
          attributes[namespace].fieldsGroups[fieldGroupKey] = { fields: [] };
        }

        Object.entries(fieldGroupFields).forEach(([key, value]) => {
          if (!attributes[namespace].fieldsGroups[fieldGroupKey].fields.some((field) => field.key === key)) {
            attributes[namespace].fieldsGroups[fieldGroupKey].fields.push({ key, value });
          } else {
            attributes[namespace].fieldsGroups[fieldGroupKey].fields.forEach((field) => {
              if (field.key === key) field.value = value;
            });
          }
        });
      }
    });
  };

  // const defaultStorageConfigInit = () => {
  //   let storage = config.storage;
  //   attributes.storage.default.value = storage.default;
  //   importFieldsGroups("storage", storage);
  // };

  const importConfigSection = (namespace, configSection) => {
    if (!attributes[namespace]) attributes[namespace] = { default: { value: "" } };
    attributes[namespace].default.value = configSection.default;

    if (Object.keys(configSection).some((key) => key !== "default")) importFieldsGroups(namespace, configSection);
  };

  const localConfigInit = (): void => {
    // Default Storage ConfigInit
    importConfigSection("storage", config.storage);

    // if (!localConfigGet("api")) localConfigSet("api", BEE_API_DEFAULT);
    // if (!localConfigGet("gateway")) localConfigSet("gateway", BEE_GATEWAY_DEFAULT);
    // if (!localConfigGet("batchId")) localConfigSet("batchId", BEE_BATCHID_DEFAULT);
    // if (!localConfigGet("bzzChainId")) localConfigSet("bzzChainId", BZZ_CHAIN_ID_DEFAULT);

    // Local strorage config import
    Object.entries(localStorage)
      .filter(([namespaceKey, _]) => namespaceKey.startsWith(`${krdNamespace}.`))
      .forEach(([namespaceKey, fields]) => {
        const namespace = localConfigGetKey(namespaceKey);
        let localFieldsObject = JSON.parse(fields);

        importConfigSection(namespace, localFieldsObject);
      });

    for (const namespace of Object.keys(attributes)) {
      const defaultValue = attributes[namespace].default.value;
      const defaultFieldsGroups = attributes[namespace].fieldsGroups[defaultValue];

      if (defaultFieldsGroups.editable && defaultFieldsGroups.fields.length == 0) {
        attributes[namespace].fieldsGroups[defaultValue].fields.push({ key: "", value: "", editableKey: true, deletable: true });
      }
    }
  };

  console.log("ATTRIBUTES LOADED:", attributes);
  /////////////////////////

  const saveConfig = () => {
    if (typeof localStorage !== "undefined") {
      Object.entries(attributes).forEach(([namespace, attribute]) => {
        const defaultValue = attribute.default.value;

        let localConfigSection = {};
        Object.entries(attribute.fieldsGroups).forEach(([key, fieldGroup]) => {
          fieldGroup.fields.forEach((field) => {
            if (field.key !== "" && field.value !== "")
              localConfigSection[key] = { ...localConfigSection[key], [field.key]: field.value };
          });
        });
        if (Object.keys(localConfigSection).length > 0) {
          (localConfigSection as StorageConfigType).default = defaultValue;

          localConfigSet(namespace, JSON.stringify(localConfigSection));
        } else {
          localConfigRemove(namespace);
        }
      });
    }
  };

  $: console.log("attributes refresh:", attributes);
</script>

<div class="section">
  {#if attributes}
    {#each Object.entries(attributes) as [namespace, attribute]}
      {#if attribute.display}
        <div class="titre">{attribute.display}</div>
      {/if}
      {#if Object.keys(attribute.fieldsGroups).length > 1}
        <ConfigFieldChoice bind:attributes {namespace} />
      {/if}
      <ConfigFieldsLoop
        bind:attributesObject
        bind:fieldsGroup={attributes[namespace].fieldsGroups[attribute.default.value]}
        {namespace}
      />
    {/each}
  {/if}

  <div class="txtright">
    <button class="btn btn-default btn-sell" on:click|preventDefault={saveConfig}>Save</button>
  </div>
</div>
