"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PortfolioSettings() {
  const [startDate, setStartDate] = useState("");
  const [holdings, setHoldings] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState("");

  const addHolding = async () => {
    if (!symbol || quantity <= 0) return;

    const res = await fetch("/api/asset/validate", {
      method: "POST",
      body: JSON.stringify({ symbol, type }),
    });
    const data = await res.json();
    if (!data.valid) {
      setMessage(`Ativo inválido: ${symbol}`);
      return;
    }

    setHoldings([...holdings, { instrument_id: data.instrument_id, symbol, type, quantity }]);
    setSymbol("");
    setQuantity(0);
    setMessage("");
  };

  const savePortfolio = async () => {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      body: JSON.stringify({ start_date: startDate, holdings }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurar Carteira</h1>

      <div>
        <label>Data de Início:</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border p-1 ml-2"
        />
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold">Adicionar Ativo</h2>
        <input
          type="text"
          placeholder="Escopo"
          value={type}
          onChange={e => setType(e.target.value)}
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Símbolo"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="border p-1 mr-2 w-24"
        />
        <Button onClick={addHolding}>Adicionar</Button>
      </div>

      {holdings.length > 0 && (
        <div>
          <h2 className="font-semibold">Ativos na Carteira</h2>
          <ul>
            {holdings.map((h, i) => (
              <li key={i}>{h.symbol} - {h.quantity}</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={savePortfolio}>Salvar Carteira</Button>
      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}
