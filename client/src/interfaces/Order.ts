import { TradeItem } from "../queries/useTradeListQuery";

export type OrderType = [keyof TradeItem, "asc" | "desc"];
