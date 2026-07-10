export function LogoMark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-6 w-6 shrink-0 rounded-full ordino-gradient-ring">
        <div className="absolute inset-[3px] rounded-full bg-sidebar" />
      </div>
      {!collapsed && (
        <span className="text-base font-semibold tracking-tight">
          Ordino <span className="ordino-gradient-text">AI</span>
        </span>
      )}
    </div>
  );
}
