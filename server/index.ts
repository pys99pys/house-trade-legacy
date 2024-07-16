import { tradeListController } from "./domains/trade-list/tradeListController";

Bun.serve({
  development: true,
  port: 7999,
  async fetch(req) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const yearMonth = searchParams.get("yearMonth");

    if (!code || !yearMonth) {
      throw new Error("필수 파라미터가 입력되지 않았습니다.");
    }

    return await tradeListController({ code, yearMonth });
  },
});
