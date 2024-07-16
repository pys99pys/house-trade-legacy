import { FC, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { searchFormState } from "../../stores/searchFormStore";
import { SearchFormType } from "../../interfaces/SearchForm";
import sigunguCodeObserver from "../../observers/sigunguCodeObserver";
import {
  getFirstSido,
  getFirstCode,
  getSidoItems,
  getCodeItems,
  getSidoWithCode,
} from "../../utils/cityDataUtils";
import { getBeforeYearMonth } from "../../utils/dateUtils";
import { getValue } from "../../utils/storageUtils";
import { FAVORITE_LIST } from "../../constants/storageKeys";
import Select from "../select/Select";
import Input from "../input/Input";
import Button from "../button/Button";

import styles from "./SearchForm.module.css";

interface SearchFormProps {}

const SearchForm: FC<SearchFormProps> = () => {
  const setSearchFormStore = useSetRecoilState(searchFormState);

  const [registeredFavorite, setRegisteredFavorite] = useState(false);
  const [form, setForm] = useState<SearchFormType>({
    sido: getFirstSido(),
    sigungu: getFirstCode(),
    yearMonth: getBeforeYearMonth(),
  });

  useEffect(() => {
    sigunguCodeObserver.regist("search-form", (payload) => {
      const afterForm = {
        sido: getSidoWithCode(payload.code),
        sigungu: payload.code,
        yearMonth: form.yearMonth,
      };

      setForm(afterForm);
      setSearchFormStore(afterForm);
    });
  }, []);

  useEffect(() => {
    const favoriteList = getValue(FAVORITE_LIST) ?? [];

    setRegisteredFavorite(favoriteList.some((item) => item === form.sigungu));
  }, [form.sigungu]);

  function handleChangeSido(sido: string) {
    const firstSigungu = getCodeItems(sido)[0].code;

    setForm({ ...form, sido, sigungu: firstSigungu });
  }

  function handleChangeSigungu(sigungu: string) {
    setForm({ ...form, sigungu });
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
      code: form.sigungu,
    });

    setRegisteredFavorite(true);
  }

  function handleClickFavoriteRemove() {
    sigunguCodeObserver.notify("search-form", {
      action: "remove",
      code: form.sigungu,
    });

    setRegisteredFavorite(false);
  }

  return (
    <div className={styles.searchForm}>
      <Select
        width="8rem"
        value={form.sido}
        placeholder="시/도"
        options={getSidoItems().map((item) => ({ label: item, value: item }))}
        onChange={handleChangeSido}
      />

      <Select
        width="12rem"
        value={form.sigungu}
        placeholder="시/군/구"
        options={getCodeItems(form.sido).map((item) => ({
          label: item.name,
          value: item.code,
        }))}
        onChange={handleChangeSigungu}
      />

      <Input
        width="8rem"
        value={form.yearMonth}
        onChange={handleChangeYearMonth}
      />

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
