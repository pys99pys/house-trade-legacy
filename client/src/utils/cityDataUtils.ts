import cityCode from "../jsons/cityCode.json";

export const getFirstSido = (): string => cityCode[0].name;

export const getFirstCode = (): string => cityCode[0].children[0].code;

export const getSidoItems = (): string[] => cityCode.map((item) => item.name);

export const getCodeItems = (sido: string): { code: string; name: string }[] =>
  cityCode.find((item) => item.name === sido)?.children ?? [];

export const getSidoWithCode = (code: string): string =>
  cityCode.find((item) => item.children.some((child) => child.code === code))
    ?.name ?? "";

export const getSigunguWithCode = (code: string): string =>
  cityCode
    .reduce(
      (acc, item) => [...acc, ...item.children],
      [] as { code: string; name: string }[]
    )
    .find((item) => item.code === code)?.name ?? "";
