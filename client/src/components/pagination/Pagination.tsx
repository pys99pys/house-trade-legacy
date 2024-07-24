import cx from "classnames";
import { FC } from "react";

import styles from "./Pagination.module.css";

interface PaginationProps {
  per: number;
  total: number;
  current: number;
  onChange: (page: number) => void;
}

const MAX = 10;

const Pagination: FC<PaginationProps> = ({ per, total, current, onChange }) => {
  const last = Math.ceil(total / per);
  const start = Math.floor((current - 1) / MAX) * MAX + 1;
  const end = Math.min(start + MAX - 1, last);
  // const count =
  const pageArray = new Array(end - start + 1).fill(null).map((_, i) => start + i);

  return (
    <ul className={styles.pagination}>
      {start > MAX && (
        <>
          <li>
            <button onClick={() => onChange(1)}>1</button>
          </li>
          <li>
            <button onClick={() => onChange(start - 1)}>...</button>
          </li>
        </>
      )}

      {pageArray.map((page) => (
        <li key={page}>
          <button
            className={cx({ [styles.active]: page === current })}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        </li>
      ))}

      {end !== last && (
        <>
          <li>
            <button onClick={() => onChange(end + 1)}>...</button>
          </li>
          <li>
            <button onClick={() => onChange(last)}>{last}</button>
          </li>
        </>
      )}
    </ul>
  );
};

export default Pagination;
