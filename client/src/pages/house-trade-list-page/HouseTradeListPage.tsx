import { FC } from "react";

import SearchForm from "../../components/search-form/SearchForm";
import TradeList from "../../components/trade-list/TradeList";
import styles from "./HouseTradeListPage.module.css";

interface HouseTradeListPageProps {}

const HouseTradeListPage: FC<HouseTradeListPageProps> = () => {
  return (
    <div className={styles.houseTradeListPage}>
      <SearchForm />

      <div className={styles.tradeList}>
        <TradeList />
      </div>
    </div>
  );
};

export default HouseTradeListPage;
