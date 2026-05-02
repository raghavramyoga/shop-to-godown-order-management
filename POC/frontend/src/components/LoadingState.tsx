import { Loader2, AlertCircle } from 'lucide-react'

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-slate-500">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-red-900">Could not load data</p>
        <p className="text-sm text-red-700 mt-1">{message}</p>
        <p className="text-xs text-red-600 mt-2">
          Make sure the API is running at <code className="bg-red-100 px-1 rounded">http://localhost:5033</code>
        </p>
      </div>
    </div>
  )
}
