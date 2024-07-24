import { FC, ReactNode } from "react";

import cx from "classnames";
import { TradeItem } from "../../queries/useTradeListQuery";
import {
  parseToAmountText,
  parseToAreaSize,
  parseToFlatSize,
  parseToFloorText,
} from "../../utils/tradeItemUtils";

import Pagination from "../pagination/Pagination";

import styles from "./TradeList.module.css";

import useComponentState from "./useComponentState";
import useComponentAction from "./useComponentAction";
import useComponentEffect from "./useComponentEffect";
import Input from "../input/Input";
import Button from "../button/Button";

interface TradeItemTableProps {}

const PER_PAGE = 15;

const TradeItemTable: FC<TradeItemTableProps> = () => {
  const result = useComponentState();
  const action = useComponentAction(result);

  useComponentEffect(result);

  const { state } = result;

  const createHeaderCell = (key: keyof TradeItem, label: string) => (
    <div className={styles.headerCell}>
      <button
        className={styles.headerButton}
        onClick={() => action.onChangeOrder(key)}
      >
        {label}
        {state.order[0] === key && (
          <span className={styles[state.order[1]]}>▾</span>
        )}
      </button>
    </div>
  );

  const createBodyCell = (label: ReactNode) => (
    <div className={styles.rowCell}>{label}</div>
  );

  return (
    <>
      <div className={styles.filterForm}>
        <div className={styles.summary}>
          검색결과: <strong>{state.filteredCount}</strong>건
        </div>

        <div className={styles.buttonList}>
          <Input
            size="small"
            placeholder="아파트명"
            value={state.filter.apartName}
            onChange={action.onChangeApartName}
          />
          <Button
            size="small"
            color={state.filter.onlyBaseSize ? "primary" : "default"}
            onClick={action.onToggleOnlyBaseSize}
          >
            국민평수
          </Button>
          <Button
            size="small"
            color={state.filter.onlySavedList ? "primary" : "default"}
            onClick={action.onToggleOnlySavedList}
          >
            저장 목록
          </Button>
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          {createHeaderCell("date", "거래일")}
          {createHeaderCell("name", "아파트명")}
          {createHeaderCell("size", "평수")}
          {createHeaderCell("floor", "층")}
          {createHeaderCell("amount", "거래가격")}
          {createHeaderCell("maxAmount", "신고가")}
        </div>

        <div className={styles.body}>
          {state.isLoading && <div className={styles.loading}>조회중...</div>}

          {!state.isLoading && state.list.length === 0 && (
            <div className={styles.empty}>데이터 없음</div>
          )}

          {!state.isLoading &&
            state.list.length > 0 &&
            state.list.map((item, i) => (
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

        {state.filteredCount > PER_PAGE && (
          <div className={styles.pagination}>
            <Pagination
              per={PER_PAGE}
              total={state.filteredCount}
              current={state.page}
              onChange={action.onChangePage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TradeItemTable;
