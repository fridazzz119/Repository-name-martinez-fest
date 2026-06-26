"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/quiniela", icon: "⚽", label: "Quiniela" },
    { href: "/pronosticos", icon: "👤", label: "Mis" },
    { href: "/resultados", icon: "📊", label: "Resultados" },
    { href: "/ranking", icon: "🏆", label: "Ranking" },
    { href: "/admin", icon: "⚙️", label: "Admin" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 px-2 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center rounded-3xl py-2 transition-all duration-300 ${
                active
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>

              <span
                className={`mt-1 text-[11px] font-bold ${
                  active ? "text-white" : "text-slate-500"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}






