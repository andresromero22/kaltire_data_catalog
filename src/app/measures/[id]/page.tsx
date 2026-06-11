import { notFound } from "next/navigation";
import Link from "next/link";
import { BarChart3, ChevronRight, Tag, Lightbulb, ArrowRight } from "lucide-react";
import { measures } from "@/data/measures";

const folderColors: Record<string, string> = {
  Tires: "bg-[#fff0e6] text-[#ff6900]",
  Repairs: "bg-[#fef2f2] text-[#dc2626]",
  "Downtime Events": "bg-[#fffbeb] text-[#d97706]",
  Rims: "bg-[#f0f9ff] text-[#0284c7]",
  Equipment: "bg-[#f0fdf4] text-[#16a34a]",
  Inspections: "bg-[#fdf4ff] text-[#9333ea]",
  "Coleman Forecast": "bg-[#f8fafc] text-[#475569]",
};

export function generateStaticParams() {
  return measures.map((m) => ({ id: m.id }));
}

export default async function MeasureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const measure = measures.find((m) => m.id === id);
  if (!measure) notFound();

  const related = measures.filter((m) => measure.relatedMeasures.includes(m.id));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#808285]">
        <Link href="/" className="hover:text-[#ff6900] transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/measures" className="hover:text-[#ff6900] transition-colors">
          Measures
        </Link>
        <ChevronRight size={14} />
        <Link
          href={`/measures?folder=${encodeURIComponent(measure.folder)}`}
          className="hover:text-[#ff6900] transition-colors"
        >
          {measure.folder}
        </Link>
        <ChevronRight size={14} />
        <span className="text-[#000000] font-medium">{measure.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
          <BarChart3 size={22} className="text-[#808285]" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#000000]">{measure.name}</h1>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                folderColors[measure.folder] ?? "bg-[#F2F2F2] text-[#808285]"
              }`}
            >
              {measure.folder}
            </span>
          </div>
          <p className="text-sm text-[#808285] font-mono">
            Format: {measure.formatString}
          </p>
        </div>
      </div>

      {/* Description card */}
      <div className="bg-[#F2F2F2] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#000000] mb-2">Description</h2>
        <p className="text-sm text-[#000000] leading-relaxed">{measure.description}</p>
      </div>

      {/* Usage examples */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-[#ff6900]" />
          <h2 className="text-sm font-semibold text-[#000000]">Usage Examples</h2>
        </div>
        <ul className="space-y-2">
          {measure.usageExamples.map((ex, i) => (
            <li
              key={i}
              className="flex items-start gap-3 bg-white border border-[#e5e5e5] rounded-xl px-4 py-3"
            >
              <span className="w-5 h-5 rounded-full bg-[#ff6900]/10 text-[#ff6900] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[#000000] leading-relaxed">{ex}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {measure.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag size={14} className="text-[#808285]" />
          {measure.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[#F2F2F2] text-[#808285] px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Related measures */}
      {related.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#000000] mb-3">Related Measures</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/measures/${r.id}`}
                className="flex items-center gap-3 bg-[#F2F2F2] hover:bg-white hover:border-[#e5e5e5] border border-transparent rounded-xl px-4 py-3 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <BarChart3 size={13} className="text-[#808285]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#000000] truncate">{r.name}</p>
                  <p className="text-xs text-[#808285]">{r.folder}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-[#808285] opacity-0 group-hover:opacity-100 group-hover:text-[#ff6900] transition-all shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
