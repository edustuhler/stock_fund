import { NextResponse } from "next/server";
import { calculateReturns } from "@/lib/returns";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("*")
      .single();
    if (!portfolio){
        return NextResponse.json(
            { error: "Portfolio não encontrado" },
            { status: 404 }
        );
    }

    const returns = await calculateReturns(portfolio.id);
    return NextResponse.json(returns);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
