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

interface State {
  page: number;
  order: OrderType;
  filter: FilterType;
}

interface QueryState {
  isLoading: boolean;
  count: number;
  filteredCount: number;
  list: TradeItem[];
}

interface Action {
  setPage: (page: number) => void;
  setOrder: (page: OrderType) => void;
  setFilter: (filter: FilterType) => void;
}

interface Return {
  state: State & QueryState;
  action: Action;
}

const PER_PAGE = 15;

const useComponentState = (): Return => {
  const search = useSearchFormValue();
  const { isLoading, data } = useTradeListQuery();

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(
    getValue(STORAGE_KEY_ORDER) ?? ["date", "desc"]
  );
  const [filter, setFilter] = useState<FilterType>(
    getValue(STORAGE_KEY_FILTER) ?? {
      apartName: "",
      onlyBaseSize: false,
      onlySavedList: false,
    }
  );

  const filteredItems = useMemo(
    () =>
      filterItems(data?.list ?? [], {
        code: search.sigungu,
        savedItems: [],
        filter,
      }),
    [data?.list, search.sigungu, filter]
  );

  const list = useMemo(() => {
    const sortedItems = sortItems(filteredItems, order);

    return sliceItems(sortedItems, {
      page,
      perPage: PER_PAGE,
    });
  }, [filteredItems, order, page]);

  const count = useMemo(() => data?.count ?? 0, [data?.count]);
  const filteredCount = useMemo(() => filteredItems.length, [filteredItems]);

  return {
    state: { page, order, filter, count, filteredCount, list, isLoading },
    action: { setPage, setOrder, setFilter },
  };
};

export default useComponentState;
