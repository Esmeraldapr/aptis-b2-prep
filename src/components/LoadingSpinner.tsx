export function LoadingSpinner({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
