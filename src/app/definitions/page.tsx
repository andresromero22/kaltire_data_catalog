"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Search, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { measures, measureFolders } from "@/data/measures";
import clsx from "clsx";

const folderIcons: Record<string, string> = {
  Tires: "/llantas.png",
  Repairs: "/martillo-y-llave.png",
  "Downtime Events": "/cronometro.png",
  Rims: "/rim.png",
  Equipment: "/vehicle.png",
  Inspections: "/libros.png",
  "Coleman Forecast": "/tendencia.png",
};

function DefinitionsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>(
    searchParams.get("folder") ?? "All"
  );
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(measureFolders)
  );

  useEffect(() => {
    const folder = searchParams.get("folder");
    setActiveFolder(folder ?? "All");
    if (folder) {
      setExpandedFolders((prev) => new Set([...prev, folder]));
    }
  }, [searchParams]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };

  const filtered = measures.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFolder = activeFolder === "All" || m.folder === activeFolder;
    return matchSearch && matchFolder;
  });

  const byFolder =
    activeFolder === "All"
      ? measureFolders.reduce(
          (acc, folder) => {
            acc[folder] = filtered.filter((m) => m.folder === folder);
            return acc;
          },
          {} as Record<string, typeof filtered>
        )
      : { [activeFolder]: filtered };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#000000]">Definitions</h1>
        <p className="text-sm text-[#808285] mt-1">
          {measures.length} definitions across {measureFolders.length} folders
        </p>
      </div>

      {/* Search + folder filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808285]"
          />
          <input
            type="text"
            placeholder="Search definitions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F2F2F2] rounded-lg border border-transparent focus:border-[#ff6900] focus:bg-white focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFolder("All")}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              activeFolder === "All"
                ? "bg-[#000000] text-white"
                : "bg-[#F2F2F2] text-[#808285] hover:bg-[#e5e5e5]"
            )}
          >
            All
          </button>
          {measureFolders.map((folder) => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                activeFolder === folder
                  ? "bg-[#000000] text-white"
                  : "bg-[#F2F2F2] text-[#808285] hover:bg-[#e5e5e5]"
              )}
            >
              <Image
                src={folderIcons[folder]}
                alt=""
                width={14}
                height={14}
                className="object-contain"
              />
              {folder}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#808285]">Showing {filtered.length} definitions</p>

      {/* Grouped by folder */}
      <div className="space-y-4">
        {Object.entries(byFolder).map(([folder, folderMeasures]) => {
          if (folderMeasures.length === 0) return null;
          const isExpanded = expandedFolders.has(folder);
          return (
            <div key={folder} className="rounded-xl border border-[#e5e5e5] overflow-hidden">
              <button
                onClick={() => toggleFolder(folder)}
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-[#F2F2F2] hover:bg-[#e8e8e8] transition-colors text-left"
              >
                <Image
                  src={folderIcons[folder]}
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain shrink-0"
                />
                <span className="font-semibold text-sm text-[#000000] flex-1">{folder}</span>
                <span className="text-xs text-[#808285] bg-white px-2 py-0.5 rounded-full">
                  {folderMeasures.length}
                </span>
                {isExpanded ? (
                  <ChevronDown size={15} className="text-[#808285]" />
                ) : (
                  <ChevronRight size={15} className="text-[#808285]" />
                )}
              </button>

              {isExpanded && (
                <div className="divide-y divide-[#F2F2F2]">
                  {folderMeasures.map((m) => (
                    <Link
                      key={m.id}
                      href={`/definitions/${m.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 bg-white hover:bg-[#F2F2F2] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F2F2F2] flex items-center justify-center shrink-0">
                        <BarChart3 size={13} className="text-[#808285]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#000000]">{m.name}</p>
                        <p className="text-xs text-[#808285] truncate mt-0.5">
                          {m.description.slice(0, 90)}…
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[#808285] font-mono hidden sm:block">
                          {m.formatString}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-[#808285] opacity-0 group-hover:opacity-100 group-hover:text-[#ff6900] transition-all"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#808285]">
          <BarChart3 size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No definitions found</p>
          <p className="text-sm mt-1">Try a different search or folder.</p>
        </div>
      )}
    </div>
  );
}

export default function DefinitionsPage() {
  return (
    <Suspense>
      <DefinitionsContent />
    </Suspense>
  );
}
