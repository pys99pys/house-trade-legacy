import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import cx from "classnames";
import useTradeListQuery, { TradeItem } from "../../queries/useTradeListQuery";
import { searchFormState } from "../../stores/searchFormStore";
import { filterFormState } from "../../stores/filterFormStore";
import { getValue, setValue } from "../../utils/storageUtils";
import {
  filterItems,
  getStorageValue,
  parseToAmountText,
  parseToAreaSize,
  parseToFlatSize,
  parseToFloorText,
  sliceItems,
  sortItems,
} from "../../utils/tradeItemUtils";
import { APART_LIST, ORDER } from "../../constants/storageKeys";
import Pagination from "../pagination/Pagination";

import styles from "./TradeItemTable.module.css";

interface TradeItemTableProps {}

const PER_PAGE = 15;

const TradeItemTable: FC<TradeItemTableProps> = () => {
  const search = useRecoilValue(searchFormState);
  const filter = useRecoilValue(filterFormState);
  const { isLoading, data } = useTradeListQuery();

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<[keyof TradeItem, "asc" | "desc"]>(
    getValue(ORDER) ?? ["date", "desc"]
  );
  const [savedList, setSavedList] = useState<string[]>(
    getValue(APART_LIST) ?? []
  );

  const filteredItems = useMemo(
    () =>
      filterItems({
        code: search.sigungu,
        items: data?.list ?? [],
        savedItems: savedList,
        filter,
      }),
    [data?.list, search.sigungu, savedList, filter]
  );

  const list = useMemo(() => {
    const sortedItems = sortItems({ items: filteredItems, order });

    return sliceItems({
      items: sortedItems,
      page,
      perPage: PER_PAGE,
    });
  }, [filteredItems, order, page]);

  useEffect(() => {
    setValue(APART_LIST, savedList);
  }, [savedList]);

  useEffect(() => {
    setValue(ORDER, order);
  }, [order]);

  function handleClickHeader(afterOrderColumn: keyof TradeItem) {
    let afterOrderDirection: "asc" | "desc" = "asc";

    if (order[0] === afterOrderColumn) {
      afterOrderDirection = order[1] === "asc" ? "desc" : "asc";
    }

    setOrder([afterOrderColumn, afterOrderDirection]);
  }

  function handleClickRow(item: TradeItem) {
    const value = getStorageValue(search.sigungu, item.name);
    const target = savedList.find((savedItem) => savedItem === value);

    if (target) {
      setSavedList(savedList.filter((apart) => apart !== value) ?? []);
    } else {
      setSavedList([...savedList, value]);
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>조회중...</div>;
  }

  if (!data) {
    return null;
  }

  const isActived = (item: TradeItem) =>
    savedList.some(
      (savedItem) => savedItem === getStorageValue(search.sigungu, item.name)
    );

  const createHeaderCell = (key: keyof TradeItem, label: string) => (
    <div>
      <button onClick={() => handleClickHeader(key)}>
        {label}
        {order[0] === key && <span className={styles[order[1]]}>▾</span>}
      </button>
    </div>
  );

  const createBodyCell = (label: ReactNode) => <div>{label}</div>;

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
            className={cx(styles.row, { [styles.active]: isActived(item) })}
            onClick={() => handleClickRow(item)}
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

      {filteredItems.length > PER_PAGE && (
        <div className={styles.pagination}>
          <Pagination
            per={PER_PAGE}
            total={filteredItems.length}
            current={page}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default TradeItemTable;
