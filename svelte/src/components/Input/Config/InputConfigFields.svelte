<script lang="ts">
  import { type StorageConfigType } from "@common/common/types";
  import type { UserConfig } from "./configTypes";
  import config from "@kredeum/config/dist/config.json";

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
    // if (!attributes[namespace].fieldsGroups) attributes[namespace].fieldsGroups = {};
    // Object.entries(fieldsGroups).forEach(([fieldGroupKey, fieldGroupFields]) => {
    //   if (fieldGroupFields && fieldGroupKey !== "default" && typeof fieldGroupFields === "object") {
    //     if (!Object.keys(attributes[namespace].fieldsGroups).some((key) => key === fieldGroupKey)) {
    //       attributes[namespace].fieldsGroups[fieldGroupKey] = { fields: [] };
    //     }
    //     Object.entries(fieldGroupFields).forEach(([key, value]) => {
    //       if (!attributes[namespace].fieldsGroups[fieldGroupKey].fields.some((field) => field.key === key)) {
    //         attributes[namespace].fieldsGroups[fieldGroupKey].fields.push({ key, value });
    //       } else {
    //         attributes[namespace].fieldsGroups[fieldGroupKey].fields.forEach((field) => {
    //           if (field.key === key) field.value = value;
    //         });
    //       }
    //     });
    //   }
    // });
  };

  // const defaultStorageConfigInit = () => {
  //   let storage = config.storage;
  //   attributes.storage.default.value = storage.default;
  //   importFieldsGroups("storage", storage);
  // };
  const deepMerge = (target, source) => {
    const isObject = (obj) => obj && typeof obj === "object";

    if (!isObject(target) || !isObject(source)) {
      return source;
    }

    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  };

  const importConfigSection = (namespace, configSection) => {
    // Object.assign(attributes[namespace], configSection);
    attributes[namespace] = deepMerge(attributes[namespace], configSection);
    // if (!attributes[namespace]) attributes[namespace] = { default: { value: "" } };
    // attributes[namespace].default.value = configSection.default;

    // if (Object.keys(configSection).some((key) => key !== "default")) importFieldsGroups(namespace, configSection);
  };

  const localConfigInit = (): void => {
    // Default Storage ConfigInit
    importConfigSection("storage", config.storage);

    // if (!localConfigGet("api")) localConfigSet("api", BEE_API_DEFAULT);
    // if (!localConfigGet("gateway")) localConfigSet("gateway", BEE_GATEWAY_DEFAULT);
    // if (!localConfigGet("batchId")) localConfigSet("batchId", BEE_BATCHID_DEFAULT);
    // if (!localConfigGet("bzzChainId")) localConfigSet("bzzChainId", BZZ_CHAIN_ID_DEFAULT);

    // Local strorage config import
    // Object.entries(localStorage)
    //   .filter(([namespaceKey, _]) => namespaceKey.startsWith(`${krdNamespace}.`))
    //   .forEach(([namespaceKey, fields]) => {
    //     const namespace = localConfigGetKey(namespaceKey);
    //     let localFieldsObject = JSON.parse(fields);

    //     importConfigSection(namespace, localFieldsObject);
    //   });

    for (const namespace of Object.keys(attributes)) {
      const defaultValue = attributes[namespace].default;
      const editableFields = attributes[namespace][defaultValue].kre_editable;
      const fieldsGroup = Object.keys(attributes[namespace][defaultValue]).filter((key) => {
        !key.startsWith("kre_");
      });

      if (editableFields && fieldsGroup.length == 0) {
        attributes[namespace][defaultValue].your_key = "";
      }
    }
  };

  console.log("ATTRIBUTES LOADED:", attributes);
  /////////////////////////

  const removeEmptyValues = (configSection) => {
    Object.keys(configSection).forEach((key) => {
      if (configSection[key] && typeof configSection[key] === "object") {
        removeEmptyValues(configSection[key]);

        if (Object.keys(configSection[key]).filter((valueKey) => !valueKey.startsWith("kre_")).length === 0) {
          delete configSection[key];
        }
      } else if (configSection[key] === "") {
        delete configSection[key];
      }
    });
  };

  const saveConfig = () => {
    if (typeof localStorage !== "undefined") {
      Object.entries(attributes).forEach(([namespace, attribute]) => {
        // Object.entries(attribute).forEach(([key, value]) => {
        //   console.log("alors ? : ", !key.startsWith("kre_"));
        //   console.log("alors key? : ", key);
        //   console.log("alors value? : ", value);
        //   console.log(
        //     "alors values array? : ",
        //     Object.keys(value).filter((valueKey) => !valueKey.startsWith("kre_"))
        //   );
        // });

        let attributeToStore = JSON.parse(JSON.stringify(attribute));
        // Object.assign(attributeToStore, attribute);
        removeEmptyValues(attributeToStore);

        if (
          Object.entries(attributeToStore).filter(
            ([key, value]) =>
              !key.startsWith("kre_") &&
              key !== "default" &&
              typeof value === "object" &&
              Object.keys(value).filter((valueKey) => !valueKey.startsWith("kre_")).length > 0
          ).length > 0
        ) {
          localConfigSet(namespace, JSON.stringify(attributeToStore));
        } else {
          localConfigRemove(namespace);
        }

        // const defaultValue = attribute.default;
        // let localConfigSection = {};
        // Object.entries(attribute.fieldsGroups).forEach(([key, fieldGroup]) => {
        //   fieldGroup.fields.forEach((field) => {
        //     if (field.key !== "" && field.value !== "")
        //       localConfigSection[key] = { ...localConfigSection[key], [field.key]: field.value };
        //   });
        // });
        // if (Object.keys(localConfigSection).length > 0) {
        //   (localConfigSection as StorageConfigType).default = defaultValue;
        //   localConfigSet(namespace, JSON.stringify(localConfigSection));
        // } else {
        //   localConfigRemove(namespace);
        // }
      });
    }
    console.log("Object.entries ~ attributes:", attributes);
  };

  $: console.log("attributes refresh:", attributes);
</script>

<div class="section">
  {#if attributes}
    {#each Object.entries(attributes) as [namespace, attribute]}
      {#if attribute.kre_display}
        A<div class="titre">{attribute.kre_display}</div>B
      {/if}
      {#if Object.keys(attribute).filter((key) => !key.startsWith("kre_") && key !== "default").length > 1}
        <ConfigFieldChoice bind:attributes {namespace} />
      {/if}

      <!-- <ConfigFieldsLoop bind:attributesObject bind:attributes bind:fieldsGroup={attributes[namespace][attribute.default]} {namespace} /> -->
      <ConfigFieldsLoop bind:attributesObject bind:attributes {namespace} />
    {/each}
  {/if}

  <div class="txtright">
    <button class="btn btn-default btn-sell" on:click|preventDefault={saveConfig}>Save</button>
  </div>
</div>
