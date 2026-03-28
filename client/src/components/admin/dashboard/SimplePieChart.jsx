import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { useEffect, useRef, useState } from 'react'

const COLORS = [
    '#ec4899',
    '#6366f1',
    '#22c55e',
    '#f59e0b',
    '#14b8a6',
    '#8b5cf6',
    '#ef4444',
    '#06b6d4',
    '#84cc16',
    '#f97316',
]

/**
 * @param {Array<{ name: string, value: number }>} data
 * @param {string} title
 * @param {'currency' | 'count'} valueType
 */
const SimplePieChart = ({ title, data, valueType = 'currency', loading = false }) => {
    const chartData = Array.isArray(data)
        ? data.map((d) => ({
            name: d.name,
            value: Number(d.value) || 0,
        }))
        : []

    const [mounted, setMounted] = useState(false)
    const containerRef = useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!containerRef.current) return

        const el = containerRef.current

        const update = () => {
            const next = el.getBoundingClientRect().width
            setContainerWidth(next)
        }

        update()

        const ro = new ResizeObserver(() => update())
        ro.observe(el)

        return () => ro.disconnect()
    }, [])

    const total = chartData.reduce((s, d) => s + d.value, 0)
    const empty = chartData.length === 0 || total === 0

    const formatVal = (v) =>
        valueType === 'currency' ? `${Number(v).toLocaleString()} ฿` : `${Number(v).toLocaleString()} รายการ`

    const showLabels = containerWidth >= 520
    const labelText = ({ name, percent }) => {
        const p = (percent * 100)
        if (!Number.isFinite(p) || p < 5) return ''
        const safeName = String(name ?? '')
        const short = safeName.length > 14 ? `${safeName.slice(0, 14)}…` : safeName
        return `${short} ${p.toFixed(0)}%`
    }

    if (!chartData || chartData.length === 0) { // กัน data undefined
        return <div className='h-[260px] flex items-center justify-center'>No data</div>
    }

    return (
        <div ref={containerRef} className='flex h-full min-h-[280px] flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
            <h3 className='mb-1 text-base font-semibold text-gray-900'>{title}</h3>
            {!mounted || loading ? (
                <div className='flex flex-1 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400'>
                    กำลังโหลดข้อมูล...
                </div>
            ) : empty ? (
                <div className='flex flex-1 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400'>
                    ไม่มีข้อมูล
                </div>
            ) : (
                <div className='w-full min-w-0'>
                    <ResponsiveContainer width='100%' aspect={1.8}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey='value'
                                nameKey='name'
                                cx='50%'
                                cy='50%'
                                innerRadius={48}
                                outerRadius={88}
                                paddingAngle={2}
                                label={showLabels ? labelText : false}
                                labelLine={showLabels}
                            >
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke='#fff' strokeWidth={1} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => formatVal(v)} contentStyle={{ borderRadius: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}

export default SimplePieChart
