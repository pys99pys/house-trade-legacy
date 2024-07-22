import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchFormValue } from "../stores/searchFormStore";

export interface TradeItem {
  name: string;
  date: string;
  size: number;
  floor: number;
  amount: number;
  maxAmount: number;
}

interface Request {
  code: string;
  yearMonth: string;
}

interface Response {
  count: number;
  list: TradeItem[];
}

const fetchTradeList = (params: Request) =>
  axios.get<Response>(
    `http://127.0.0.1:7999?code=${params.code}&yearMonth=${params.yearMonth}`
  );

const useTradeListQuery = () => {
  const { sigungu, yearMonth } = useSearchFormValue();

  return useQuery({
    queryKey: [sigungu, yearMonth],
    enabled: !!sigungu && !!yearMonth,
    queryFn: () => fetchTradeList({ code: sigungu, yearMonth }),
    select: (res) => res.data,
  });
};

export default useTradeListQuery;
