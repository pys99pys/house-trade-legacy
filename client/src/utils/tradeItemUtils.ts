import { FilterType } from "../interfaces/Filter";
import { TradeItem } from "../queries/useTradeListQuery";

export const createSavedTradeItemValue = ({
  cityCode,
  apartName,
  address,
  size,
}: {
  cityCode: string;
  apartName: string;
  address: string;
  size: number;
}) => `${cityCode}_${apartName}_${address}_${size}`;

export const filterItems = (
  items: TradeItem[],
  {
    cityCode,
    savedList,
    filter,
  }: {
    cityCode: string;
    savedList: string[];
    filter: FilterType;
  }
) =>
  items.filter((item) => {
    const includedApartName = filter.apartName
      ? item.apartName.includes(filter.apartName)
      : true;

    const includedBaseSize = filter.onlyBaseSize
      ? item.size > 83 && item.size < 85
      : true;

    const includedSavedList = filter.onlySavedList
      ? savedList.some(
          (savedItem) =>
            savedItem ===
            createSavedTradeItemValue({
              cityCode,
              apartName: item.apartName,
              address: item.address,
              size: item.size,
            })
        )
      : true;

    return includedApartName && includedBaseSize && includedSavedList;
  });

export const sortItems = (
  items: TradeItem[],
  order: [keyof TradeItem, "asc" | "desc"]
): TradeItem[] => {
  return items.sort((a, b) => {
    if (a[order[0]] > b[order[0]]) {
      return order[1] === "asc" ? 1 : -1;
    } else {
      return order[1] === "asc" ? -1 : 1;
    }
  });
};

export const sliceItems = (
  items: TradeItem[],
  {
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }
) => items.slice((page - 1) * perPage, page * perPage);

export const parseToFlatSizeText = (areaSize: number): string => {
  const area = areaSize * 0.3025;
  const addtionalSize = areaSize < 84 ? 8 : 9;

  return `${Math.floor(area + addtionalSize)}평`;
};

export const parseToAreaSizeText = (originSize: number): string => {
  return `${Math.round(originSize * 100) / 100}㎡`;
};

export const parseToHouseHoldsNumberText = (floor: number): string => `${floor}세대`;

export const parseToFloorText = (floor: number): string => `${floor}층`;

export const parseToAmountText = (amount: number): string => `${amount / 100000000}억원`;
