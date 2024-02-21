const krdNamespace = "kredeum";

const localConfigGetKey = (key: string) => key.replace(`${krdNamespace}.`, "");

const localConfigSet = (namespaceKey: string, value: string): void =>
    localStorage?.setItem(`${krdNamespace}.${namespaceKey}`, value);

const mapStringify = (map: Map<string, string | object>): string => JSON.stringify(Object.fromEntries(map));
const jsonToMap = (json: object): Map<string, string | object> => new Map(Object.entries(json));

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

/////////////////////////////////////////

const localConfigImport = (userConfig: { [key: string]: Map<string, string|object> }) => {
    if (typeof localStorage !== "undefined") {
      Object.entries(localStorage)
        .filter(([namespaceKey, _]) => namespaceKey.startsWith(`${krdNamespace}.`))
        .forEach(([namespaceKey, localConfigSection]) => {
          const namespace = localConfigGetKey(namespaceKey);
          const localSectionMap = jsonToMap(JSON.parse(localConfigSection));

          userConfig[namespace] = localSectionMap;
        });
    }
    return userConfig
  };

export { krdNamespace, localConfigGetKey, localConfigSet, mapStringify, jsonToMap, isUrlValid, isBatchIdValid, localConfigImport };