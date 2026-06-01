"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CheckSquare,
  Repeat2,
  StickyNote,
  MoreHorizontal,
  Zap,
  CalendarCheck,
  Dumbbell,
  Salad,
  Target,
  Timer,
  Settings,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import SyncStatus from "./SyncStatus"
import { useAuth } from "@/hooks/useAuth"

const mainTabs = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/tarefas", label: "Tarefas", icon: CheckSquare },
  { href: "/habitos", label: "Hábitos", icon: Repeat2 },
  { href: "/notas", label: "Notas", icon: StickyNote },
]

const moreLinks = [
  { href: "/rotinas", label: "Rotinas", icon: CalendarCheck },
  { href: "/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/dieta", label: "Dieta", icon: Salad },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer },
  { href: "/settings", label: "Configurações", icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)

  const moreActive = moreLinks.some(
    (l) => pathname === l.href || pathname.startsWith(l.href + "/")
  )

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 inset-x-0 z-40 flex h-14 items-center justify-between border-b border-white/8 bg-black/80 backdrop-blur-sm px-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-violet-400" />
          <span className="font-bold tracking-tight">DailyPulse</span>
        </div>
        <div className="flex items-center gap-3">
          <SyncStatus />
        </div>
      </header>

      {/* Bottom drawer overlay */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-0 inset-x-0 bg-[#0f0f0f] border-t border-white/10 rounded-t-2xl p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm text-white/60 uppercase tracking-wider">Mais</span>
              <button onClick={() => setMoreOpen(false)} className="text-white/40 hover:text-white/70">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center",
                    pathname === href || pathname.startsWith(href + "/")
                      ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                      : "bg-white/3 border-white/8 text-white/60 hover:text-white/90 hover:bg-white/8"
                  )}
                >
                  <Icon size={22} />
                  <span className="text-[11px] font-medium leading-none">{label}</span>
                </Link>
              ))}
            </div>
            <button
              onClick={signOut}
              className="mt-4 w-full py-3 text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Sair da conta
            </button>
          </div>
        </div>
      )}

      {/* Bottom tab nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-white/8 bg-black/80 backdrop-blur-sm pb-safe">
        <div className="flex items-center justify-around px-2 py-1">
          {mainTabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-0",
                  active ? "text-violet-400" : "text-white/40 hover:text-white/70"
                )}
              >
                <Icon
                  className={cn("h-5 w-5 transition-transform", active && "scale-110")}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span className="text-[10px] font-medium leading-none truncate">{label}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors",
              moreActive ? "text-violet-400" : "text-white/40 hover:text-white/70"
            )}
          >
            <MoreHorizontal
              className={cn("h-5 w-5", moreActive && "scale-110")}
              strokeWidth={moreActive ? 2.5 : 1.8}
            />
            <span className="text-[10px] font-medium leading-none">Mais</span>
          </button>
        </div>
      </nav>
    </>
  )
}
