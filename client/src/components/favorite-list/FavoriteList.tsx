import { FC, useEffect, useState } from "react";

import sigunguCodeObserver from "../../observers/sigunguCodeObserver";
import { getValue, setValue } from "../../utils/storageUtils";
import {
  getCityNameWithCode,
  getCityCodeWithCode,
} from "../../utils/cityDataUtils";
import { STORAGE_KEY_FAVORITE_LIST } from "../../constants/storageKeys";
import Button from "../button/Button";

import styles from "./FavoriteList.module.css";

interface FavoriteListProps {}

const sortCodes = (codes: string[]) => {
  return codes.sort((a, b) => {
    const aItem = `${getCityNameWithCode(a)} ${getCityCodeWithCode(a)}`;
    const bItem = `${getCityNameWithCode(b)} ${getCityCodeWithCode(b)}`;

    return aItem > bItem ? 1 : -1;
  });
};

const FavoriteList: FC<FavoriteListProps> = () => {
  const [codes, setCodes] = useState<string[]>(
    getValue(STORAGE_KEY_FAVORITE_LIST) ?? []
  );

  useEffect(() => {
    sigunguCodeObserver.regist("favorite-list", (payload) => {
      if (payload.action === "add") {
        registFavoriteAddEvent(payload.cityCode);
      }

      if (payload.action === "remove") {
        registFavoriteRemoveEvent(payload.cityCode);
      }
    });
  });

  useEffect(() => {
    setValue(STORAGE_KEY_FAVORITE_LIST, codes);
  }, [codes]);

  function registFavoriteAddEvent(cityCode: string) {
    if (codes.some((c) => c === cityCode)) {
      return;
    }

    setCodes(sortCodes([...codes, cityCode]));
  }

  function registFavoriteRemoveEvent(cityCode: string) {
    setCodes(sortCodes(codes.filter((c) => c !== cityCode)));
  }

  function handleClick(cityCode: string) {
    sigunguCodeObserver.notify("favorite-list", {
      action: "select",
      cityCode,
    });
  }

  return (
    <div className={styles.favoriteList}>
      {codes.map((code) => (
        <Button key={code} size="xsmall" onClick={() => handleClick(code)}>
          {getCityNameWithCode(code)} {getCityCodeWithCode(code)}
        </Button>
      ))}
    </div>
  );
};

export default FavoriteList;
