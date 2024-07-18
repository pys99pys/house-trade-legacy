import { HTMLElement, parse } from "node-html-parser";
import { APT2ME_URL } from "../../constants/url";
import type { TradeItem } from "./interfaces";

const parseSize = (str: string): number => {
  const [size] = str.split("㎡");

  return Number(size);
};

const parseTradeAmount = (str: string): number => {
  let amount = 0;

  const [억, 천만_or_백만] = str.replace(" (신)", "").split("억");
  amount += Number(억) * 100000000;

  if (천만_or_백만.includes("천")) {
    const [천만, 백만] = 천만_or_백만.split("천");
    amount += Number(천만) * 10000000;

    if (백만) {
      amount += Number(백만) * 10000;
    }
  } else if (천만_or_백만) {
    amount += Number(천만_or_백만) * 10000;
  }

  return amount;
};

const parseTableRow = (tr: HTMLElement): TradeItem => {
  const item: TradeItem = {
    name: "",
    date: "",
    size: -1,
    floor: -1,
    amount: -1,
    maxAmount: -1,
  };

  tr.querySelectorAll("td").forEach((td, tdIndex) => {
    const content = td.text.replace(/^\s+|\s+$/gm, "").split("\n");

    if (tdIndex % 3 === 0) {
      item.name = content[0];
    }

    if (tdIndex % 3 === 1) {
      item.date = content[0];

      content.forEach((t) => {
        if (t.includes("㎡")) {
          item.size = parseSize(t);
        }

        if (t.includes("층")) {
          item.floor = Number(t.split("층")[0]);
        }
      });
    }

    if (tdIndex % 3 === 2) {
      item.amount = parseTradeAmount(content[0]);
      item.maxAmount = parseTradeAmount(
        content[2].includes("억") ? content[2] : content[3]
      );
    }
  });

  return item;
};

const fetchTradeTables = async (payload: {
  area: string;
  createDt: string;
  page: number;
}): Promise<HTMLElement[]> => {
  const response = await fetch(
    `${APT2ME_URL}/apt/AptMonth.jsp?area=${payload.area}&createDt=${payload.createDt}&pages=${payload.page}`
  );
  const text = await response.text();
  const root = parse(text);

  return root
    .querySelectorAll("table")
    .filter((table) =>
      table.querySelectorAll("td").some((td) => td.text === "단지명")
    );
};

const parseTradeList = async (payload: {
  area: string;
  createDt: string;
  page: number;
}) => {
  const list: TradeItem[] = [];
  const tables = await fetchTradeTables(payload);

  tables.forEach((table) => {
    table.querySelectorAll("tr").forEach((tr, trIndex) => {
      if (trIndex === 0) return;

      list.push(parseTableRow(tr));
    });
  });

  return list;
};

export const getTradeList = async (area: string, createDt: string) => {
  let fetched = false;
  let page = 1;
  let count = 0;

  const list: any[] = [];

  while (!fetched) {
    const result = await parseTradeList({
      area,
      createDt,
      page,
    });

    if (result.length === 0) {
      fetched = true;
    } else {
      list.push(...result);
      count += result.length;
      page += 1;
    }
  }

  return { count, list };
};
