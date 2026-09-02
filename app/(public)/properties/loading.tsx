export default function PropertiesLoading() {
  return <main className="container section"><div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div className="card h-80 animate-pulse bg-white" key={i} />)}</div></main>;
}
