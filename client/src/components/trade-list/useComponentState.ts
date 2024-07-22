import { useMemo, useState } from "react";
import { OrderType } from "../../interfaces/Order";
import { getValue } from "../../utils/storageUtils";
import {
  STORAGE_KEY_FILTER,
  STORAGE_KEY_ORDER,
} from "../../constants/storageKeys";
import { filterItems, sliceItems, sortItems } from "../../utils/tradeItemUtils";
import useTradeListQuery, { TradeItem } from "../../queries/useTradeListQuery";

import { useSearchFormValue } from "../../stores/searchFormStore";
import { FilterType } from "../../interfaces/Filter";

type State = FilterType & {
  page: number;
  order: OrderType;
};

type SetState = {
  setState: (state: Partial<State>) => void;
};

type Return = State &
  SetState & {
    isLoading: boolean;
    count: number;
    filteredCount: number;
    list: TradeItem[];
  };

const PER_PAGE = 15;
const savedOrder = getValue(STORAGE_KEY_ORDER);
const savedFilter = getValue(STORAGE_KEY_FILTER);

const useComponentState = (): Return => {
  const search = useSearchFormValue();
  const { isLoading, data } = useTradeListQuery();

  const [state, setStateAction] = useState<State>({
    page: 1,
    order: savedOrder ?? ["date", "desc"],
    apartName: savedFilter?.apartName ?? "",
    onlyBaseSize: savedFilter?.onlyBaseSize ?? false,
    onlySavedList: savedFilter?.onlySavedList ?? false,
  });

  const setState = (afterState: Partial<State>) =>
    setStateAction({ ...state, ...afterState });

  const filteredItems = useMemo(
    () =>
      filterItems(data?.list ?? [], {
        code: search.sigungu,
        savedItems: [],
        filter: state,
      }),
    [data?.list, search.sigungu, state]
  );

  const list = useMemo(() => {
    const sortedItems = sortItems(filteredItems, state.order);

    return sliceItems(sortedItems, {
      page: state.page,
      perPage: PER_PAGE,
    });
  }, [filteredItems, state.order, state.page]);

  const count = useMemo(() => data?.count ?? 0, [data?.count]);
  const filteredCount = useMemo(() => filteredItems.length, [filteredItems]);

  return {
    ...state,
    isLoading,
    count,
    filteredCount,
    list,
    setState,
  };
};

export default useComponentState;
