import { FC } from "react";
import TradeList from "../../components/trade-list/TradeList";
import SearchForm from "../../components/search-form/SearchForm";
import styles from "./HouseTradeListPage.module.css";
import FavoriteList from "../../components/favorite-list/FavoriteList";

interface HouseTradeListPageProps {}

const HouseTradeListPage: FC<HouseTradeListPageProps> = () => {
  return (
    <div className={styles.houseTradeListPage}>
      <SearchForm />
      <div className={styles.favoriteList}>
        <FavoriteList />
      </div>
      <div className={styles.tradeList}>
        <TradeList />
      </div>
    </div>
  );
};

export default HouseTradeListPage;
