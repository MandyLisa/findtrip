const KPICard = ({ title, value, accent = 'from-pink-500 to-rose-500' }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-10`}
      />
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{value}</p>
    </div>
  )
}

export default KPICard
