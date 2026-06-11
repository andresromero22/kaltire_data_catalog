"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Table2, Search, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { tables } from "@/data/tables";
import type { FactSubCategory } from "@/data/tables";
import clsx from "clsx";

type CategoryFilter = "All" | "Dimensions" | "Fact Tables";

const subCategoryBadge: Record<FactSubCategory, string> = {
  Transactional: "bg-[#eff6ff] text-[#2563eb]",
  "Accumulating Snapshot": "bg-[#f5f3ff] text-[#7c3aed]",
  "Periodic Snapshot": "bg-[#ecfdf5] text-[#059669]",
};

function TablesContent() {
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get("category");
  const initialFilter: CategoryFilter =
    paramCategory === "dimensions"
      ? "Dimensions"
      : paramCategory === "fact-tables"
      ? "Fact Tables"
      : "All";

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>(initialFilter);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Dimensions", "Fact Tables", "Other"])
  );

  // Sync filter when URL param changes (sidebar navigation)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat === "dimensions") setActiveFilter("Dimensions");
    else if (cat === "fact-tables") setActiveFilter("Fact Tables");
    else if (!cat) setActiveFilter("All");
  }, [searchParams]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filtered = tables.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const subCategoryOrder: Record<string, number> = {
    Transactional: 0,
    "Accumulating Snapshot": 1,
    "Periodic Snapshot": 2,
  };

  const dimensions = filtered.filter((t) => t.category === "Dimension");
  const factTables = filtered
    .filter((t) => t.category === "Fact")
    .sort((a, b) => (subCategoryOrder[a.subCategory ?? ""] ?? 0) - (subCategoryOrder[b.subCategory ?? ""] ?? 0));
  const other = filtered.filter((t) => t.category === "Other");

  type Section = { key: string; label: string; items: typeof tables };
  const sections: Section[] = [];
  if (activeFilter === "All" || activeFilter === "Dimensions") {
    if (dimensions.length) sections.push({ key: "Dimensions", label: "Dimensions", items: dimensions });
  }
  if (activeFilter === "All" || activeFilter === "Fact Tables") {
    if (factTables.length) sections.push({ key: "Fact Tables", label: "Fact Tables", items: factTables });
  }
  if (activeFilter === "All" && other.length) {
    sections.push({ key: "Other", label: "Other", items: other });
  }

  const showBadge = activeFilter === "Fact Tables" || activeFilter === "All";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#000000]">Tables</h1>
        <p className="text-sm text-[#808285] mt-1">
          {tables.length} tables · Gold_ServiceDelivery schema
        </p>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808285]" />
          <input
            type="text"
            placeholder="Search tables…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F2F2F2] rounded-lg border border-transparent focus:border-[#ff6900] focus:bg-white focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {(["All", "Dimensions", "Fact Tables"] as CategoryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                activeFilter === f
                  ? "bg-[#000000] text-white"
                  : "bg-[#F2F2F2] text-[#808285] hover:bg-[#e5e5e5]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#808285]">
        Showing {filtered.length} of {tables.length} tables
      </p>

      {/* Kimball model overview */}
      <div className="rounded-xl border border-[#e5e5e5] bg-white px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-[#ff6900] shrink-0" />
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-[#000000]">
              Dimensional Modeling — Kimball Approach
            </p>
            <p className="text-xs text-[#808285] leading-relaxed">
              This catalog aligns with the{" "}
              <span className="font-medium text-[#000000]">Kimball dimensional modeling</span>{" "}
              methodology — a star-schema approach that organizes analytical data into two complementary table types, optimized for business intelligence and self-service reporting.
            </p>
            <div className="space-y-1.5 pt-0.5">
              <p className="text-xs text-[#808285] leading-relaxed">
                <span className="font-semibold text-[#000000]">Dimension Tables</span>
                {" "}— provide the descriptive context: the <em>who, what, where, and when</em> of the business. Contains reference data such as Equipment specs, Tire details, Locations, and Dates used to slice and filter any metric.
              </p>
              <p className="text-xs text-[#808285]">
                <span className="font-semibold text-[#000000]">Fact Tables</span>
                {" "}capture business events and measurements, in three subtypes:
              </p>
              <p className="text-xs text-[#808285] pl-3">
                <span className="font-medium text-[#2563eb]">Transactional</span>
                {" "}— one row per discrete business event (tire changes, repairs, inspections).
              </p>
              <p className="text-xs text-[#808285] pl-3">
                <span className="font-medium text-[#7c3aed]">Accumulating Snapshot</span>
                {" "}— tracks an asset through its full lifecycle, updated at each stage (e.g. tire inventory from installation to scrap).
              </p>
              <p className="text-xs text-[#808285] pl-3">
                <span className="font-medium text-[#059669]">Periodic Snapshot</span>
                {" "}— records the state of the business at regular intervals (weekly tread readings, monthly equipment status).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map(({ key, label, items }) => {
          const isExpanded = expandedGroups.has(key);
          return (
            <div key={key} className="rounded-xl border border-[#e5e5e5] overflow-hidden">
              <button
                onClick={() => toggleGroup(key)}
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-[#F2F2F2] hover:bg-[#e8e8e8] transition-colors text-left"
              >
                <Table2 size={17} className="text-[#808285] shrink-0" />
                <span className="font-semibold text-sm text-[#000000] flex-1">{label}</span>
                <span className="text-xs text-[#808285] bg-white px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
                {isExpanded ? (
                  <ChevronDown size={15} className="text-[#808285]" />
                ) : (
                  <ChevronRight size={15} className="text-[#808285]" />
                )}
              </button>

              {isExpanded && (
                <div className="divide-y divide-[#F2F2F2]">
                  {items.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tables/${t.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 bg-white hover:bg-[#F2F2F2] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F2F2F2] flex items-center justify-center shrink-0">
                        <Table2 size={13} className="text-[#808285]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-[#000000]">{t.name}</p>
                          {showBadge && t.subCategory && (
                            <span
                              className={clsx(
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                                subCategoryBadge[t.subCategory]
                              )}
                            >
                              {t.subCategory}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#808285] truncate mt-0.5">
                          {t.description.slice(0, 90)}…
                        </p>
                      </div>
                      <span className="text-xs text-[#808285] font-mono hidden sm:block shrink-0">
                        {t.columns.length} cols
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-[#808285] opacity-0 group-hover:opacity-100 group-hover:text-[#ff6900] transition-all shrink-0"
                      />
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
          <Table2 size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tables found</p>
          <p className="text-sm mt-1">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}

export default function TablesPage() {
  return (
    <Suspense>
      <TablesContent />
    </Suspense>
  );
}
