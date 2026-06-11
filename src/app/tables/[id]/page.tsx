import { notFound } from "next/navigation";
import Link from "next/link";
import { Table2, ChevronRight, Key, Link2, Tag } from "lucide-react";
import { tables } from "@/data/tables";
import type { Column } from "@/data/tables";

const dataTypeColors: Record<string, string> = {
  string: "bg-green-50 text-green-700",
  integer: "bg-blue-50 text-blue-700",
  decimal: "bg-purple-50 text-purple-700",
  date: "bg-amber-50 text-amber-700",
  datetime: "bg-orange-50 text-orange-700",
  boolean: "bg-red-50 text-red-700",
};

function ColumnRow({ col }: { col: Column }) {
  return (
    <tr className="border-b border-[#e5e5e5] hover:bg-[#F2F2F2] transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {col.isPrimaryKey && (
            <span title="Primary Key"><Key size={12} className="text-[#ff6900] shrink-0" /></span>
          )}
          {col.isForeignKey && (
            <span title="Foreign Key"><Link2 size={12} className="text-[#808285] shrink-0" /></span>
          )}
          <span className="text-sm font-medium text-[#000000]">{col.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            dataTypeColors[col.dataType] || "bg-[#F2F2F2] text-[#808285]"
          }`}
        >
          {col.dataType}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-[#808285] max-w-sm">
        {col.description}
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {col.exampleValues.slice(0, 3).map((v) => (
            <span
              key={v}
              className="text-xs bg-[#F2F2F2] text-[#808285] px-2 py-0.5 rounded font-mono"
            >
              {v}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}

export function generateStaticParams() {
  return tables.map((t) => ({ id: t.id }));
}

export default async function TableDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const table = tables.find((t) => t.id === id);
  if (!table) notFound();

  const categoryColors: Record<string, string> = {
    Dimension: "bg-[#fff0e6] text-[#ff6900]",
    Fact: "bg-[#f0f7ff] text-[#2563eb]",
    Other: "bg-[#F2F2F2] text-[#808285]",
  };

  const primaryKeys = table.columns.filter((c) => c.isPrimaryKey);
  const foreignKeys = table.columns.filter((c) => c.isForeignKey);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#808285]">
        <Link href="/" className="hover:text-[#ff6900] transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/tables" className="hover:text-[#ff6900] transition-colors">
          Tables
        </Link>
        <ChevronRight size={14} />
        <span className="text-[#000000] font-medium">{table.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
          <Table2 size={22} className="text-[#ff6900]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#000000]">{table.name}</h1>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                categoryColors[table.category]
              }`}
            >
              {table.category}
            </span>
            {table.subCategory && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2F2F2] text-[#808285]">
                {table.subCategory}
              </span>
            )}
          </div>
          <p className="text-sm text-[#808285] font-mono">{table.schema}</p>
          <p className="text-sm text-[#000000] mt-3 leading-relaxed max-w-2xl">
            {table.description}
          </p>
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#F2F2F2] rounded-xl p-4">
          <p className="text-xs text-[#808285] mb-1">Total Columns</p>
          <p className="text-xl font-bold text-[#000000]">{table.columns.length}</p>
        </div>
        <div className="bg-[#F2F2F2] rounded-xl p-4">
          <p className="text-xs text-[#808285] mb-1">Primary Keys</p>
          <p className="text-xl font-bold text-[#000000]">{primaryKeys.length}</p>
        </div>
        <div className="bg-[#F2F2F2] rounded-xl p-4">
          <p className="text-xs text-[#808285] mb-1">Foreign Keys</p>
          <p className="text-xl font-bold text-[#000000]">{foreignKeys.length}</p>
        </div>
        <div className="bg-[#F2F2F2] rounded-xl p-4">
          <p className="text-xs text-[#808285] mb-1">Type</p>
          <p className="text-sm font-bold text-[#000000]">
            {table.subCategory ?? table.category}
          </p>
        </div>
      </div>

      {/* Tags */}
      {table.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag size={14} className="text-[#808285]" />
          {table.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[#F2F2F2] text-[#808285] px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Columns table */}
      <div>
        <h2 className="text-lg font-semibold text-[#000000] mb-3">Columns</h2>
        <div className="rounded-xl border border-[#e5e5e5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F2F2F2] border-b border-[#e5e5e5]">
                  <th className="py-3 px-4 text-xs font-semibold text-[#808285] uppercase tracking-wide">
                    Column
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#808285] uppercase tracking-wide">
                    Type
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#808285] uppercase tracking-wide">
                    Description
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#808285] uppercase tracking-wide">
                    Example Values
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {table.columns.map((col) => (
                  <ColumnRow key={col.name} col={col} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
