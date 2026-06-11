"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Table2, BarChart3, Bot, Home, ChevronRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, Suspense } from "react";
import { tables } from "@/data/tables";
import { measures, measureFolders } from "@/data/measures";

const dimCount = tables.filter((t) => t.category === "Dimension").length;
const factCount = tables.filter((t) => t.category === "Fact").length;

const folderCounts = Object.fromEntries(
  measureFolders.map((f) => [f, measures.filter((m) => m.folder === f).length])
);

// Tables sub-nav — uses ?category= param
function TablesSubNav() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const items = [
    { label: "Dimensions", param: "dimensions", count: dimCount },
    { label: "Fact Tables", param: "fact-tables", count: factCount },
  ];

  return (
    <div className="ml-5 mt-0.5 border-l border-[#e5e5e5] pl-3 space-y-0.5 pb-1">
      {items.map(({ label, param, count }) => (
        <Link
          key={param}
          href={`/tables?category=${param}`}
          className={clsx(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors",
            activeCategory === param
              ? "bg-white text-[#ff6900] font-medium"
              : "text-[#808285] hover:bg-white hover:text-[#000000]"
          )}
        >
          <span className="flex-1 truncate">{label}</span>
          <span className="tabular-nums shrink-0">{count}</span>
        </Link>
      ))}
    </div>
  );
}

// Measures sub-nav — uses ?folder= param
function MeasuresSubNav() {
  const searchParams = useSearchParams();
  const activeFolder = searchParams.get("folder");

  return (
    <div className="ml-5 mt-0.5 border-l border-[#e5e5e5] pl-3 space-y-0.5 pb-1">
      {measureFolders.map((folder) => (
        <Link
          key={folder}
          href={`/measures?folder=${encodeURIComponent(folder)}`}
          className={clsx(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors",
            activeFolder === folder
              ? "bg-white text-[#ff6900] font-medium"
              : "text-[#808285] hover:bg-white hover:text-[#000000]"
          )}
        >
          <span className="flex-1 truncate">{folder}</span>
          <span className="tabular-nums shrink-0">{folderCounts[folder]}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const onTables = pathname.startsWith("/tables");
  const onMeasures = pathname.startsWith("/measures");

  const [tablesOpen, setTablesOpen] = useState(onTables);
  const [measuresOpen, setMeasuresOpen] = useState(onMeasures);

  useEffect(() => {
    if (onTables) setTablesOpen(true);
    if (onMeasures) setMeasuresOpen(true);
  }, [onTables, onMeasures]);

  return (
    <aside className="w-60 shrink-0 bg-[#F2F2F2] border-r border-[#e5e5e5] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 shrink-0">
        <Link href="/">
          <Image
            src="/Logo MTG.png"
            alt="Kaltire MTG"
            width={140}
            height={40}
            className="object-contain"
            style={{ height: "auto" }}
            priority
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {/* Home */}
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
            pathname === "/"
              ? "bg-white text-[#ff6900] shadow-sm"
              : "text-[#000000] hover:bg-white hover:text-[#ff6900]"
          )}
        >
          <Home
            size={16}
            className={pathname === "/" ? "text-[#ff6900]" : "text-[#808285] group-hover:text-[#ff6900]"}
          />
          <span className="flex-1">Home</span>
        </Link>

        {/* Tables */}
        <div>
          <div
            className={clsx(
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              onTables ? "bg-white shadow-sm" : "hover:bg-white"
            )}
          >
            <Link
              href="/tables"
              className={clsx(
                "flex items-center gap-3 flex-1 min-w-0 px-3 py-2.5",
                onTables ? "text-[#ff6900]" : "text-[#000000] hover:text-[#ff6900]"
              )}
            >
              <Table2
                size={16}
                className={onTables ? "text-[#ff6900] shrink-0" : "text-[#808285] shrink-0"}
              />
              <span>Tables</span>
            </Link>
            <button
              onClick={() => setTablesOpen((v) => !v)}
              className="shrink-0 px-2 py-2.5 rounded-r-lg hover:bg-black/5 text-[#808285]"
              aria-label="Toggle tables sub-menu"
            >
              {tablesOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>

          {tablesOpen && (
            <Suspense fallback={null}>
              <TablesSubNav />
            </Suspense>
          )}
        </div>

        {/* Measures */}
        <div>
          <div
            className={clsx(
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              onMeasures ? "bg-white shadow-sm" : "hover:bg-white"
            )}
          >
            <Link
              href="/measures"
              className={clsx(
                "flex items-center gap-3 flex-1 min-w-0 px-3 py-2.5",
                onMeasures ? "text-[#ff6900]" : "text-[#000000] hover:text-[#ff6900]"
              )}
            >
              <BarChart3
                size={16}
                className={onMeasures ? "text-[#ff6900] shrink-0" : "text-[#808285] shrink-0"}
              />
              <span>Measures</span>
            </Link>
            <button
              onClick={() => setMeasuresOpen((v) => !v)}
              className="shrink-0 px-2 py-2.5 rounded-r-lg hover:bg-black/5 text-[#808285]"
              aria-label="Toggle measures sub-menu"
            >
              {measuresOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>

          {measuresOpen && (
            <Suspense fallback={null}>
              <MeasuresSubNav />
            </Suspense>
          )}
        </div>

        {/* AI */}
        <Link
          href="/ai"
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
            pathname.startsWith("/ai")
              ? "bg-white text-[#ff6900] shadow-sm"
              : "text-[#000000] hover:bg-white hover:text-[#ff6900]"
          )}
        >
          <Bot
            size={16}
            className={
              pathname.startsWith("/ai")
                ? "text-[#ff6900]"
                : "text-[#808285] group-hover:text-[#ff6900]"
            }
          />
          <span className="flex-1">AI Assistant</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#e5e5e5] shrink-0">
        <p className="text-xs text-[#808285]">Service Delivery Model</p>
        <p className="text-xs text-[#808285] opacity-60">v1.0 · Internal Use</p>
      </div>
    </aside>
  );
}
