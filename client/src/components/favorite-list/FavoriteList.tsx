import { FC, useEffect, useState } from "react";

import sigunguCodeObserver from "../../observers/sigunguCodeObserver";
import { getValue, setValue } from "../../utils/storageUtils";
import { getSidoWithCode, getSigunguWithCode } from "../../utils/cityDataUtils";
import { STORAGE_KEY_FAVORITE_LIST } from "../../constants/storageKeys";
import Button from "../button/Button";

import styles from "./FavoriteList.module.css";

interface FavoriteListProps {}

const sortCodes = (codes: string[]) => {
  return codes.sort((a, b) => {
    const aItem = `${getSidoWithCode(a)} ${getSigunguWithCode(a)}`;
    const bItem = `${getSidoWithCode(b)} ${getSigunguWithCode(b)}`;

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
        registFavoriteAddEvent(payload.code);
      }

      if (payload.action === "remove") {
        registFavoriteRemoveEvent(payload.code);
      }
    });
  });

  useEffect(() => {
    setValue(STORAGE_KEY_FAVORITE_LIST, codes);
  }, [codes]);

  function registFavoriteAddEvent(code: string) {
    if (codes.some((c) => c === code)) {
      return;
    }

    setCodes(sortCodes([...codes, code]));
  }

  function registFavoriteRemoveEvent(code: string) {
    setCodes(sortCodes(codes.filter((c) => c !== code)));
  }

  function handleClick(code: string) {
    sigunguCodeObserver.notify("favorite-list", { action: "select", code });
  }

  return (
    <div className={styles.favoriteList}>
      {codes.map((code) => (
        <Button key={code} size="xsmall" onClick={() => handleClick(code)}>
          {getSidoWithCode(code)} {getSigunguWithCode(code)}
        </Button>
      ))}
    </div>
  );
};

export default FavoriteList;
