import { NextRequest, NextResponse } from "next/server";
import { validateInstrument } from "@/lib/validate";

export async function POST(req: NextRequest) {
  const { symbol, type } = await req.json(); // type = "stock" | "fund"

  if (!symbol || !type) {
    return NextResponse.json(
      { error: "symbol e type são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const isValid = await validateInstrument(symbol, type);
    if (!isValid) {
      return NextResponse.json({
        valid: false,
        message: `${symbol} não encontrado`,
      });
    }
    return NextResponse.json({ valid: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
