import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fetchPriceDelta } from "@/lib/prices";

export async function POST() {
  try {
    const { data: instruments } = await supabase
      .from("instruments")
      .select("*");
    if (!instruments?.length)
      return NextResponse.json({ message: "Nenhum instrumento encontrado" });

    const results = [];
    for (const instrument of instruments) {
      const inserted = await fetchPriceDelta(
        instrument.id,
        instrument.symbol,
        instrument.type
      );
      results.push({ instrument: instrument.symbol, updated: inserted.length });
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
