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
  order,
  onlyBaseSize,
  onlySavedList,
  setState,
}: ReturnType<typeof useTradeListState>): Return => {
  const onChangeOrder = (column: OrderType[0]) =>
    setState({
      order: [
        column,
        order[0] === column ? (order[1] === "asc" ? "desc" : "asc") : "asc",
      ],
    });

  const onChangePage = (page: number) => setState({ page });

  const onChangeApartName = (apartName: string) =>
    setState({ apartName, page: 1 });

  const onToggleOnlyBaseSize = () =>
    setState({ onlyBaseSize: !onlyBaseSize, page: 1 });

  const onToggleOnlySavedList = () =>
    setState({ onlySavedList: !onlySavedList, page: 1 });

  return {
    onChangeOrder,
    onChangePage,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useComponentAction;
