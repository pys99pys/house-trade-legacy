import { OrderType } from "../../interfaces/Order";
import useTradeListState from "./useComponentState";

interface Return {
  onChangeOrder: (column: OrderType[0]) => void;
  onChangePage: (page: number) => void;
  onChangeApartName: (apartName: string) => void;
  onToggleOnlyBaseSize: () => void;
  onToggleOnlySavedList: () => void;
}

const useComponentAction = ({
  state,
  action,
}: ReturnType<typeof useTradeListState>): Return => {
  const onChangeOrder = (column: OrderType[0]) =>
    action.setOrder([
      column,
      state.order[0] === column ? (state.order[1] === "asc" ? "desc" : "asc") : "asc",
    ]);

  const onChangePage = (page: number) => action.setPage(page);

  const onChangeApartName = (apartName: string) => {
    action.setFilter({ ...state.filter, apartName });
    action.setPage(1);
  };

  const onToggleOnlyBaseSize = () => {
    action.setFilter({
      ...state.filter,
      onlyBaseSize: !state.filter.onlyBaseSize,
    });
    action.setPage(1);
  };

  const onToggleOnlySavedList = () => {
    action.setFilter({
      ...state.filter,
      onlySavedList: !state.filter.onlySavedList,
    });
    action.setPage(1);
  };

  return {
    onChangeOrder,
    onChangePage,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useComponentAction;
