interface jsonMapType {
  dataType: string;
  value: Iterable<readonly [unknown, unknown]>;
}

const replacer = (key: unknown, value: unknown): unknown =>
  value instanceof Map ? { dataType: "Map", value: [...value] } : value;

const reviver = (key: unknown, value: unknown): unknown =>
  typeof value === "object" && (value as jsonMapType)?.dataType === "Map"
    ? new Map((value as jsonMapType)?.value)
    : value;

const jsonMapStringify = (obj: unknown): string => JSON.stringify(obj, replacer);

const jsonMapParse = (json: string): unknown => JSON.parse(json, reviver);

export { jsonMapStringify, jsonMapParse };
