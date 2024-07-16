import { FC } from "react";
import TradeItemTable from "../../components/trade-item-table/TradeItemTable";
import SearchForm from "../../components/search-form/SearchForm";
import styles from "./HouseTradeListPage.module.css";
import FavoriteList from "../../components/favorite-list/FavoriteList";
import FilterForm from "../../components/filter-form/FilterForm";

interface HouseTradeListPageProps {}

const HouseTradeListPage: FC<HouseTradeListPageProps> = () => {
  return (
    <div className={styles.houseTradeListPage}>
      <SearchForm />
      <div className={styles.favoriteList}>
        <FavoriteList />
      </div>
      <div className={styles.filterForm}>
        <FilterForm />
      </div>
      <TradeItemTable />
    </div>
  );
};

export default HouseTradeListPage;
