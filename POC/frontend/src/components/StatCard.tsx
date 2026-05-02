import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  iconColor?: string
}

export default function StatCard({ label, value, icon: Icon, trend, iconColor = 'bg-amber-100 text-amber-600' }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
