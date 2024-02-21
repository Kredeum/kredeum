import config from "@kredeum/config/dist/config.json";

type UserConfig = {
  [key: string]: ConfigSection
}

type ConfigSection = Map<
  string,
  string | object
> | Map<"errors", SectionErrors>;

type SectionErrors = Map<string, Map<string, Map<string, string>>>

const krdNamespace = "kredeum";

const localConfigGetKey = (key: string) => key.replace(`${krdNamespace}.`, "");

const localConfigSet = (namespaceKey: string, value: string): void =>
  localStorage?.setItem(`${krdNamespace}.${namespaceKey}`, value);

const mapSectionStringify = (map: ConfigSection): string => JSON.stringify(Object.fromEntries(map));
const jsonToMapSection = (json: object): ConfigSection => new Map(Object.entries(json));

/////////////////////////////////////////
const ConfigInit = (userConfig: UserConfig) => {
  userConfig.storage = jsonToMapSection(config.storage);
  return localConfigImport(userConfig);
}

const localConfigImport = (userConfig: UserConfig) => {
  if (typeof localStorage !== "undefined") {
    Object.entries(localStorage)
      .filter(([namespaceKey,]) => namespaceKey.startsWith(`${krdNamespace}.`))
      .forEach(([namespaceKey, localConfigSection]) => {
        const namespace = localConfigGetKey(namespaceKey);
        const localSectionMap = jsonToMapSection(JSON.parse(localConfigSection));

        userConfig[namespace] = localSectionMap;
      });
  }
  return userConfig
};

/////////////////////////////////////////
const configCheck = (userConfig: UserConfig) => {
  deleteFieldErrors(userConfig);

  Object.entries(userConfig).forEach(([namespace, configSection]) => {
    checkSection(namespace, configSection)

  });

  return userConfig
};

const configSave = (userConfig: UserConfig) => {
  let saveSucces = true;
  if (typeof localStorage !== "undefined") {

    Object.entries(userConfig).forEach(([namespace, configSection]) => {
      (!configSection.get('errors')) ? localConfigSet(namespace, mapSectionStringify(configSection)) : saveSucces = false;
    });
  }

  return saveSucces
};

/////////////////////////////////////////
const checkSection = (namespace: string, configSection: ConfigSection) => {
  if (namespace === "storage") {
    configSection.forEach((value, key) => {
      if (key !== "errors" && typeof value === "object") {
        Object.entries(value).forEach(([storageParamKey, storageParamValue]) => {
          if (storageParamKey === "gateway" || storageParamKey === "apiEndpoint") {
            if (!isUrlValid(storageParamValue as string)) {
              addFieldError(configSection, key, storageParamKey, "Bad URL");
            }
          } else if (key === "swarm" && storageParamKey === "apiKey") {
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

///////////////////////////////////////////////
const addFieldError = (section: ConfigSection, storageType: string, key: string, errMessage: string) => {
  const errors: SectionErrors = section.get("errors") as SectionErrors || new Map();
  const storageErrors = errors.get(storageType) || new Map();

  storageErrors.set(key, errMessage);
  errors.set(storageType, storageErrors);
  section.set("errors", errors);
};

const deleteFieldErrors = (userConfig: UserConfig) => Object.values(userConfig).forEach((configSection) => configSection.delete("errors"));

export type { UserConfig };
export { ConfigInit, configCheck, configSave };