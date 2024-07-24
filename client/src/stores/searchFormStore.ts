import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { SearchFormType } from "../interfaces/SearchForm";

export const searchFormState = atom<SearchFormType>({
  key: "searchFormState",
  default: {
    cityName: "",
    cityCode: "",
    yearMonth: "",
  },
});

export const useSearchFormValue = () => useRecoilValue(searchFormState);
export const useSetSearchFormState = () => useSetRecoilState(searchFormState);
