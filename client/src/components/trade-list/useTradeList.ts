import { useEffect, useMemo, useState } from "react";

import {
  STORAGE_KEY_APART_LIST,
  STORAGE_KEY_FILTER,
  STORAGE_KEY_ORDER,
} from "../../constants/storageKeys";
import { FilterType } from "../../interfaces/Filter";
import { OrderType } from "../../interfaces/Order";
import { SearchFormType } from "../../interfaces/SearchForm";
import useTradeListQuery, { TradeItem } from "../../queries/useTradeListQuery";
import { useSearchFormValue } from "../../stores/searchFormStore";
import { getValue, setValue } from "../../utils/storageUtils";
import {
  createSavedTradeItemValue,
  filterItems,
  sliceItems,
  sortItems,
} from "../../utils/tradeItemUtils";

interface Return {
  isLoading: boolean;
  order: OrderType;
  search: SearchFormType;
  filter: FilterType;
  page: number;
  count: number;
  list: TradeItem[];
  savedList: string[];

  onChangeOrder: (column: OrderType[0]) => void;
  onChangePage: (page: number) => void;
  onClickList: (item: TradeItem) => void;
  onChangeApartName: (apartName: string) => void;
  onToggleOnlyBaseSize: () => void;
  onToggleOnlySavedList: () => void;
}

const PER_PAGE = 15;

const useTradeList = (): Return => {
  const search = useSearchFormValue();
  const { isLoading, data } = useTradeListQuery();

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(
    getValue(STORAGE_KEY_ORDER) ?? ["tradeDate", "desc"]
  );
  const [savedList, setSavedList] = useState<string[]>(
    getValue(STORAGE_KEY_APART_LIST) ?? []
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
        cityCode: search.cityCode,
        savedList,
        filter,
      }),
    [data?.list, search.cityCode, savedList, filter]
  );

  const list = useMemo(() => {
    const sortedItems = sortItems(filteredItems, order);

    return sliceItems(sortedItems, {
      page,
      perPage: PER_PAGE,
    });
  }, [filteredItems, order, page]);

  const count = useMemo(() => filteredItems.length, [filteredItems]);

  useEffect(() => setValue(STORAGE_KEY_ORDER, order), [order]);
  useEffect(() => setValue(STORAGE_KEY_APART_LIST, savedList), [savedList]);
  useEffect(() => setValue(STORAGE_KEY_FILTER, filter), [filter]);

  const onChangeOrder = (column: OrderType[0]) =>
    setOrder([
      column,
      order[0] === column ? (order[1] === "asc" ? "desc" : "asc") : "asc",
    ]);

  const onClickList = (item: TradeItem) => {
    const target = createSavedTradeItemValue({ cityCode: search.cityCode, ...item });
    const isSavedItem = savedList.some((savedItem) => savedItem === target);

    if (isSavedItem) {
      setSavedList(savedList.filter((savedItem) => savedItem !== target));
    } else {
      setSavedList([...savedList, target]);
    }
  };

  const onChangePage = (page: number) => setPage(page);

  const onChangeApartName = (apartName: string) => {
    setFilter({ ...filter, apartName });
    setPage(1);
  };

  const onToggleOnlyBaseSize = () => {
    setFilter({
      ...filter,
      onlyBaseSize: !filter.onlyBaseSize,
    });
    setPage(1);
  };

  const onToggleOnlySavedList = () => {
    setFilter({
      ...filter,
      onlySavedList: !filter.onlySavedList,
    });
    setPage(1);
  };

  return {
    isLoading,
    order,
    search,
    filter,
    page,
    count,
    list,
    savedList,
    onChangeOrder,
    onChangePage,
    onClickList,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useTradeList;
