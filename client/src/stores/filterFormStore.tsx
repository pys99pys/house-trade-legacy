import { atom } from "recoil";
import { FilterForm } from "../interfaces/FilterForm";

export const filterFormState = atom<FilterForm>({
  key: "filterFormState",
  default: {
    apartName: "",
    onlyBaseSize: false,
    onlySavedList: false,
  },
});
