import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { start_date, assets } = body; // assets = [{ instrument_id, quantity }]

  if (!start_date || !assets?.length) {
    return NextResponse.json(
      { error: "start_date e assets são obrigatórios" },
      { status: 400 }
    );
  }

  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .upsert({ start_date })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  for (const asset of assets) {
    await supabase
      .from("holdings")
      .upsert({
        portfolio_id: portfolio.id,
        instrument_id: asset.instrument_id,
        quantity: asset.quantity,
      });
  }

  return NextResponse.json({ portfolio, holdings: assets });
}
