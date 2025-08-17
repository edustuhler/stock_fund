import { supabase } from "./supabase";

function fillMissingPrices(
  prices: { date: string; price: number }[],
  start: Date,
  end: Date
) {
  const filled: { date: string; price: number }[] = [];
  let lastPrice = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayStr = d.toISOString().split("T")[0];
    const priceObj = prices.find((p) => p.date === dayStr);
    if (priceObj) lastPrice = priceObj.price;
    filled.push({ date: dayStr, price: lastPrice });
  }
  return filled;
}

export async function calculateReturns(portfolio_id: number) {
  const { data: holdings } = await supabase
    .from("holdings")
    .select("instrument_id, quantity")
    .eq("portfolio_id", portfolio_id);

  if (!holdings?.length)
    return { last_30d: 0, last_12m: 0, since_inception: 0 };

  const startRes = await supabase
    .from("portfolios")
    .select("start_date")
    .eq("id", portfolio_id)
    .single();
  const startDate = new Date(startRes.data?.start_date);
  const today = new Date();
  const dailyValues: { date: string; value: number }[] = [];

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    let value = 0;
    for (const h of holdings) {
      const { data: prices } = await supabase
        .from("prices_daily")
        .select("date, price")
        .eq("instrument_id", h.instrument_id)
        .lte("date", d.toISOString().split("T")[0])
        .order("date", { ascending: true });
      const filled = fillMissingPrices(prices || [], startDate, d);
      value += filled[filled.length - 1].price * h.quantity;
    }
    dailyValues.push({ date: d.toISOString().split("T")[0], value });
  }

  const getReturn = (days: number) => {
    if (dailyValues.length < days + 1) return 0;
    const V_today = dailyValues[dailyValues.length - 1].value;
    const V_prev = dailyValues[dailyValues.length - 1 - days].value;
    return (V_today / V_prev - 1) * 100;
  };

  return {
    last_30d: getReturn(30),
    last_12m: getReturn(365),
    since_inception: getReturn(dailyValues.length - 1),
  };
}
