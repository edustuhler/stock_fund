
export function Button({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
  return <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onClick}>{children}</button>;
}