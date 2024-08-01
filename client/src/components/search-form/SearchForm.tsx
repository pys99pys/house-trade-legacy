import { FC } from "react";

import { getCityCodeItems, getCityNameItems } from "../../utils/cityDataUtils";
import Button from "../button/Button";
import Input from "../input/Input";
import Select from "../select/Select";
import styles from "./SearchForm.module.css";
import useSearchForm from "./useSearchForm";

interface SearchFormProps {}

const SearchForm: FC<SearchFormProps> = () => {
  const {
    form,
    registered,
    favoriteList,
    onChangeCityName,
    onChangeCityCode,
    onChangeYearMonth,
    onRegistFavorite,
    onRemoveFavorite,
    onClickFavorite,
    onSubmit,
  } = useSearchForm();

  return (
    <div className={styles.searchForm}>
      <form onSubmit={onSubmit}>
        <Select
          width="8rem"
          value={form.cityName}
          placeholder="시/도"
          options={getCityNameItems().map((item) => ({
            label: item,
            value: item,
          }))}
          onChange={onChangeCityName}
        />

        <Select
          width="12rem"
          value={form.cityCode}
          placeholder="시/군/구"
          options={getCityCodeItems(form.cityName).map((item) => ({
            label: item.name,
            value: item.code,
          }))}
          onChange={onChangeCityCode}
        />

        <Input width="8rem" value={form.yearMonth} onChange={onChangeYearMonth} />

        <Button color="primary" onClick={onSubmit}>
          검색
        </Button>

        {registered && (
          <Button color="red" onClick={onRemoveFavorite}>
            삭제
          </Button>
        )}

        {!registered && (
          <Button color="yellow" onClick={onRegistFavorite}>
            즐겨찾기
          </Button>
        )}
      </form>

      <ul className={styles.favoriteList}>
        {favoriteList.map((item) => (
          <Button
            key={item.cityCode}
            size="xsmall"
            onClick={() => onClickFavorite(item.cityCode)}
          >
            {item.label}
          </Button>
        ))}
      </ul>
    </div>
  );
};

export default SearchForm;
