import { supabase } from "./supabase";
import fetch from "node-fetch";

export async function fetchPriceDelta(
  instrument_id: number,
  symbol: string,
  type: "stock" | "fund"
) {
  const { data: lastPrice } = await supabase
    .from("prices_daily")
    .select("date")
    .eq("instrument_id", instrument_id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  const startDate = lastPrice?.date
    ? new Date(lastPrice.date)
    : new Date("2020-01-01");
  const endDate = new Date();
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const inserted = [];

  for (let i = 1; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    let price = 0;

    if (type === "stock") {
      try {
        const res = await fetch(
          `https://brapi.dev/api/quote/${symbol}?date=${
            date.toISOString().split("T")[0]
          }`
        );
        const json = await res.json();
        price = json?.results?.[0]?.close ?? 0;
      } catch {}
    } else if (type === "fund") {
      price = Math.random() * 100; // placeholder
    }

    if (price > 0) {
      await supabase
        .from("prices_daily")
        .insert({ instrument_id, date, price });
      inserted.push({ date, price });
    }
  }

  return inserted;
}
