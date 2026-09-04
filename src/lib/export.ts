// Standalone downloadable HTML export, extended from app.py's
// build_export_html (which only implemented Single mode) to cover
// Compare and Feed too, since a web download has no Streamlit-side
// limitation to work around. Zero external asset dependencies - the
// exported file opens correctly with no network access.

import { BlackHoleProperties } from "./physics/properties";
import { Regime } from "@/data/regimes";
import { Fact } from "@/data/facts";
import { Throwable } from "@/data/throwables";
import { fmtSci, fmtTime } from "./format";

function row(label: string, value: string, unit: string): string {
  return `<tr><td style="padding:6px 12px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em">${label}</td><td style="padding:6px 12px;font-family:'Courier New',monospace;font-size:14px;font-weight:600;color:#e2e8f0">${value}</td><td style="padding:6px 12px;color:#666;font-size:11px">${unit}</td></tr>`;
}

function propsTable(props: BlackHoleProperties): string {
  return `<table style="width:100%;border-collapse:collapse;margin-bottom:20px">
    ${row("Mass", fmtSci(props.massKg), "kg")}
    ${row("Schwarzschild Radius", fmtSci(props.rsKm), "km")}
    ${row("Hawking Temperature", fmtSci(props.tempK), "K")}
    ${row("B-H Entropy", fmtSci(props.entropyJK), "J/K")}
    ${row("Luminosity", fmtSci(props.lumW), "W")}
    ${row("Surface Gravity", fmtSci(props.surfGrav), "m/s²")}
    ${row("Evaporation Time", fmtTime(props.evapYr), "")}
    ${row("Event Horizon", fmtSci(props.rsM), "m")}
  </table>`;
}

function factsBlock(facts: Fact[]): string {
  if (facts.length === 0) return "";
  const items = facts
    .map(
      (f) =>
        `<p style="margin:0 0 8px;font-size:12px;color:#aaa;line-height:1.6">${f.icon} ${f.text}</p>`
    )
    .join("");
  return `<div style="margin-top:16px;padding:14px 16px;background:#111;border-radius:8px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin-bottom:10px">Did you know?</div>${items}</div>`;
}

function regimeBadge(regime: Regime, massSolar: number): string {
  return `<div style="display:inline-block;background:${regime.color}18;border:1px solid ${regime.color}40;border-radius:6px;padding:4px 12px;margin-bottom:16px">
    <span style="color:${regime.color};font-size:12px;font-weight:600">${regime.name}</span>
    <span style="color:#666;font-size:11px;margin-left:6px">${fmtSci(massSolar)} M☉</span>
  </div>`;
}

interface SingleExportInput {
  mode: "single";
  props: BlackHoleProperties;
  regime: Regime;
  massSolar: number;
  facts: Fact[];
}

interface CompareExportInput {
  mode: "compare";
  propsA: BlackHoleProperties;
  propsB: BlackHoleProperties;
  regimeA: Regime;
  regimeB: Regime;
  massA: number;
  massB: number;
  factsA: Fact[];
  factsB: Fact[];
}

interface FeedExportInput {
  mode: "feed";
  props: BlackHoleProperties;
  regime: Regime;
  massSolar: number;
  log: { item: Throwable }[];
}

export type ExportInput = SingleExportInput | CompareExportInput | FeedExportInput;

function buildBody(input: ExportInput): string {
  if (input.mode === "single") {
    return regimeBadge(input.regime, input.massSolar) + propsTable(input.props) + factsBlock(input.facts);
  }
  if (input.mode === "compare") {
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>${regimeBadge(input.regimeA, input.massA)}${propsTable(input.propsA)}${factsBlock(input.factsA)}</div>
      <div>${regimeBadge(input.regimeB, input.massB)}${propsTable(input.propsB)}${factsBlock(input.factsB)}</div>
    </div>`;
  }
  const logItems = input.log
    .map(
      ({ item }) =>
        `<div style="display:flex;gap:10px;padding:6px 0;border-bottom:1px solid #1a1a1a"><span>${item.icon}</span><div><div style="font-size:12px;color:#e2e8f0">${item.name}</div><div style="font-size:11px;color:#666;font-style:italic">${item.quip}</div></div></div>`
    )
    .join("");
  return `${regimeBadge(input.regime, input.massSolar)}${propsTable(input.props)}<div style="margin-top:16px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin-bottom:10px">Consumed (${input.log.length} items)</div>${logItems}</div>`;
}

export function buildExportHtml(input: ExportInput): string {
  const titleExtra =
    input.mode === "single"
      ? ` - ${fmtSci(input.massSolar)} M☉`
      : input.mode === "feed"
        ? ` - Feed (${fmtSci(input.massSolar)} M☉)`
        : " - Comparison";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Black Hole Thermodynamics${titleExtra}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0c0c14;color:#e2e8f0;font-family:-apple-system,'Segoe UI',sans-serif;padding:40px;max-width:800px;margin:0 auto}
tr:nth-child(even){background:rgba(255,255,255,0.02)}tr:hover{background:rgba(255,255,255,0.04)}table{border-radius:8px;overflow:hidden}</style></head>
<body>
<h1 style="font-size:22px;font-weight:700;margin-bottom:4px">Black Hole Thermodynamics</h1>
<p style="font-size:11px;color:#555;letter-spacing:0.06em;margin-bottom:24px">BHUMIK KHATWANI · ASTROPHYSICS, UIUC · ${new Date().toISOString().slice(0, 10)}</p>
${buildBody(input)}
<p style="text-align:center;font-size:9px;color:#333;margin-top:32px;letter-spacing:0.08em">BEKENSTEIN-HAWKING THERMODYNAMICS · NIST CODATA 2018</p>
</body></html>`;
}

export function downloadExport(input: ExportInput, filenameSuffix: string) {
  const html = buildExportHtml(input);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `blackhole-${filenameSuffix}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
