"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { measures } from "@/data/measures";
import Link from "next/link";

type Result = {
  id: string;
  name: string;
  subtitle: string;
  href: string;
};

function buildIndex(): Result[] {
  return measures.map((m) => ({
    id: m.id,
    name: m.name,
    subtitle: m.folder,
    href: `/definitions/${m.id}`,
  }));
}

const searchIndex = buildIndex();

export default function Header() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim()
    ? searchIndex
        .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8)
    : [];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-[#e5e5e5] flex items-center px-6 gap-4 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 relative max-w-lg">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808285]"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search definitions… (⌘K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="w-full pl-9 pr-9 py-2 text-sm bg-[#F2F2F2] rounded-lg border border-transparent focus:border-[#ff6900] focus:bg-white focus:outline-none transition-colors placeholder:text-[#808285]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808285] hover:text-[#000000]"
          >
            <X size={14} />
          </button>
        )}

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-[#e5e5e5] overflow-hidden z-50">
            {results.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F2F2F2] transition-colors"
                onMouseDown={() => {
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#808285]">
                  Definition
                </span>
                <div>
                  <p className="text-sm font-medium text-[#000000]">{r.name}</p>
                  <p className="text-xs text-[#808285]">{r.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right actions */}
      <Link
        href="/ai"
        className="ml-auto flex items-center gap-2 text-sm font-medium text-white bg-[#ff6900] hover:bg-[#cc5400] px-4 py-1.5 rounded-lg transition-colors"
      >
        <span>Ask AI</span>
      </Link>
    </header>
  );
}
