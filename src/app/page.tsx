import Link from "next/link";
import { Table2, BarChart3, Bot, ArrowRight, Database, Layers } from "lucide-react";
import { tables } from "@/data/tables";
import { measures, measureFolders } from "@/data/measures";

const stats = [
  { label: "Tables", value: tables.length, icon: Table2, href: "/tables" },
  { label: "Measures", value: measures.length, icon: BarChart3, href: "/measures" },
  { label: "Measure Folders", value: measureFolders.length, icon: Layers, href: "/measures" },
  { label: "Schemas", value: 1, icon: Database, href: "/tables" },
];

const recentTables = tables.slice(0, 4);
const recentMeasures = measures.slice(0, 4);

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-[#F2F2F2] border border-[#e5e5e5] px-8 py-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, #ff6900 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#ff6900]/15 text-[#ff6900] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] animate-pulse inline-block" />
            Service Delivery Model
          </div>
          <h1 className="text-3xl font-bold text-[#000000] mb-2">
            Kaltire Data Catalog
          </h1>
          <p className="text-[#808285] max-w-xl text-sm leading-relaxed">
            Explore tables, columns, and measures from the Power BI Service Delivery model.
            Find definitions, understand data lineage, and navigate directly to reports.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              href="/tables"
              className="flex items-center gap-2 bg-[#ff6900] hover:bg-[#cc5400] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Browse Tables <ArrowRight size={15} />
            </Link>
            <Link
              href="/measures"
              className="flex items-center gap-2 bg-[#000000] hover:bg-[#333333] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Browse Measures
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-[#F2F2F2] hover:bg-white hover:shadow-sm border border-transparent hover:border-[#e5e5e5] rounded-xl p-5 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff6900]/10 flex items-center justify-center">
                <Icon size={18} className="text-[#ff6900]" />
              </div>
              <ArrowRight
                size={14}
                className="text-[#808285] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-2xl font-bold text-[#000000]">{value}</p>
            <p className="text-sm text-[#808285] mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tables */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#000000]">Tables</h2>
            <Link
              href="/tables"
              className="text-xs text-[#ff6900] font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentTables.map((t) => (
              <Link
                key={t.id}
                href={`/tables/${t.id}`}
                className="flex items-center gap-3 bg-[#F2F2F2] hover:bg-white hover:border-[#e5e5e5] border border-transparent rounded-xl px-4 py-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Table2 size={15} className="text-[#ff6900]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#000000] truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#808285]">
                    {t.category} · {t.columns.length} columns
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="ml-auto text-[#808285] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Measures */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#000000]">Measures</h2>
            <Link
              href="/measures"
              className="text-xs text-[#ff6900] font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentMeasures.map((m) => (
              <Link
                key={m.id}
                href={`/measures/${m.id}`}
                className="flex items-center gap-3 bg-[#F2F2F2] hover:bg-white hover:border-[#e5e5e5] border border-transparent rounded-xl px-4 py-3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <BarChart3 size={15} className="text-[#808285]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#000000] truncate">
                    {m.name}
                  </p>
                  <p className="text-xs text-[#808285]">{m.folder}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="ml-auto text-[#808285] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* AI Banner */}
      <Link
        href="/ai"
        className="flex items-center gap-4 bg-[#F2F2F2] hover:bg-white border border-transparent hover:border-[#e5e5e5] rounded-2xl px-6 py-5 transition-all group"
      >
        <div className="w-11 h-11 rounded-xl bg-[#000000] flex items-center justify-center shrink-0">
          <Bot size={22} className="text-[#ff6900]" />
        </div>
        <div>
          <p className="font-semibold text-[#000000]">
            AI Assistant{" "}
            <span className="text-xs font-normal bg-[#ff6900] text-white px-2 py-0.5 rounded-full ml-1">
              MVP
            </span>
          </p>
          <p className="text-sm text-[#808285]">
            Ask questions in plain language — get answers, definitions, and report pointers.
          </p>
        </div>
        <ArrowRight
          size={18}
          className="ml-auto text-[#808285] group-hover:text-[#ff6900] transition-colors shrink-0"
        />
      </Link>
    </div>
  );
}
