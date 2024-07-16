import { TradeItem } from "../queries/useTradeListQuery";
import { APART_LIST, FAVORITE_LIST, ORDER } from "../constants/storageKeys";

export const setValue = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getValue = <T extends string>(
  key: T
):
  | (T extends typeof ORDER
      ? [keyof TradeItem, "asc" | "desc"]
      : T extends typeof FAVORITE_LIST
      ? string[]
      : T extends typeof APART_LIST
      ? string[]
      : never)
  | null => {
  try {
    const savedValue = window.localStorage.getItem(key);

    if (!savedValue) {
      throw new Error();
    }

    return JSON.parse(savedValue);
  } catch {
    return null;
  }
};
