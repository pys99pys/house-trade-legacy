import { atom } from "recoil";

import { SearchFormType } from "../interfaces/SearchForm";

export const searchFormState = atom<SearchFormType>({
  key: "searchFormState",
  default: {
    sido: "",
    sigungu: "",
    yearMonth: "",
  },
});
