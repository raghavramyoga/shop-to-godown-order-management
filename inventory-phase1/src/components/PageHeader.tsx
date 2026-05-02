import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#1E293B] truncate">{title}</h1>
        {subtitle && <p className="text-sm text-[#475569] mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
