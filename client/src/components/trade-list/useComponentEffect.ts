import { useEffect } from "react";
import useComponentState from "./useComponentState";
import { setValue } from "../../utils/storageUtils";
import {
  STORAGE_KEY_FILTER,
  STORAGE_KEY_ORDER,
} from "../../constants/storageKeys";

const useComponentEffect = ({
  state,
}: ReturnType<typeof useComponentState>) => {
  useEffect(() => {
    setValue(STORAGE_KEY_ORDER, state.order);
  }, [state.order]);

  useEffect(() => {
    setValue(STORAGE_KEY_FILTER, state.filter);
  }, [state.filter]);
};

export default useComponentEffect;
