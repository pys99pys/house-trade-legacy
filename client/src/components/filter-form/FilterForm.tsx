import { FC } from "react";

import { useFilterFormState } from "../../stores/filterFormStore";
import useTradeListQuery from "../../queries/useTradeListQuery";
import Input from "../input/Input";
import Button from "../button/Button";

import styles from "./FilterForm.module.css";

interface FilterFormProps {}

const FilterForm: FC<FilterFormProps> = () => {
  const { data } = useTradeListQuery();
  const [state, setState] = useFilterFormState();

  const handleChangeApartName = (apartName: string) => {
    setState({
      apartName,
      onlyBaseSize: state.onlyBaseSize,
      onlySavedList: state.onlySavedList,
    });
  };

  const handleClickBaseSize = () => {
    setState({
      apartName: state.apartName,
      onlyBaseSize: !state.onlyBaseSize,
      onlySavedList: state.onlySavedList,
    });
  };

  const handleClickSavedList = () => {
    setState({
      apartName: state.apartName,
      onlySavedList: !state.onlySavedList,
      onlyBaseSize: state.onlyBaseSize,
    });
  };

  return (
    <div className={styles.filterForm}>
      <div>
        {data && (
          <>
            검색결과: <strong>{data.count}</strong>건
          </>
        )}
      </div>
      <div className={styles.buttons}>
        <Input
          size="small"
          placeholder="아파트명"
          value={state.apartName}
          onChange={handleChangeApartName}
        />
        <Button
          size="small"
          color={state.onlyBaseSize ? "primary" : "default"}
          onClick={handleClickBaseSize}
        >
          국민평수
        </Button>
        <Button
          size="small"
          color={state.onlySavedList ? "primary" : "default"}
          onClick={handleClickSavedList}
        >
          저장 목록
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;
