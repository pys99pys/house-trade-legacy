import { FC, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import cx from "classnames";
import useTradeListQuery, { TradeItem } from "../../queries/useTradeListQuery";
import { searchFormState } from "../../stores/searchFormStore";
import { filterFormState } from "../../stores/filterFormStore";
import { getValue, setValue } from "../../utils/storageUtils";
import {
  filterItems,
  getStorageValue,
  parseToAreaSize,
  parseToFlatSize,
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

  return (
    <div className={styles.tradeItemTable}>
      <div className={styles.header}>
        <div>
          <button onClick={() => handleClickHeader("date")}>
            거래일
            {order[0] === "date" && <span className={styles[order[1]]}>▾</span>}
          </button>
        </div>
        <div>
          <button onClick={() => handleClickHeader("name")}>
            아파트명
            {order[0] === "name" && <span className={styles[order[1]]}>▾</span>}
          </button>
        </div>
        <div>
          <button onClick={() => handleClickHeader("size")}>
            평수
            {order[0] === "size" && <span className={styles[order[1]]}>▾</span>}
          </button>
        </div>
        <div>
          <button onClick={() => handleClickHeader("floor")}>
            층
            {order[0] === "floor" && (
              <span className={styles[order[1]]}>▾</span>
            )}
          </button>
        </div>
        <div>
          <button onClick={() => handleClickHeader("amount")}>
            거래가격
            {order[0] === "amount" && (
              <span className={styles[order[1]]}>▾</span>
            )}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {list.map((item, i) => (
          <div
            key={i}
            className={cx(styles.row, {
              [styles.active]: savedList.some(
                (savedItem) =>
                  savedItem === getStorageValue(search.sigungu, item.name)
              ),
            })}
            onClick={() => handleClickRow(item)}
          >
            <div>{item.date}</div>
            <div>{item.name}</div>
            <div>
              {parseToFlatSize(item.size)}평
              <small>({parseToAreaSize(item.size)}㎡)</small>
            </div>
            <div>{item.floor}층</div>
            <div>{item.amount / 100000000}억원</div>
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
