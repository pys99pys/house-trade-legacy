import { FormEvent, useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_FAVORITE_LIST } from "../../constants/storageKeys";
import { FavoriteItem, SearchFormType } from "../../interfaces/SearchForm";
import { useSetSearchFormState } from "../../stores/searchFormStore";
import {
  getCityCodeWithCode,
  getCityNameWithCode,
  getFirstCityCode,
  getFirstCityName,
} from "../../utils/cityDataUtils";
import { getBeforeYearMonth } from "../../utils/dateUtils";
import { getValue, setValue } from "../../utils/storageUtils";

interface Return {
  form: SearchFormType;
  favoriteList: FavoriteItem[];
  registered: boolean;
  onChangeCityName: (cityName: string) => void;
  onChangeCityCode: (cityCode: string) => void;
  onChangeYearMonth: (yearMonth: string) => void;
  onRegistFavorite: () => void;
  onRemoveFavorite: () => void;
  onClickFavorite: (cityCode: string) => void;
  onSubmit: (e?: FormEvent) => void;
}

const useSearchForm = (): Return => {
  const setSearchFormStore = useSetSearchFormState();

  const [favoriteCityCodes, setFavoriteCityCodes] = useState<string[]>(
    getValue(STORAGE_KEY_FAVORITE_LIST) ?? []
  );
  const [form, setForm] = useState<SearchFormType>({
    cityName: getFirstCityName(),
    cityCode: getFirstCityCode(),
    yearMonth: getBeforeYearMonth(),
  });

  const favoriteList = useMemo(
    () =>
      favoriteCityCodes
        .map((cityCode) => ({
          cityCode,
          label: `${getCityNameWithCode(cityCode)} ${getCityCodeWithCode(cityCode)}`,
        }))
        .sort((a, b) => (a.label > b.label ? 1 : -1)),
    [favoriteCityCodes]
  );

  const registered = useMemo(
    () => favoriteCityCodes.some((item) => item === form.cityCode),
    [favoriteCityCodes, form.cityCode]
  );

  useEffect(() => {
    setValue(STORAGE_KEY_FAVORITE_LIST, favoriteCityCodes);
  }, [favoriteCityCodes]);

  const onChangeCityName = (cityName: string) => setForm({ ...form, cityName });

  const onChangeCityCode = (cityCode: string) => setForm({ ...form, cityCode });

  const onChangeYearMonth = (yearMonth: string) =>
    setForm({
      ...form,
      yearMonth: yearMonth.slice(0, 6).replace(/[^0-9]/g, ""),
    });

  const onRegistFavorite = () => {
    setFavoriteCityCodes([...favoriteCityCodes, form.cityCode]);
  };

  const onRemoveFavorite = () => {
    setFavoriteCityCodes(favoriteCityCodes.filter((item) => item !== form.cityCode));
  };

  const onClickFavorite = (cityCode: string) => {
    const cityName = getCityNameWithCode(cityCode);
    const afterForm = { ...form, cityName, cityCode };

    setForm(afterForm);
    setSearchFormStore(afterForm);
  };

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setSearchFormStore(form);
  };

  return {
    form,
    favoriteList,
    registered,
    onChangeCityName,
    onChangeCityCode,
    onChangeYearMonth,
    onRegistFavorite,
    onRemoveFavorite,
    onClickFavorite,
    onSubmit,
  };
};

export default useSearchForm;
