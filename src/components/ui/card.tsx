export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-600 shadow rounded p-4">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>;
}

