import { atom, useRecoilState, useRecoilValue } from "recoil";
import { FilterFormType } from "../interfaces/FilterForm";

const filterFormState = atom<FilterFormType>({
  key: "filterFormState",
  default: {
    apartName: "",
    onlyBaseSize: false,
    onlySavedList: false,
  },
});

export const useFilterFormState = () => useRecoilState(filterFormState);
export const useFilterFormValue = () => useRecoilValue(filterFormState);
