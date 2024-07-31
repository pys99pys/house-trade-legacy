import cheerio, { type Cheerio, type Element } from "cheerio";
import type { TradeItem } from "./interfaces";
import { APT2ME_URL } from "../../constants/url";

const calcIsTradeListTable = (table: Cheerio<Element>): boolean =>
  !!table.find(`td:contains("단지명")`).text();

const splitCellText = (text: string): string[] =>
  text.replace(/^\s+|\s+$/gm, "").split("\n");

const parseFirstCell = (
  cell: Cheerio<Element>
): {
  apartName: string;
  buildedYear: string;
  householdsNumber: string;
} => {
  const text = splitCellText(cell.text());
  const apartName = text[0];
  const [buildedYear] = text[1].split(" ");
  const [householdsNumber] = text[2].split(" / ");

  return {
    apartName,
    buildedYear,
    householdsNumber,
  };
};

const parseSecondCell = (
  cell: Cheerio<Element>
): {
  tradeDate: string;
  flatSize: string;
  areaSize: string;
  floor: string;
} => {
  const text = splitCellText(cell.text());
  const [tradeDate, floor] = text[0].split(" ");
  const areaSize = text[1];
  const [, flatSize] = text[2].replace("(", "").replace(")", "").split(",");

  return {
    tradeDate,
    areaSize,
    flatSize,
    floor,
  };
};

const parseThirdCell = (
  cell: Cheerio<Element>
): {
  isNewRecord: boolean;
  tradeAmount: string;
  maxTradeAmount: string;
} => {
  const text = splitCellText(cell.text());
  const isNewRecord = text[0].includes("신");
  const [tradeAmount] = text[0].split(" (신)");
  const [maxTradeAmount] = text[1].split(" ");

  return {
    isNewRecord,
    tradeAmount,
    maxTradeAmount,
  };
};

const parseRow = (row: Cheerio<Element>): TradeItem => {
  const firstCellItems = parseFirstCell(row.find("td:nth-child(1)"));
  const secondCellitems = parseSecondCell(row.find("td:nth-child(2)"));
  const thirdCellitems = parseThirdCell(row.find("td:nth-child(3)"));

  return {
    ...firstCellItems,
    ...secondCellitems,
    ...thirdCellitems,
  };
};

const parseTradeList = (html: string): TradeItem[] => {
  const $ = cheerio.load(html);
  const tables = $("table");

  const list: TradeItem[] = [];

  tables.each((_, table) => {
    const isTradeListTable = calcIsTradeListTable($(table));

    if (!isTradeListTable) {
      return;
    }

    $(table)
      .find("tr:not(:first-child)")
      .each((_, row) => {
        list.push(parseRow($(row)));
      });
  });

  return list;
};

const fetchTradeList = async (payload: {
  area: string;
  createDt: string;
  page: number;
}): Promise<string> => {
  const response = await fetch(
    `${APT2ME_URL}/apt/AptMonth.jsp?area=${payload.area}&createDt=${payload.createDt}&pages=${payload.page}`
  );

  return await response.text();
};

async function* createTradeList({
  area,
  createDt,
  page,
}: {
  area: string;
  createDt: string;
  page: number;
}): AsyncGenerator<TradeItem[], void, unknown> {
  const html = await fetchTradeList({
    area,
    createDt,
    page,
  });

  const parsedList = parseTradeList(html);

  if (parsedList.length > 0) {
    yield parsedList;
    yield* createTradeList({ area, createDt, page: page + 1 });
  }
}

export const getTradeList = async (area: string, createDt: string) => {
  let count: number = 0;
  let list: TradeItem[] = [];

  for await (const result of createTradeList({ area, createDt, page: 1 })) {
    count += result.length;
    list = list.concat(result);
  }

  return { count, list };
};
