import cityData from "../jsons/cityCode.json";

export const getFirstCityName = (): string => cityData[0].name;

export const getFirstCityCode = (): string => cityData[0].children[0].code;

export const getCityNameItems = (): string[] => cityData.map((item) => item.name);

export const getCityCodeItems = (cityName: string): { code: string; name: string }[] =>
  cityData.find((item) => item.name === cityName)?.children ?? [];

export const getCityNameWithCode = (cityCode: string): string =>
  cityData.find((item) => item.children.some((child) => child.code === cityCode))?.name ??
  "";

export const getCityCodeWithCode = (cityCode: string): string =>
  cityData
    .reduce(
      (acc, item) => [...acc, ...item.children],
      [] as { code: string; name: string }[]
    )
    .find((item) => item.code === cityCode)?.name ?? "";
