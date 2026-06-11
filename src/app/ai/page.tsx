"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Table2,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

type MessageRole = "user" | "assistant";

interface Message {
  id: number;
  role: MessageRole;
  text: string;
  links?: { label: string; href: string; type: "table" | "measure" | "page" }[];
}

// Keyword-based mock responses
function getResponse(input: string): Omit<Message, "id" | "role"> {
  const q = input.toLowerCase();

  if (q.includes("tire hours") || q.includes("tire life") || q.includes("hours")) {
    return {
      text: "Tire Hours measures the total accumulated operating hours for tires in your selected context. For scrap analysis, use **Tire Hours (Scrap)**, which only includes tires that have been retired.\n\nYou'll find both measures in the **Tires** folder. For trend analysis over time, pair them with the Time Intelligence calculation group.",
      links: [
        { label: "Tire Hours", href: "/measures/tire-hours", type: "measure" },
        { label: "Tire Hours (Scrap)", href: "/measures/tire-hours-scrap", type: "measure" },
      ],
    };
  }

  if (q.includes("downtime") || q.includes("availability")) {
    return {
      text: "Downtime analysis uses measures in the **Downtime Events** folder. Key metrics are:\n\n• **Downtime Hours** — total unavailability\n• **# Downtime Events** — count of tire-related stops\n• **Downtime Hours (per 5,000 Equip. Hours)** — normalized benchmark\n\nThe **Fact Downtime and Delay** table is the source for this analysis.",
      links: [
        { label: "Downtime Hours", href: "/measures/downtime-hours", type: "measure" },
        { label: "# Downtime Events", href: "/measures/num-downtime-events", type: "measure" },
        { label: "Fact Downtime and Delay", href: "/tables/fact-downtime-and-delay", type: "table" },
      ],
    };
  }

  if (q.includes("cost") || q.includes("spend") || q.includes("purchase")) {
    return {
      text: "For cost analysis, the most impactful measure is **AVG Tire Cost per Hour** — it combines purchase cost and operational life into a single efficiency KPI.\n\n**Tire Purchase Cost** gives you total spend, while **AVG Tire Cost** gives the per-tire average.\n\nAll financial data flows from the **Fact Tire Inventory** table.",
      links: [
        { label: "AVG Tire Cost per Hour", href: "/measures/avg-tire-cost-per-hour", type: "measure" },
        { label: "Tire Purchase Cost", href: "/measures/tire-purchase-cost", type: "measure" },
        { label: "Fact Tire Inventory", href: "/tables/fact-tire-inventory", type: "table" },
      ],
    };
  }

  if (q.includes("repair") || q.includes("maintenance")) {
    return {
      text: "Repair metrics live in the **Repairs** folder. Use **# Repair Events** for volume, **Repair Cost** for spend, and **% Preventative Repair Events** to measure proactive vs. reactive maintenance.\n\nThe **Fact Repair** table stores all repair work order records.",
      links: [
        { label: "# Repair Events", href: "/measures/num-repair-events", type: "measure" },
        { label: "Repair Cost", href: "/measures/repair-cost", type: "measure" },
        { label: "Fact Repair", href: "/tables/fact-repair", type: "table" },
      ],
    };
  }

  if (q.includes("equipment") || q.includes("fleet") || q.includes("truck")) {
    return {
      text: "Equipment data is split between **Dim Equipment** (master attributes like make, model, category) and the fact tables for activity.\n\nUse **# Equipment** for fleet counts and **Equipment Hours** as the normalizing denominator for all rate-based KPIs.",
      links: [
        { label: "Dim Equipment", href: "/tables/dim-equipment", type: "table" },
        { label: "# Equipment", href: "/measures/num-equipment", type: "measure" },
        { label: "Equipment Hours", href: "/measures/equipment-hours", type: "measure" },
      ],
    };
  }

  if (q.includes("tread") || q.includes("rtd") || q.includes("depth")) {
    return {
      text: "Tread depth analysis uses **AVG Tire RTD** for current fleet condition and **AVG Tire RTD (Scrap)** to evaluate whether tires are being removed with significant tread remaining.\n\n**% Tread Utilization Zero** shows how efficiently the fleet extracts tread — higher is better.",
      links: [
        { label: "AVG Tire RTD", href: "/measures/avg-tire-rtd", type: "measure" },
        { label: "AVG Tire RTD (Scrap)", href: "/measures/avg-tire-rtd-scrap", type: "measure" },
        { label: "% Tread Utilization Zero", href: "/measures/pct-tread-utilization-zero", type: "measure" },
      ],
    };
  }

  if (q.includes("location") || q.includes("site") || q.includes("mine")) {
    return {
      text: "Location data is stored in **Dim Location**, which includes site name, country, region, customer, mine type, and system flags (TPMS, TOMS, Tiresight, etc.).\n\nUse this dimension to slice any measure by site, region, or customer.",
      links: [
        { label: "Dim Location", href: "/tables/dim-location", type: "table" },
      ],
    };
  }

  if (q.includes("date") || q.includes("time") || q.includes("month") || q.includes("year")) {
    return {
      text: "The **Dim Date** table is the primary time dimension. It includes calendar fields (month, quarter, year) as well as fiscal year and relative offsets like Current Month and Current Year.\n\nFor intra-day analysis, use **Dim Time** with its hour and minute bins.",
      links: [
        { label: "Dim Date", href: "/tables/dim-date", type: "table" },
        { label: "Dim Time", href: "/tables/dim-time", type: "table" },
      ],
    };
  }

  if (q.includes("rim") || q.includes("wheel")) {
    return {
      text: "Rim data starts in **Dim Rim** for specifications (size, manufacturer, status) and **Fact Rim Inventory** for current inventory counts.\n\nKey measures: **# Rims**, **# Rims (Installed)**, and **% Installed Rims**.",
      links: [
        { label: "Dim Rim", href: "/tables/dim-rim", type: "table" },
        { label: "# Rims", href: "/measures/num-rims", type: "measure" },
        { label: "% Installed Rims", href: "/measures/pct-installed-rims", type: "measure" },
      ],
    };
  }

  if (q.includes("table") || q.includes("schema") || q.includes("model")) {
    return {
      text: "The Service Delivery model contains **28 tables** in the Gold_ServiceDelivery schema — 11 Dimension tables, 15 Fact tables, and 2 Other tables (Exchange Rate, Users).\n\nHead to the Tables section to browse them all.",
      links: [
        { label: "Browse Tables", href: "/tables", type: "page" },
      ],
    };
  }

  if (q.includes("measure") || q.includes("kpi") || q.includes("metric")) {
    return {
      text: "The model has **51 measures** organized in 7 folders: Tires, Repairs, Downtime Events, Rims, Equipment, Inspections, and Coleman Forecast.\n\nBrowse the Measures section to explore them all, grouped by folder.",
      links: [
        { label: "Browse Measures", href: "/measures", type: "page" },
      ],
    };
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("help")) {
    return {
      text: "Hi! I'm the Kaltire Data Catalog AI Assistant (MVP).\n\nI can help you:\n• **Find tables and columns** — ask about tire data, equipment, locations, dates…\n• **Understand measures** — ask about KPIs like tire hours, cost per hour, downtime…\n• **Navigate the model** — I'll point you to the right place\n\nWhat would you like to explore?",
      links: [
        { label: "Tables", href: "/tables", type: "page" },
        { label: "Measures", href: "/measures", type: "page" },
      ],
    };
  }

  return {
    text: "I'm not sure about that specific topic yet, but I can help with:\n\n• **Tire performance** — hours, tread depth, cost per hour\n• **Downtime analysis** — events, hours, normalized rates\n• **Equipment & fleet** — counts, status, hours\n• **Repairs** — cost, preventative vs. corrective\n• **Locations & sites** — mine sites, regions, customers\n• **Dates & time** — calendar, fiscal year, time intelligence\n\nTry asking one of those topics and I'll point you to the right tables and measures.",
    links: [
      { label: "Browse Tables", href: "/tables", type: "page" },
      { label: "Browse Measures", href: "/measures", type: "page" },
    ],
  };
}

