import { useMemo, useState } from "react";

import { STORAGE_KEY_FILTER, STORAGE_KEY_ORDER } from "../../constants/storageKeys";
import { FilterType } from "../../interfaces/Filter";
import { OrderType } from "../../interfaces/Order";
import useTradeListQuery, { TradeItem } from "../../queries/useTradeListQuery";
import { useSearchFormValue } from "../../stores/searchFormStore";
import { getValue } from "../../utils/storageUtils";
import { filterItems, sliceItems, sortItems } from "../../utils/tradeItemUtils";

interface Return {
  isLoading: boolean;
  order: OrderType;
  filter: FilterType;
  page: number;
  count: number;
  list: TradeItem[];

  onChangeOrder: (column: OrderType[0]) => void;
  onChangePage: (page: number) => void;
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
        savedItems: [],
        filter,
      }),
    [data?.list, search.cityCode, filter]
  );

  const list = useMemo(() => {
    const sortedItems = sortItems(filteredItems, order);

    return sliceItems(sortedItems, {
      page,
      perPage: PER_PAGE,
    });
  }, [filteredItems, order, page]);

  const count = useMemo(() => filteredItems.length, [filteredItems]);

  const onChangeOrder = (column: OrderType[0]) =>
    setOrder([
      column,
      order[0] === column ? (order[1] === "asc" ? "desc" : "asc") : "asc",
    ]);

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
    filter,
    page,
    count,
    list,
    onChangeOrder,
    onChangePage,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useTradeList;
