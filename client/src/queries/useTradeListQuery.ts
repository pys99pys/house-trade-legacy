import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useSearchFormValue } from "../stores/searchFormStore";

export interface TradeItem {
  isNewRecord: boolean;
  apartName: string;
  address: string;
  buildedYear: number;
  householdsNumber: number;
  tradeDate: string;
  size: number;
  floor: number;
  tradeAmount: number;
  maxTradeAmount: number;
}

interface Request {
  cityCode: string;
  yearMonth: string;
}

interface Response {
  count: number;
  list: TradeItem[];
}

const fetchTradeList = (params: Request) =>
  axios.get<Response>(
    `http://127.0.0.1:7999?code=${params.cityCode}&yearMonth=${params.yearMonth}`
  );

const useTradeListQuery = () => {
  const { cityCode, yearMonth } = useSearchFormValue();

  return useQuery({
    queryKey: [cityCode, yearMonth],
    enabled: !!cityCode && !!yearMonth,
    queryFn: () => fetchTradeList({ cityCode: cityCode, yearMonth }),
    select: (res) => res.data,
  });
};

export default useTradeListQuery;