const suggestions = [
  "What measures track tire performance?",
  "How is downtime calculated?",
  "Where is equipment master data?",
  "Which measure shows cost efficiency?",
  "What tread depth measures exist?",
];

let msgId = 0;

export default function AiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId++,
      role: "assistant",
      text: "Hi! I'm the Kaltire Data Catalog AI Assistant.\n\nAsk me about tables, measures, KPIs, or anything about the Service Delivery model and I'll help you navigate it.",
      links: [
        { label: "Browse Tables", href: "/tables", type: "page" },
        { label: "Browse Measures", href: "/measures", type: "page" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: msgId++, role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = getResponse(text);
      const assistantMsg: Message = { id: msgId++, role: "assistant", ...response };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Page header */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fff0e6] flex items-center justify-center">
            <Bot size={20} className="text-[#ff6900]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#000000] flex items-center gap-2">
              AI Assistant
              <span className="text-xs font-normal bg-[#ff6900] text-white px-2 py-0.5 rounded-full">
                MVP
              </span>
            </h1>
            <p className="text-xs text-[#808285]">
              Natural language search for the Service Delivery model
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[#fff0e6] flex items-center justify-center shrink-0 mt-1">
                <Bot size={15} className="text-[#ff6900]" />
              </div>
            )}
            <div
              className={clsx(
                "max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-[#ff6900] text-white rounded-tr-sm"
                  : "bg-[#F2F2F2] text-[#000000] rounded-tl-sm"
              )}
            >
              {msg.text.split("\n").map((line, i) => {
                const formatted = line.replace(
                  /\*\*(.+?)\*\*/g,
                  '<strong>$1</strong>'
                );
                return (
                  <p
                    key={i}
                    className={clsx(i > 0 && line === "" ? "mt-2" : i > 0 ? "mt-1" : "")}
                    dangerouslySetInnerHTML={{ __html: formatted }}
                  />
                );
              })}

              {msg.links && msg.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#e5e5e5]">
                  {msg.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                        link.type === "table"
                          ? "bg-[#fff0e6] text-[#ff6900] hover:bg-[#ffe4cc]"
                          : link.type === "measure"
                          ? "bg-white border border-[#e5e5e5] text-[#000000] hover:border-[#ff6900] hover:text-[#ff6900]"
                          : "bg-[#F2F2F2] text-[#000000] hover:bg-[#e5e5e5]"
                      )}
                    >
                      {link.type === "table" && <Table2 size={11} />}
                      {link.type === "measure" && <BarChart3 size={11} />}
                      {link.type === "page" && <ArrowRight size={11} />}
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-[#ff6900] flex items-center justify-center shrink-0 mt-1 text-white text-xs font-bold">
                U
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fff0e6] flex items-center justify-center shrink-0">
              <Bot size={15} className="text-[#ff6900]" />
            </div>
            <div className="bg-[#F2F2F2] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#808285] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#808285] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#808285] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="shrink-0 mb-3">
          <p className="text-xs text-[#808285] mb-2 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#ff6900]" />
            Try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-[#F2F2F2] hover:bg-white hover:border-[#ff6900] border border-transparent text-[#000000] px-3 py-1.5 rounded-lg transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 flex gap-2 bg-white border border-[#e5e5e5] rounded-xl p-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
          placeholder="Ask about tables, measures, KPIs…"
          className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none placeholder:text-[#808285]"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          className="flex items-center gap-2 bg-[#ff6900] hover:bg-[#cc5400] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Send size={14} />
          Send
        </button>
      </div>
    </div>
  );
}
