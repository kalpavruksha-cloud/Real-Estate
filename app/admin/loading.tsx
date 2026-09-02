export default function AdminLoading() {
  return <div className="grid gap-4">{Array.from({ length: 8 }).map((_, i) => <div className="card h-24 animate-pulse" key={i} />)}</div>;
}
