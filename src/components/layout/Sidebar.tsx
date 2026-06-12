"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { BarChart3, Bot, Home, ChevronRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, Suspense } from "react";
import { measures, measureFolders } from "@/data/measures";

const folderCounts = Object.fromEntries(
  measureFolders.map((f) => [f, measures.filter((m) => m.folder === f).length])
);

function DefinitionsSubNav() {
  const searchParams = useSearchParams();
  const activeFolder = searchParams.get("folder");

  return (
    <div className="ml-5 mt-0.5 border-l border-[#e5e5e5] pl-3 space-y-0.5 pb-1">
      {measureFolders.map((folder) => (
        <Link
          key={folder}
          href={`/definitions?folder=${encodeURIComponent(folder)}`}
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
  const onDefinitions = pathname.startsWith("/definitions");

  const [definitionsOpen, setDefinitionsOpen] = useState(onDefinitions);

  useEffect(() => {
    if (onDefinitions) setDefinitionsOpen(true);
  }, [onDefinitions]);

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

        {/* Definitions */}
        <div>
          <div
            className={clsx(
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              onDefinitions ? "bg-white shadow-sm" : "hover:bg-white"
            )}
          >
            <Link
              href="/definitions"
              className={clsx(
                "flex items-center gap-3 flex-1 min-w-0 px-3 py-2.5",
                onDefinitions ? "text-[#ff6900]" : "text-[#000000] hover:text-[#ff6900]"
              )}
            >
              <BarChart3
                size={16}
                className={onDefinitions ? "text-[#ff6900] shrink-0" : "text-[#808285] shrink-0"}
              />
              <span>Definitions</span>
            </Link>
            <button
              onClick={() => setDefinitionsOpen((v) => !v)}
              className="shrink-0 px-2 py-2.5 rounded-r-lg hover:bg-black/5 text-[#808285]"
              aria-label="Toggle definitions sub-menu"
            >
              {definitionsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>

          {definitionsOpen && (
            <Suspense fallback={null}>
              <DefinitionsSubNav />
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
