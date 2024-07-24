import { useEffect } from "react";

import { STORAGE_KEY_FILTER, STORAGE_KEY_ORDER } from "../../constants/storageKeys";
import { setValue } from "../../utils/storageUtils";
import useComponentState from "./useComponentState";

const useComponentEffect = ({ state }: ReturnType<typeof useComponentState>) => {
  useEffect(() => {
    setValue(STORAGE_KEY_ORDER, state.order);
  }, [state.order]);

  useEffect(() => {
    setValue(STORAGE_KEY_FILTER, state.filter);
  }, [state.filter]);
};

export default useComponentEffect;
