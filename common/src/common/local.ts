const localNamespace = "kredeum";
const localConfigNamespace = (namespace: string): string => `${localNamespace}.${namespace}`;

const localStorageDefined = (): boolean => typeof localStorage !== "undefined";

const _localStorage = localStorageDefined() ? localStorage : null;

const localStorageGet = (field: string): string => _localStorage?.getItem(field) || "";

const localStorageSet = (field: string, value: string): void => _localStorage?.setItem(field, value);

const localStorageClear = (): void => _localStorage?.clear();

const localStorageKey = (index: number): string => _localStorage?.key(index) || "";

const localStorageRemove = (key: string): void => _localStorage?.removeItem(key);

const localStorageInit = (): void => {
  // console.log("localStorageInit");
  if (!localStorageGet("KEY")) localStorageSet("KEY", "KEY_DEFAULT");
};

const localStorageKeys = (startsWith: string): string[] =>
  Object.keys(localStorage).filter((key) => key.startsWith(startsWith));

export {
  localNamespace,
  localStorageKeys,
  localConfigNamespace,
  localStorageDefined,
  localStorageSet,
  localStorageGet,
  localStorageKey,
  localStorageInit,
  localStorageRemove,
  localStorageClear
};
