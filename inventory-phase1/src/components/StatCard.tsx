import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
}

export default function StatCard({ label, value, icon: Icon, iconColor = 'bg-[#FFE082] text-[#5D4037]' }: Props) {
  return (
    <div
      className="rounded-xl p-5 border border-white/40"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: '0 12px 32px -8px rgba(30, 41, 59, 0.18)',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#5D4037]">{label}</p>
          <p className="text-2xl font-semibold text-[#3E2723] mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
