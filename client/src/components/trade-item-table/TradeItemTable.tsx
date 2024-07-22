import { FC, ReactNode, useMemo, useState } from "react";

import cx from "classnames";
import useTradeListQuery, { TradeItem } from "../../queries/useTradeListQuery";
import {
  filterItems,
  parseToAmountText,
  parseToAreaSize,
  parseToFlatSize,
  parseToFloorText,
  sliceItems,
  sortItems,
} from "../../utils/tradeItemUtils";

import Pagination from "../pagination/Pagination";

import styles from "./TradeItemTable.module.css";
import { getValue } from "../../utils/storageUtils";
import { STORAGE_KEY_ORDER } from "../../constants/storageKeys";
import { OrderType } from "../../interfaces/Order";

import { useSearchFormValue } from "../../stores/searchFormStore";
import { useFilterFormValue } from "../../stores/filterFormStore";

interface TradeItemTableProps {}

const PER_PAGE = 15;

const TradeItemTable: FC<TradeItemTableProps> = () => {
  const search = useSearchFormValue();
  const filter = useFilterFormValue();

  const [state, setState] = useState<{ page: number; order: OrderType }>({
    page: 1,
    order: getValue(STORAGE_KEY_ORDER) ?? ["date", "desc"],
  });

  const { isLoading, data } = useTradeListQuery();

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
    const sortedItems = sortItems({ items: filteredItems, order: state.order });

    return sliceItems({
      items: sortedItems,
      page: state.page,
      perPage: PER_PAGE,
    });
  }, [filteredItems, state.order, state.page]);

  const onChangeOrder = (column: keyof TradeItem) =>
    setState({
      ...state,
      order: [
        column,
        state.order[0] === column
          ? state.order[1] === "asc"
            ? "desc"
            : "asc"
          : "asc",
      ],
    });

  const onChangePage = (page: number) => setState({ ...state, page });

  const createHeaderCell = (key: keyof TradeItem, label: string) => (
    <div>
      <button onClick={() => onChangeOrder(key)}>
        {label}
        {state.order[0] === key && (
          <span className={styles[state.order[1]]}>▾</span>
        )}
      </button>
    </div>
  );

  const createBodyCell = (label: ReactNode) => <div>{label}</div>;

  if (isLoading) {
    return <div className={styles.loading}>조회중...</div>;
  }

  if (!data || data.list.length === 0) {
    return null;
  }

  return (
    <div className={styles.tradeItemTable}>
      <div className={styles.header}>
        {createHeaderCell("date", "거래일")}
        {createHeaderCell("name", "아파트명")}
        {createHeaderCell("size", "평수")}
        {createHeaderCell("floor", "층")}
        {createHeaderCell("amount", "거래가격")}
        {createHeaderCell("maxAmount", "신고가")}
      </div>

      <div className={styles.body}>
        {list.map((item, i) => (
          <div
            key={i}
            className={cx(styles.row, {
              [styles.active]: false,
            })}
            onClick={() => {}}
          >
            {createBodyCell(<>{item.date}</>)}
            {createBodyCell(<>{item.name}</>)}
            {createBodyCell(
              <>
                {parseToFlatSize(item.size)}평
                <small>({parseToAreaSize(item.size)}㎡)</small>
              </>
            )}
            {createBodyCell(<>{parseToFloorText(item.floor)}</>)}
            {createBodyCell(<>{parseToAmountText(item.amount)}</>)}
            {createBodyCell(<>{parseToAmountText(item.maxAmount)}</>)}
          </div>
        ))}
      </div>

      {data.count > PER_PAGE && (
        <div className={styles.pagination}>
          <Pagination
            per={PER_PAGE}
            total={data.count}
            current={state.page}
            onChange={onChangePage}
          />
        </div>
      )}
    </div>
  );
};

export default TradeItemTable;
