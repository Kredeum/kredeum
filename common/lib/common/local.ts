const localStorageDefined = (): boolean => typeof localStorage !== "undefined";

const _localStorage = localStorageDefined() ? localStorage : null;

const localStorageGet = (field: string): string | null => _localStorage?.getItem(field) || null;

const localStorageSet = (field: string, value: string): void => _localStorage?.setItem(field, value);

const localStorageClear = (): void => _localStorage?.clear();

const localStorageKey = (index: number): string => _localStorage?.key(index) || "";

const localStorageLength = (): number => _localStorage?.length || 0;

const localStorageRemove = (key: string): void => _localStorage?.removeItem(key);

const localStorageInit = (): void => {
  console.log("localStorageInit");
  if (!localStorageGet("KEY")) localStorageSet("KEY", "KEY_DEFAULT");
};

export {
  localStorageDefined,
  localStorageSet,
  localStorageGet,
  localStorageKey,
  localStorageInit,
  localStorageRemove,
  localStorageClear,
  localStorageLength
};
