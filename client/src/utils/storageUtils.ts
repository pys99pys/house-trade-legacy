import {
  STORAGE_KEY_APART_LIST,
  STORAGE_KEY_FAVORITE_LIST,
  STORAGE_KEY_FILTER,
  STORAGE_KEY_ORDER,
} from "../constants/storageKeys";
import { FilterType } from "../interfaces/Filter";
import { OrderType } from "../interfaces/Order";

export const setValue = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getValue = <T extends string>(
  key: T
):
  | (T extends typeof STORAGE_KEY_ORDER
      ? OrderType
      : T extends typeof STORAGE_KEY_FILTER
        ? FilterType
        : T extends typeof STORAGE_KEY_FAVORITE_LIST
          ? string[]
          : T extends typeof STORAGE_KEY_APART_LIST
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
