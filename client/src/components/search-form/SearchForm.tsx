import { FC, useEffect, useState } from "react";

import { STORAGE_KEY_FAVORITE_LIST } from "../../constants/storageKeys";
import { SearchFormType } from "../../interfaces/SearchForm";
import sigunguCodeObserver from "../../observers/sigunguCodeObserver";
import { useSetSearchFormState } from "../../stores/searchFormStore";
import {
  getCityCodeItems,
  getCityNameItems,
  getCityNameWithCode,
  getFirstCityCode,
  getFirstCityName,
} from "../../utils/cityDataUtils";
import { getBeforeYearMonth } from "../../utils/dateUtils";
import { getValue } from "../../utils/storageUtils";
import Button from "../button/Button";
import Input from "../input/Input";
import Select from "../select/Select";
import styles from "./SearchForm.module.css";

interface SearchFormProps {}

const SearchForm: FC<SearchFormProps> = () => {
  const setSearchFormStore = useSetSearchFormState();

  const [registeredFavorite, setRegisteredFavorite] = useState(false);
  const [form, setForm] = useState<SearchFormType>({
    cityName: getFirstCityName(),
    cityCode: getFirstCityCode(),
    yearMonth: getBeforeYearMonth(),
  });

  useEffect(() => {
    sigunguCodeObserver.regist("search-form", (payload) => {
      const afterForm = {
        cityName: getCityNameWithCode(payload.cityCode),
        cityCode: payload.cityCode,
        yearMonth: form.yearMonth,
      };

      setForm(afterForm);
      setSearchFormStore(afterForm);
    });
  }, []);

  useEffect(() => {
    const favoriteList = getValue(STORAGE_KEY_FAVORITE_LIST) ?? [];

    setRegisteredFavorite(favoriteList.some((item) => item === form.cityCode));
  }, [form.cityCode]);

  function handleChangeCityName(cityName: string) {
    const firstSigungu = getCityCodeItems(cityName)[0].code;

    setForm({ ...form, cityName, cityCode: firstSigungu });
  }

  function handleChangeCityCode(cityCode: string) {
    setForm({ ...form, cityCode: cityCode });
  }

  function handleChangeYearMonth(value: string) {
    const yearMonth = value.slice(0, 6).replace(/[^0-9]/g, "");

    setForm({ ...form, yearMonth });
  }

  function handleClickSubmit() {
    setSearchFormStore(form);
  }

  function handleClickFavoriteAdd() {
    sigunguCodeObserver.notify("search-form", {
      action: "add",
      cityCode: form.cityCode,
    });

    setRegisteredFavorite(true);
  }

  function handleClickFavoriteRemove() {
    sigunguCodeObserver.notify("search-form", {
      action: "remove",
      cityCode: form.cityCode,
    });

    setRegisteredFavorite(false);
  }

  return (
    <div className={styles.searchForm}>
      <Select
        width="8rem"
        value={form.cityName}
        placeholder="시/도"
        options={getCityNameItems().map((item) => ({
          label: item,
          value: item,
        }))}
        onChange={handleChangeCityName}
      />

      <Select
        width="12rem"
        value={form.cityCode}
        placeholder="시/군/구"
        options={getCityCodeItems(form.cityName).map((item) => ({
          label: item.name,
          value: item.code,
        }))}
        onChange={handleChangeCityCode}
      />

      <Input width="8rem" value={form.yearMonth} onChange={handleChangeYearMonth} />

      <Button color="primary" onClick={handleClickSubmit}>
        검색
      </Button>

      {registeredFavorite && (
        <Button color="red" onClick={handleClickFavoriteRemove}>
          삭제
        </Button>
      )}

      {!registeredFavorite && (
        <Button color="yellow" onClick={handleClickFavoriteAdd}>
          즐겨찾기
        </Button>
      )}
    </div>
  );
};

export default SearchForm;
