"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [positions, setPositions] = useState<any[]>([]);
  const [returns, setReturns] = useState<any>({});

  const fetchData = async () => {
    try {
      const positionsData = await fetch("/api/positions").then(r => r.json());
      setPositions(positionsData);

      const returnsData = await fetch("/api/portfolio/returns").then(r => r.json());
      setReturns(returnsData);

    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshPrices = async () => {
    try {
      await fetch("/api/prices/refresh", { method: "POST" });
      await fetchData(); // atualiza dashboard sem reload
    } catch (err) {
      console.error("Erro ao atualizar cotações:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard da Carteira</h1>

      <Link href="/settings">
        <Button>Configurar Carteira</Button>
      </Link>
      
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent>Retorno 30d: {returns.last_30d ?? "-"}%</CardContent></Card>
        <Card><CardContent>Retorno 12m: {returns.last_12m ?? "-"}%</CardContent></Card>
        <Card><CardContent>Desde início: {returns.since_inception ?? "-"}%</CardContent></Card>
      </div>

      <Card>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {positions && <LineChart data={positions}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" />
            </LineChart>}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold">Posições</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-600 text-white">
              <th>Ativo</th>
              <th>Qtd</th>
              <th>Preço</th>
              <th>MTM</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td>{p.symbol}</td>
                <td>{p.quantity}</td>
                <td>{p.last_price.toFixed(2)}</td>
                <td>{p.mtm.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={refreshPrices}>Atualizar Cotações</Button>
    </div>
  );
}
