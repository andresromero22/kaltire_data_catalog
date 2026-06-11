export interface Measure {
  id: string;
  name: string;
  folder: string;
  description: string;
  formatString: string;
  usageExamples: string[];
  relatedMeasures: string[];
  tags: string[];
}

export const measureFolders = [
  "Tires",
  "Repairs",
  "Downtime Events",
  "Rims",
  "Equipment",
  "Inspections",
  "Coleman Forecast",
] as const;

export type MeasureFolder = (typeof measureFolders)[number];

export const measures: Measure[] = [
  // ── Tires ────────────────────────────────────────────────────────────────
  {
    id: "tire-purchase-cost",
    name: "Tire Purchase Cost",
    folder: "Tires",
    description:
      "Total purchase cost of all tires in the current filter context. Useful for understanding procurement spend by site, manufacturer, or time period.",
    formatString: "#,0",
    usageExamples: [
      "Total tire spend for a site in the last 12 months.",
      "Compare procurement costs between tire brands.",
      "Track budget vs. actual tire expenditure per quarter.",
    ],
    relatedMeasures: ["avg-tire-cost", "avg-tire-cost-per-hour"],
    tags: ["cost", "procurement", "finance"],
  },
  {
    id: "tire-hours",
    name: "Tire Hours",
    folder: "Tires",
    description:
      "Total accumulated operating hours for all tires in the current filter context. The foundational metric for measuring tire utilization and life.",
    formatString: "#,0",
    usageExamples: [
      "Total hours accumulated by a specific tire size across all equipment.",
      "Compare tire hours per manufacturer to benchmark performance.",
      "Track total fleet tire hours over a rolling 12-month period.",
    ],
    relatedMeasures: ["avg-tire-hours", "tire-hours-scrap"],
    tags: ["hours", "utilization", "performance"],
  },
  {
    id: "tire-hours-scrap",
    name: "Tire Hours (Scrap)",
    folder: "Tires",
    description:
      "Total accumulated operating hours for tires that have been scrapped or recycled. Represents the realized life of tires that have reached end of service.",
    formatString: "#,0",
    usageExamples: [
      "Measure how many hours tires achieved before being scrapped.",
      "Compare actual scrap hours vs. expected tire life targets.",
      "Analyze scrap hours by removal reason to identify improvement areas.",
    ],
    relatedMeasures: ["tire-hours", "avg-tire-hours-scrap", "num-tires-scrap"],
    tags: ["hours", "scrap", "end of life"],
  },
  {
    id: "avg-tire-hours",
    name: "AVG Tire Hours",
    folder: "Tires",
    description:
      "Average operating hours per tire in the current filter context. A key performance indicator for comparing tire life across sites, manufacturers, and equipment types.",
    formatString: "#,0",
    usageExamples: [
      "Compare average tire life between two mine sites.",
      "Benchmark average hours per tire size against targets.",
      "Track whether a new tire brand is performing better than the previous one.",
    ],
    relatedMeasures: ["tire-hours", "avg-tire-hours-scrap", "num-tires"],
    tags: ["hours", "average", "KPI", "performance"],
  },
  {
    id: "avg-tire-hours-scrap",
    name: "AVG Tire Hours (Scrap)",
    folder: "Tires",
    description:
      "Average operating hours achieved by tires at the time they were scrapped. This is the primary measure for evaluating tire life performance.",
    formatString: "#,0",
    usageExamples: [
      "Assess whether tires are meeting their expected life in hours.",
      "Compare average scrap hours by equipment type to identify poor performers.",
      "Use in conjunction with AVG Tire Cost per Hour for total value analysis.",
    ],
    relatedMeasures: ["tire-hours-scrap", "avg-tire-cost-per-hour", "avg-tire-hours"],
    tags: ["hours", "scrap", "KPI", "average"],
  },
  {
    id: "avg-tire-rtd",
    name: "AVG Tire RTD",
    folder: "Tires",
    description:
      "Average Remaining Tread Depth (RTD) across tires in the current context. Indicates the overall health and remaining life potential of the active tire fleet.",
    formatString: "0",
    usageExamples: [
      "Monitor average fleet tread depth to plan upcoming rotations.",
      "Compare average RTD across positions to identify uneven wear.",
      "Set alerts when average fleet RTD drops below a defined threshold.",
    ],
    relatedMeasures: ["avg-tire-rtd-scrap", "pct-tread-utilization-zero"],
    tags: ["RTD", "tread depth", "condition", "average"],
  },
  {
    id: "avg-tire-rtd-scrap",
    name: "AVG Tire RTD (Scrap)",
    folder: "Tires",
    description:
      "Average Remaining Tread Depth at the time tires were scrapped. A lower RTD at scrap indicates better tread utilization, while a higher value suggests tires are being removed prematurely.",
    formatString: "0",
    usageExamples: [
      "Evaluate if tires are being scrapped with excessive remaining tread.",
      "Identify sites where tires are under-utilized before scrapping.",
      "Use as a quality metric for tire removal decision-making.",
    ],
    relatedMeasures: ["avg-tire-rtd", "pct-tread-utilization-zero"],
    tags: ["RTD", "scrap", "tread utilization"],
  },
  {
    id: "avg-tire-hours-per-mm",
    name: "AVG Tire Hours per MM",
    folder: "Tires",
    description:
      "Average operating hours achieved per millimeter of tread consumed. A higher value indicates more efficient tread utilization.",
    formatString: "#,0",
    usageExamples: [
      "Compare tread efficiency between tire manufacturers.",
      "Identify which tire patterns deliver more hours per mm at a specific site.",
      "Use to justify premium tire procurement based on cost efficiency.",
    ],
    relatedMeasures: ["avg-tire-hours", "avg-tire-rtd"],
    tags: ["hours per mm", "tread", "efficiency"],
  },
  {
    id: "avg-tire-cost",
    name: "AVG Tire Cost",
    folder: "Tires",
    description:
      "Average purchase cost per tire in the current filter context.",
    formatString: "#,0",
    usageExamples: [
      "Compare average cost per tire by brand or size.",
      "Track changes in average tire cost over time.",
      "Use alongside AVG Tire Hours (Scrap) to assess value for money.",
    ],
    relatedMeasures: ["tire-purchase-cost", "avg-tire-cost-per-hour"],
    tags: ["cost", "average", "finance"],
  },
  {
    id: "avg-tire-cost-per-hour",
    name: "AVG Tire Cost per Hour",
    folder: "Tires",
    description:
      "Average tire cost per operating hour — the primary financial KPI for tire performance. Lower values indicate better value from the tire investment.",
    formatString: "#,0",
    usageExamples: [
      "The single most important measure for comparing tire brands — lower cost per hour means better value.",
      "Compare cost per hour across sites to identify best and worst performers.",
      "Track cost per hour trend over time to measure improvement programs.",
    ],
    relatedMeasures: ["avg-tire-cost", "avg-tire-hours-scrap", "tire-purchase-cost"],
    tags: ["cost per hour", "KPI", "finance", "performance"],
  },
  {
    id: "avg-tire-performance-selected-metric",
    name: "AVG Tire Performance (Selected Metric)",
    folder: "Tires",
    description:
      "Dynamic measure that switches between AVG Tire Hours, AVG Tire RTD, or AVG Tire Hours per MM based on the user's selection in the Metric Intelligence slicer. Used in flexible dashboards.",
    formatString: "#,0",
    usageExamples: [
      "Use in a report with a slicer to switch between hours, RTD, and hours per mm without changing the visual.",
      "Enables a single chart to show multiple performance views dynamically.",
    ],
    relatedMeasures: ["avg-tire-hours", "avg-tire-rtd", "avg-tire-hours-per-mm"],
    tags: ["dynamic", "slicer", "metric intelligence"],
  },
  {
    id: "pct-tread-utilization-zero",
    name: "% Tread Utilization Zero",
    folder: "Tires",
    description:
      "Percentage of original tread depth consumed across the selected tire population. A value of 100% means tires were run to zero tread. Higher values indicate better tread extraction.",
    formatString: "0%;-0%;0%",
    usageExamples: [
      "Measure how close the fleet is to extracting full tire value.",
      "Compare tread utilization across sites to identify early removal habits.",
      "Use as a KPI in tire performance reviews.",
    ],
    relatedMeasures: ["avg-tire-rtd", "avg-tire-rtd-scrap"],
    tags: ["tread utilization", "percentage", "KPI"],
  },
  {
    id: "pct-tires-over-rotation-target",
    name: "% Tires Over Rotation Target",
    folder: "Tires",
    description:
      "Percentage of tires that have exceeded their recommended rotation target hours. High values indicate missed rotation schedules, which can lead to uneven wear and reduced tire life.",
    formatString: "0%;-0%;0%",
    usageExamples: [
      "Monitor rotation compliance across a fleet.",
      "Alert when more than a defined percentage of tires are overdue for rotation.",
      "Track rotation compliance improvement over time.",
    ],
    relatedMeasures: ["num-tires-over-rotation-target", "num-tires"],
    tags: ["rotation", "compliance", "percentage"],
  },
  {
    id: "num-tires",
    name: "# Tires",
    folder: "Tires",
    description:
      "Count of distinct tires in the current filter context. The base count measure for the tire population.",
    formatString: "#,0",
    usageExamples: [
      "Total tires at a site.",
      "Count of tires by manufacturer or size.",
      "Use as a denominator in ratio calculations.",
    ],
    relatedMeasures: ["num-tires-installed", "num-tires-scrap"],
    tags: ["count", "tire population"],
  },
  {
    id: "num-tires-installed",
    name: "# Tires (Installed)",
    folder: "Tires",
    description:
      "Count of tires currently installed on equipment at the time of first fitment.",
    formatString: "#,0",
    usageExamples: [
      "How many tires are currently fitted across the fleet.",
      "Installed tire count by equipment category.",
    ],
    relatedMeasures: ["num-tires", "num-tires-scrap"],
    tags: ["count", "installed", "active"],
  },
  {
    id: "num-tires-scrap",
    name: "# Tires (Scrap)",
    folder: "Tires",
    description:
      "Count of tires with a scrap status. Used to measure tire attrition and scrap rates.",
    formatString: "#,0",
    usageExamples: [
      "How many tires were scrapped in the last month.",
      "Scrap count by removal reason to identify the leading causes.",
      "Scrap volume by manufacturer to compare failure rates.",
    ],
    relatedMeasures: ["num-tires", "tire-hours-scrap"],
    tags: ["count", "scrap"],
  },
  {
    id: "num-tires-over-rotation-target",
    name: "# Tires Over Rotation Target",
    folder: "Tires",
    description:
      "Count of tires that have exceeded their rotation target hours. A high count indicates maintenance scheduling issues.",
    formatString: "#,0",
    usageExamples: [
      "List of specific tires that are overdue for rotation.",
      "Count by site to identify which locations have the worst rotation compliance.",
    ],
    relatedMeasures: ["pct-tires-over-rotation-target", "num-tires"],
    tags: ["count", "rotation", "overdue"],
  },

  // ── Repairs ───────────────────────────────────────────────────────────────
  {
    id: "repair-cost",
    name: "Repair Cost",
    folder: "Repairs",
    description:
      "Total cost of all tire repair work orders in the current filter context.",
    formatString: "#,0",
    usageExamples: [
      "Total repair spend by site or time period.",
      "Compare repair costs between preventative and corrective repairs.",
      "Track repair budget performance month-over-month.",
    ],
    relatedMeasures: ["avg-repair-cost-per-event", "num-repair-events"],
    tags: ["cost", "repair", "finance"],
  },
  {
    id: "avg-repair-cost-per-event",
    name: "AVG Repair Cost per Event",
    folder: "Repairs",
    description:
      "Average repair cost per completed work order event.",
    formatString: "#,0",
    usageExamples: [
      "Benchmark average repair costs across sites.",
      "Identify sites with unusually high per-event repair costs.",
    ],
    relatedMeasures: ["repair-cost", "num-repair-events"],
    tags: ["cost", "average", "repair"],
  },
  {
    id: "num-repair-events",
    name: "# Repair Events",
    folder: "Repairs",
    description:
      "Count of distinct completed repair work orders.",
    formatString: "#,0",
    usageExamples: [
      "How many repairs were performed this month.",
      "Repair volume by site or equipment type.",
    ],
    relatedMeasures: ["repair-cost", "num-preventative-repair-events", "num-corrective-repair-events"],
    tags: ["count", "repair"],
  },
  {
    id: "num-preventative-repair-events",
    name: "# Preventative Repair Events",
    folder: "Repairs",
    description:
      "Count of repair work orders classified as preventative (planned ahead of failure).",
    formatString: "#,0",
    usageExamples: [
      "Measure how much repair activity is proactive vs. reactive.",
      "Track preventative repair trends to assess maintenance program effectiveness.",
    ],
    relatedMeasures: ["pct-preventative-repair-events", "num-repair-events"],
    tags: ["count", "preventative", "repair"],
  },
  {
    id: "num-corrective-repair-events",
    name: "# Corrective Repair Events",
    folder: "Repairs",
    description:
      "Count of repair work orders classified as corrective (reactive to a failure or damage).",
    formatString: "#,0",
    usageExamples: [
      "Volume of reactive repairs to track fleet reliability.",
      "Compare corrective vs. preventative repair ratios.",
    ],
    relatedMeasures: ["pct-corrective-repair-events", "num-repair-events"],
    tags: ["count", "corrective", "repair"],
  },
  {
    id: "num-non-repair-events",
    name: "# Non-Repair Events",
    folder: "Repairs",
    description:
      "Count of work orders where no actual repair was performed (inspection only, false call, etc.).",
    formatString: "#,0",
    usageExamples: [
      "Identify how many callouts resulted in no repair to track unnecessary downtime.",
    ],
    relatedMeasures: ["num-repair-events"],
    tags: ["count", "repair", "no repair"],
  },
  {
    id: "num-repair-items",
    name: "# Repair Items",
    folder: "Repairs",
    description:
      "Total number of repair line items across all repair work orders. One work order can contain multiple repair items.",
    formatString: "#,0",
    usageExamples: [
      "Total repair items performed in a month.",
      "Compare repair item volume across sites.",
    ],
    relatedMeasures: ["num-repair-events"],
    tags: ["count", "repair items"],
  },
  {
    id: "num-corrective-repair-failures",
    name: "# Corrective Repair Failures",
    folder: "Repairs",
    description:
      "Count of corrective repair events where the repair subsequently failed, requiring further intervention.",
    formatString: "#,0",
    usageExamples: [
      "Identify recurring repair failures to address root causes.",
      "Measure repair quality — a high failure rate may indicate technique or material issues.",
    ],
    relatedMeasures: ["pct-corrective-repair-failures", "num-corrective-repair-events"],
    tags: ["count", "failure", "quality"],
  },
  {
    id: "pct-preventative-repair-events",
    name: "% Preventative Repair Events",
    folder: "Repairs",
    description:
      "Percentage of total repair events that are preventative. A higher value indicates a more proactive maintenance strategy.",
    formatString: "#,0",
    usageExamples: [
      "Track the shift from reactive to proactive maintenance over time.",
      "Benchmark preventative repair ratio against targets.",
    ],
    relatedMeasures: ["num-preventative-repair-events", "num-repair-events"],
    tags: ["percentage", "preventative", "KPI"],
  },
  {
    id: "pct-corrective-repair-events",
    name: "% Corrective Repair Events",
    folder: "Repairs",
    description:
      "Percentage of total repair events that are corrective (reactive).",
    formatString: "#,0",
    usageExamples: [
      "Assess how reactive vs. proactive the maintenance program is.",
    ],
    relatedMeasures: ["num-corrective-repair-events", "num-repair-events"],
    tags: ["percentage", "corrective"],
  },
  {
    id: "pct-corrective-repair-failures",
    name: "% Corrective Repair Failures",
    folder: "Repairs",
    description:
      "Percentage of corrective repairs that subsequently failed.",
    formatString: "#,0",
    usageExamples: [
      "Quality metric — high failure rates may indicate poor repair materials or techniques.",
      "Track repair quality improvement initiatives over time.",
    ],
    relatedMeasures: ["num-corrective-repair-failures", "num-corrective-repair-events"],
    tags: ["percentage", "failure", "quality"],
  },

  // ── Downtime Events ───────────────────────────────────────────────────────
  {
    id: "equipment-hours",
    name: "Equipment Hours",
    folder: "Downtime Events",
    description:
      "Total operating hours for equipment in the current filter context. Used as a denominator for normalized downtime metrics (e.g., events per 5,000 equipment hours).",
    formatString: "#,0",
    usageExamples: [
      "Total equipment operating hours in a quarter by site.",
      "Use as denominator to normalize downtime rates.",
    ],
    relatedMeasures: ["downtime-hours", "num-downtime-events"],
    tags: ["equipment", "hours", "utilization"],
  },
  {
    id: "downtime-hours",
    name: "Downtime Hours",
    folder: "Downtime Events",
    description:
      "Total hours of equipment unavailability due to tire-related downtime events. Excludes emergency job types for accuracy.",
    formatString: "#,0",
    usageExamples: [
      "Total downtime caused by tire changes at a site in a month.",
      "Compare downtime hours between sites to identify operational gaps.",
      "Track downtime reduction over time following process improvements.",
    ],
    relatedMeasures: ["downtime-hours-per-5000", "pct-availability-for-tire-work"],
    tags: ["downtime", "hours", "availability"],
  },
  {
    id: "downtime-hours-per-5000",
    name: "Downtime Hours (per 5,000 Equipment Hours)",
    folder: "Downtime Events",
    description:
      "Downtime hours normalized per 5,000 equipment operating hours. Enables fair comparison across sites with different fleet sizes or utilization levels.",
    formatString: "#,0",
    usageExamples: [
      "Compare tire-related downtime efficiency across sites with different fleet sizes.",
      "Benchmark normalized downtime against industry targets.",
      "Track normalized downtime trend to measure improvement.",
    ],
    relatedMeasures: ["downtime-hours", "equipment-hours"],
    tags: ["downtime", "normalized", "KPI", "benchmark"],
  },
  {
    id: "delay-hours",
    name: "Delay Hours",
    folder: "Downtime Events",
    description:
      "Total hours attributed to operational delays (not full downtime events). Delay hours represent lost productivity without a formal work order.",
    formatString: "#,0",
    usageExamples: [
      "Quantify indirect time losses from delays separate from formal downtime.",
      "Compare delay hours vs. downtime hours to understand the full productivity impact.",
    ],
    relatedMeasures: ["downtime-hours"],
    tags: ["delay", "hours", "productivity"],
  },
  {
    id: "pct-availability-for-tire-work",
    name: "% Availability for Tire Work",
    folder: "Downtime Events",
    description:
      "Percentage of total equipment hours consumed by tire-related downtime. A lower percentage means less time lost to tire maintenance.",
    formatString: "#,0",
    usageExamples: [
      "Monitor what proportion of equipment operating time is lost to tire work.",
      "Track availability trend over time.",
      "Compare tire work availability impact across equipment categories.",
    ],
    relatedMeasures: ["downtime-hours", "equipment-hours"],
    tags: ["availability", "percentage", "KPI"],
  },
  {
    id: "num-downtime-events",
    name: "# Downtime Events",
    folder: "Downtime Events",
    description:
      "Count of distinct tire-related downtime events based on downtime event date.",
    formatString: "0",
    usageExamples: [
      "How many tire-related downtime events occurred this month.",
      "Count of downtime events by site or equipment type.",
    ],
    relatedMeasures: ["num-downtime-events-per-5000", "num-downtime-events-eq"],
    tags: ["count", "downtime"],
  },
  {
    id: "num-downtime-events-per-5000",
    name: "# Downtime Events (per 5,000 Equipment Hours)",
    folder: "Downtime Events",
    description:
      "Number of downtime events normalized per 5,000 equipment hours. Enables fair benchmarking across sites of different sizes.",
    formatString: "#,0",
    usageExamples: [
      "Benchmark downtime event frequency across sites of different sizes.",
      "Track improvement in downtime event frequency over time.",
    ],
    relatedMeasures: ["num-downtime-events", "equipment-hours"],
    tags: ["count", "normalized", "benchmark"],
  },
  {
    id: "num-downtime-events-eq",
    name: "# Downtime Events (EQ)",
    folder: "Downtime Events",
    description:
      "Count of downtime events where the parent job type is classified as Equipment (EQ). Isolates equipment-driven downtime from other types.",
    formatString: "0",
    usageExamples: [
      "Separate equipment-driven downtime from other maintenance types.",
    ],
    relatedMeasures: ["num-downtime-events"],
    tags: ["count", "equipment", "downtime"],
  },
  {
    id: "num-downtime-jobs",
    name: "# Downtime Jobs",
    folder: "Downtime Events",
    description:
      "Count of distinct tire change jobs linked to a downtime event.",
    formatString: "#,0",
    usageExamples: [
      "How many tire jobs were performed during downtime events.",
    ],
    relatedMeasures: ["num-downtime-events", "num-jobs-per-downtime-event"],
    tags: ["count", "jobs", "downtime"],
  },
  {
    id: "num-jobs-per-downtime-event",
    name: "# Jobs per Downtime Event",
    folder: "Downtime Events",
    description:
      "Average number of tire change jobs performed per downtime event. Higher values mean more work is accomplished per equipment stop, which improves efficiency.",
    formatString: "#,0",
    usageExamples: [
      "Assess whether technicians are maximizing each equipment stop.",
      "Benchmark jobs per event to improve maintenance efficiency.",
    ],
    relatedMeasures: ["num-downtime-jobs", "num-downtime-events"],
    tags: ["efficiency", "jobs per event", "KPI"],
  },

  // ── Rims ─────────────────────────────────────────────────────────────────
  {
    id: "num-rims",
    name: "# Rims",
    folder: "Rims",
    description:
      "Total count of distinct rims in the current filter context.",
    formatString: "#,0",
    usageExamples: [
      "Total rim inventory at a site.",
      "Count rims by manufacturer or size.",
    ],
    relatedMeasures: ["num-rims-installed", "num-rims-scrap"],
    tags: ["count", "rim inventory"],
  },
  {
    id: "num-rims-installed",
    name: "# Rims (Installed)",
    folder: "Rims",
    description:
      "Count of rims currently installed on equipment.",
    formatString: "#,0",
    usageExamples: [
      "Installed rim count by site.",
      "Compare installed vs. total rim inventory.",
    ],
    relatedMeasures: ["num-rims", "pct-installed-rims"],
    tags: ["count", "installed"],
  },
  {
    id: "num-rims-scrap",
    name: "# Rims (Scrap)",
    folder: "Rims",
    description:
      "Count of rims that have been scrapped.",
    formatString: "#,0",
    usageExamples: [
      "Track rim scrap rates over time.",
      "Identify high scrap rate by manufacturer or size.",
    ],
    relatedMeasures: ["num-rims"],
    tags: ["count", "scrap"],
  },
  {
    id: "pct-installed-rims",
    name: "% Installed Rims",
    folder: "Rims",
    description:
      "Percentage of total rims that are currently installed on equipment.",
    formatString: "#,0",
    usageExamples: [
      "Assess rim utilization rate at a site.",
      "A low percentage may indicate excess inventory or high scrap rates.",
    ],
    relatedMeasures: ["num-rims-installed", "num-rims"],
    tags: ["percentage", "utilization", "KPI"],
  },

  // ── Equipment ─────────────────────────────────────────────────────────────
  {
    id: "num-equipment",
    name: "# Equipment",
    folder: "Equipment",
    description:
      "Count of distinct equipment units in the current filter context (current inventory).",
    formatString: "0",
    usageExamples: [
      "Total active fleet size at a site.",
      "Equipment count by category or manufacturer.",
    ],
    relatedMeasures: ["num-equipment-in-service", "num-historical-equipment"],
    tags: ["count", "fleet"],
  },
  {
    id: "num-equipment-in-service",
    name: "# Equipment (In Service or Parked)",
    folder: "Equipment",
    description:
      "Count of equipment units with an In Service or Parked status — active fleet excluding decommissioned or retired units.",
    formatString: "0",
    usageExamples: [
      "Active fleet count for capacity planning.",
      "Compare active vs. total equipment by site.",
    ],
    relatedMeasures: ["num-equipment"],
    tags: ["count", "active fleet"],
  },
  {
    id: "num-historical-equipment",
    name: "# Historical Equipment",
    folder: "Equipment",
    description:
      "Count of distinct equipment units from historical snapshot data. Useful for analyzing fleet sizes at points in the past.",
    formatString: "0",
    usageExamples: [
      "Fleet size one year ago vs. today.",
      "Historical fleet size for trend analysis.",
    ],
    relatedMeasures: ["num-equipment", "num-historical-equipment-in-service"],
    tags: ["count", "historical", "fleet"],
  },
  {
    id: "num-historical-equipment-in-service",
    name: "# Historical Equipment (In Service or Parked)",
    folder: "Equipment",
    description:
      "Count of historically active equipment (In Service or Parked status) from snapshot data.",
    formatString: "0",
    usageExamples: [
      "Historical active fleet count for normalized comparisons.",
    ],
    relatedMeasures: ["num-historical-equipment"],
    tags: ["count", "historical", "active fleet"],
  },

  // ── Inspections ───────────────────────────────────────────────────────────
  {
    id: "num-inspections",
    name: "# Inspections",
    folder: "Inspections",
    description:
      "Count of distinct tire inspection work orders in the current filter context.",
    formatString: "0",
    usageExamples: [
      "Total inspections performed this month.",
      "Inspection volume by site or equipment type.",
    ],
    relatedMeasures: ["num-inspections-by-required-end-date"],
    tags: ["count", "inspection"],
  },
  {
    id: "num-inspections-by-required-end-date",
    name: "# Inspections by Required End Date",
    folder: "Inspections",
    description:
      "Count of inspections filtered by their required completion date rather than actual completion date. Used to measure inspection scheduling compliance.",
    formatString: "0",
    usageExamples: [
      "How many inspections were due this week.",
      "Identify overdue inspections by comparing required end date count vs. completed count.",
    ],
    relatedMeasures: ["num-inspections"],
    tags: ["count", "inspection", "compliance", "scheduling"],
  },

  // ── Coleman Forecast ──────────────────────────────────────────────────────
  {
    id: "num-coleman-fc-downtime-events",
    name: "# Coleman FC Downtime Events",
    folder: "Coleman Forecast",
    description:
      "Count of forecasted downtime events from the Coleman predictive model.",
    formatString: "0",
    usageExamples: [
      "How many downtime events are forecasted for the next period.",
      "Compare forecasted vs. actual downtime events to assess forecast accuracy.",
    ],
    relatedMeasures: ["num-coleman-fc-jobs", "num-coleman-fc-jobs-per-event"],
    tags: ["forecast", "coleman", "downtime", "planning"],
  },
  {
    id: "num-coleman-fc-jobs",
    name: "# Coleman FC Jobs",
    folder: "Coleman Forecast",
    description:
      "Count of forecasted tire change jobs from the Coleman model.",
    formatString: "0",
    usageExamples: [
      "Plan technician capacity based on forecasted job volume.",
      "Compare forecast vs. actual job counts.",
    ],
    relatedMeasures: ["num-coleman-fc-downtime-events", "num-coleman-fc-jobs-per-event"],
    tags: ["forecast", "coleman", "jobs", "planning"],
  },
  {
    id: "num-coleman-fc-jobs-per-event",
    name: "# Coleman FC Jobs per Downtime Event",
    folder: "Coleman Forecast",
    description:
      "Average number of forecasted tire jobs per forecasted downtime event.",
    formatString: "#,0",
    usageExamples: [
      "Estimate crew workload per forecasted downtime stop.",
      "Compare forecasted jobs per event to actual jobs per event for forecast validation.",
    ],
    relatedMeasures: ["num-coleman-fc-jobs", "num-coleman-fc-downtime-events"],
    tags: ["forecast", "coleman", "efficiency"],
  },
];
