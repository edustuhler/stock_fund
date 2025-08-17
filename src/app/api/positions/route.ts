import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: holdings } = await supabase.from("holdings").select(`
      quantity,
      instruments (
        id, symbol, type
      ),
      portfolios(id, start_date)
    `);

  const positions = [];
  for (const h of (holdings ?? [])) {
    const { data: priceData } = await supabase
      .from("prices_daily")
      .select("price")
      .eq("instrument_id", h.instruments.id)
      .order("date", { ascending: false })
      .limit(1);

    const lastPrice = priceData?.[0]?.price ?? 0;
    positions.push({
      symbol: h.instruments.symbol,
      quantity: h.quantity,
      last_price: lastPrice,
      mtm: h.quantity * lastPrice,
    });
  }

  return NextResponse.json(positions);
}
