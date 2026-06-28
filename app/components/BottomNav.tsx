"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Goal, User, ChartColumn, Trophy, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/quiniela", icon: Goal, label: "Quiniela" },
    { href: "/pronosticos", icon: User, label: "Mis" },
    { href: "/resultados", icon: ChartColumn, label: "Resultados" },
    { href: "/ranking", icon: Trophy, label: "Ranking" },
    { href: "/admin", icon: Settings, label: "Admin" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 px-2 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;

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
              <Icon size={22} strokeWidth={2.4} />

              <span
                className={`mt-1 text-[10.5px] font-bold ${
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






