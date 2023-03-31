const replacer = (key: unknown, value: unknown): unknown => {
  if (typeof value === "bigint") return { dataType: "bigint", value: `${value.toString()}` };
  if (value instanceof Map) return { dataType: "map", value: [...value] };
  return value;
};

const reviver = (key: unknown, value: unknown): unknown => {
  if (!(typeof value === "object" && value && "dataType" in value && "value" in value)) return value;
  if (value.dataType === "bigint") return BigInt(value.value as string);
  if (value.dataType === "map") return new Map(value.value as Map<unknown, unknown>);
  return value;
};

const jsonPlusStringify = (data: unknown): string => JSON.stringify(data, replacer);
const jsonPlusParse = (json: string): unknown => JSON.parse(json, reviver);

export { jsonPlusStringify, jsonPlusParse };
