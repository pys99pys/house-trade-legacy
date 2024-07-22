import { useEffect } from "react";
import useComponentState from "./useComponentState";
import { setValue } from "../../utils/storageUtils";
import {
  STORAGE_KEY_FILTER,
  STORAGE_KEY_ORDER,
} from "../../constants/storageKeys";

const useComponentEffect = ({
  order,
  apartName,
  onlyBaseSize,
  onlySavedList,
}: ReturnType<typeof useComponentState>) => {
  useEffect(() => {
    setValue(STORAGE_KEY_ORDER, order);
  }, [order]);

  useEffect(() => {
    setValue(STORAGE_KEY_FILTER, {
      apartName,
      onlyBaseSize,
      onlySavedList,
    });
  }, [apartName, onlyBaseSize, onlySavedList]);
};

export default useComponentEffect;
