export const Loading = () => {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <div
        className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-brand"
        aria-label="Carregando"
      />
    </div>
  )
}
