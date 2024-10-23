import { StorageConfigType } from "@kredeum/common/src/common/types";

import { storageConfigGet, storageConfigSet } from "@kredeum/common/src/storage/storage";
import { localNamespace, localConfigNamespace, localStorageSet } from "@kredeum/common/src/common/local";

type UserConfig = { [key: string]: ConfigSectionMap };
type ConfigSectionMap = Map<string, ConfigValue>;
type ConfigValue = string | object | SectionErrors;
type SectionErrors = Map<string, Map<string, string>>;
type ConfigSectionObject = { [key: string]: string | object };
type FieldsParams = { [key: string]: string | undefined };
type ConfigTexts = {
  [key: string]: {
    description?: string;
    [key: string]: string | undefined;
  };
};

const configTexts: ConfigTexts = {
  storage: {
    description: "Select your Decentralized Storage",
    ipfs: "Use IPFS Storage to Mint your NFTs",
    swarm: "Use Swarm Storage to Mint your NFTs"
  }
};

///////////////////////////////////////////////
// Config Init + import from localStorage + format fields display
const configInit = (userConfig: UserConfig) => {
  userConfig.storage = jsonToMapSection(storageConfigGet());
  userConfig = localConfigImport(userConfig);
  return configFormatDisplay(userConfig);
};

// import config from localStorage and merge it into current
const localConfigImport = (userConfig: UserConfig) => {
  if (typeof localStorage !== "undefined") {
    Object.entries(localStorage)
      .filter(([namespaceKey]) => namespaceKey.startsWith(`${localNamespace}.`))
      .forEach(([namespaceKey, localConfigSection]) => {
        const namespace = localConfigGetKey(namespaceKey);

        if (Object.prototype.hasOwnProperty.call(userConfig, namespace)) {
          let localConfigSectionObect = JSON.parse(localConfigSection);

          const section = Object.fromEntries(userConfig[namespace]);
          localConfigSectionObect = deepMerge(section, localConfigSectionObect);
          const sectionMap = jsonToMapSection(localConfigSectionObect);

          userConfig[namespace] = sectionMap;
        }
      });
  }
  return userConfig;
};

// Format config for form inputs display
const configFormatDisplay = (userConfig: UserConfig) => {
  Object.entries(userConfig).forEach(([namespace, configSection]) => {
    sectionFormatDisplay(namespace, configSection);
  });

  return userConfig;
};

// Check config and add errors
const configCheck = (userConfig: UserConfig) => {
  deleteFieldErrors(userConfig);

  Object.entries(userConfig).forEach(([namespace, configSection]) => {
    sectionCheck(namespace, configSection);
  });

  return userConfig;
};

// Save each sections with no errors & return false if at least one section has error(s)
const configSave = (userConfig: UserConfig) => {
  let saveSucces = true;
  if (typeof localStorage !== "undefined") {
    Object.entries(userConfig).forEach(([namespace, configSection]) => {
      !configSection.get("errors") ? sectionSave(namespace, configSection) : (saveSucces = false);
    });
  }

  return saveSucces;
};

///////////////////////////////////////////////
// Checks and format
///////////////////////////////////////////////
const sectionFormatDisplay = (namespace: string, configSection: ConfigSectionMap) => {
  if (namespace === "storage") {
    configSection.forEach((value, key) => {
      if (key !== "errors" && typeof value === "object") {
        Object.entries(value).forEach(([storageParamKey, storageParamValue]) => {
          (value as FieldsParams)[storageParamKey] = storageParamValue.trim();

          if (key === "swarm" && storageParamKey === "apiKey") {
            (value as FieldsParams)[storageParamKey] = `0x${storageParamValue!.replace(/^0x/, "")}`;
          }
        });
      }
    });
  }
  return configSection;
};

const sectionCheck = (namespace: string, configSection: ConfigSectionMap) => {
  if (namespace === "storage") {
    configSection.forEach((value, key) => {
      if (key !== "errors" && typeof value === "object") {
        Object.entries(value).forEach(([storageParamKey, storageParamValue]) => {
          (value as FieldsParams)[storageParamKey] = storageParamValue.trim();

          if (storageParamKey === "gateway" || storageParamKey === "apiEndpoint") {
            if (!isUrlValid(storageParamValue as string)) {
              addFieldError(configSection, key, storageParamKey, "Bad URL");
            }
          } else if (key === "swarm" && storageParamKey === "apiKey") {
            (value as FieldsParams)[storageParamKey] = storageParamValue!.replace(/^0x/, "");

            if (!isBatchIdValid(storageParamValue as string)) {
              addFieldError(configSection, key, storageParamKey, "Invalid BatchId");
            }
          }
        });
      }
    });
  }

  return !configSection.get("errors");
};

const sectionSave = (namespace: string, configSection: ConfigSectionMap) => {
  if (namespace === "storage") {
    storageConfigSet(Object.fromEntries(configSection) as StorageConfigType);
  } else {
    localStorageSet(localConfigNamespace(namespace), mapSectionStringify(configSection));
  }
};

///////////////////////////////////////////////
// Errors gesture
///////////////////////////////////////////////
const addFieldError = (section: ConfigSectionMap, storageType: string, key: string, errMessage: string) => {
  const errors: SectionErrors = (section.get("errors") as SectionErrors) || new Map();
  const storageErrors = errors.get(storageType) || new Map();

  storageErrors.set(key, errMessage);
  errors.set(storageType, storageErrors);
  section.set("errors", errors);
};

const deleteFieldErrors = (userConfig: UserConfig) =>
  Object.values(userConfig).forEach((configSection) => configSection.delete("errors"));

///////////////////////////////////////////////
// Check functions
///////////////////////////////////////////////
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
  Boolean(batchId?.replace(/^0x/, "").length === 64 && /^[0-9a-fA-F]+$/.test(batchId?.replace(/^0x/, "")));

///////////////////////////////////////////////
// Utils functions
///////////////////////////////////////////////
const localConfigGetKey = (key: string) => key.replace(`${localNamespace}.`, "");

const mapSectionStringify = (map: ConfigSectionMap): string => JSON.stringify(Object.fromEntries(map));
const jsonToMapSection = (json: object): ConfigSectionMap => new Map(Object.entries(json));

const deepMerge = (target: ConfigSectionObject, source: ConfigSectionObject) => {
  for (const key in source) {
    if (typeof source[key] == "object" && typeof target[key] == "object") {
      target[key] = deepMerge(target[key] as ConfigSectionObject, source[key] as ConfigSectionObject);
    } else if (typeof source[key] == "string") {
      target[key] = source[key];
    }
  }
  return target;
};

export type { UserConfig, ConfigSectionMap, SectionErrors };
export { configTexts, configInit, configCheck, configSave };
