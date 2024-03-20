interface jsonDataType {
  dataType: string;
}
interface jsonMapType extends jsonDataType {
  data: Iterable<readonly [unknown, unknown]>;
}
interface jsonBigIntType extends jsonDataType {
  data: string;
}

const replacer = (key: unknown, value: unknown): unknown => {
  if (typeof value === "bigint") return { dataType: "BigInt", data: value.toString() };
  if (value instanceof Map) return { dataType: "Map", data: [...value] };
  return value;
};

const reviver = (key: unknown, value: unknown): unknown => {
  if (typeof value === "object") {
    const dataType = (value as jsonDataType)?.dataType;
    if (dataType === "BigInt") return BigInt((value as jsonBigIntType)?.data);
    if (dataType === "Map") return new Map((value as jsonMapType)?.data);
  }
  return value;
};

const jsonMapStringify = (obj: unknown): string => JSON.stringify(obj, replacer);

const jsonMapParse = (json: string): unknown => JSON.parse(json, reviver);

export { jsonMapStringify, jsonMapParse };
