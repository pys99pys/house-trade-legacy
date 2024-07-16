import type { Context } from "@stricjs/router";
import { getTradeList } from "./tradeListService";

interface Payload {
  code: string;
  yearMonth: string;
}

export const tradeListController = async (params: Payload) => {
  return new Response(
    JSON.stringify(await getTradeList(params.code, params.yearMonth)),
    {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:7998",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    }
  );
};
