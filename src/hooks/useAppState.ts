"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRESETS } from "@/data/presets";
import { THROWABLES } from "@/data/throwables";

export type Tab = "single" | "compare" | "feed";

interface SingleState {
  mass: number;
  preset: string;
}

interface CompareState {
  massA: number;
  presetA: string;
  massB: number;
  presetB: string;
}

interface FeedState {
  mass: number;
  log: number[]; // indices into THROWABLES
}

const DEFAULT_TAB: Tab = "single";
const DEFAULT_SINGLE: SingleState = { mass: 10, preset: "Stellar (10 M☉)" };
const DEFAULT_COMPARE: CompareState = {
  massA: 10,
  presetA: "Stellar (10 M☉)",
  massB: 4e6,
  presetB: "Sagittarius A* (4M M☉)",
};
const FEED_BASELINE_MASS = 10;
const DEFAULT_FEED: FeedState = { mass: FEED_BASELINE_MASS, log: [] };

function serializeMass(m: number): string {
  return m.toExponential();
}

function parseMass(s: string | null, fallback: number): number {
  if (!s) return fallback;
  const v = Number(s);
  return Number.isFinite(v) ? v : fallback;
}

function validPresetLabel(label: string | null, fallback: string): string {
  if (!label) return fallback;
  return PRESETS.some((p) => p.label === label) ? label : fallback;
}

function parseFeedLog(s: string | null): number[] {
  if (!s) return [];
  return s
    .split(",")
    .map((v) => Number(v))
    .filter((i) => Number.isInteger(i) && i >= 0 && i < THROWABLES.length);
}

// The page is statically prerendered with no query string, so the first
// client render must match that (all defaults) to avoid a hydration
// mismatch. The real URL state (if any) is applied in a mount-only effect
// that runs after hydration, not read during the initial render.
export function useAppState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasAppliedUrlState = useRef(false);
  const hasWrittenSinceMount = useRef(false);

  const [tab, setTab] = useState<Tab>(DEFAULT_TAB);
  const [single, setSingle] = useState<SingleState>(DEFAULT_SINGLE);
  const [compare, setCompare] = useState<CompareState>(DEFAULT_COMPARE);
  const [feed, setFeed] = useState<FeedState>(DEFAULT_FEED);

  // Apply real URL state once, post-hydration. This is a deliberate
  // one-time sync from an external source (the URL, unreadable at
  // prerender time) rather than the repeated-cascading-render pattern the
  // set-state-in-effect rule warns about - it runs exactly once (guarded
  // by the ref) and never again for the life of the component.
  useEffect(() => {
    if (hasAppliedUrlState.current) return;
    hasAppliedUrlState.current = true;

    /* eslint-disable react-hooks/set-state-in-effect --
       one-time restore from the URL, guarded above to run exactly once */
    const t = searchParams.get("tab");
    if (t === "compare" || t === "feed") setTab(t);

    if (searchParams.has("m") || searchParams.has("preset")) {
      setSingle({
        mass: parseMass(searchParams.get("m"), DEFAULT_SINGLE.mass),
        preset: validPresetLabel(searchParams.get("preset"), DEFAULT_SINGLE.preset),
      });
    }
    if (searchParams.has("ma") || searchParams.has("mb")) {
      setCompare({
        massA: parseMass(searchParams.get("ma"), DEFAULT_COMPARE.massA),
        presetA: validPresetLabel(searchParams.get("pa"), DEFAULT_COMPARE.presetA),
        massB: parseMass(searchParams.get("mb"), DEFAULT_COMPARE.massB),
        presetB: validPresetLabel(searchParams.get("pb"), DEFAULT_COMPARE.presetB),
      });
    }
    if (searchParams.has("feedMass") || searchParams.has("feedLog")) {
      setFeed({
        mass: parseMass(searchParams.get("feedMass"), DEFAULT_FEED.mass),
        log: parseFeedLog(searchParams.get("feedLog")),
      });
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced URL sync: writes only the active tab's state, so a shared
  // link reflects exactly what the sender was looking at. Skipped on the
  // very first run after the URL-restore effect above, so restoring state
  // doesn't immediately rewrite the URL it was just read from.
  useEffect(() => {
    if (!hasAppliedUrlState.current) return;
    if (!hasWrittenSinceMount.current) {
      hasWrittenSinceMount.current = true;
      return;
    }
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (tab === "single") {
      params.set("m", serializeMass(single.mass));
      params.set("preset", single.preset);
    } else if (tab === "compare") {
      params.set("ma", serializeMass(compare.massA));
      params.set("pa", compare.presetA);
      params.set("mb", serializeMass(compare.massB));
      params.set("pb", compare.presetB);
    } else {
      params.set("feedMass", serializeMass(feed.mass));
      params.set("feedLog", feed.log.join(","));
    }

    const handle = setTimeout(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, single, compare, feed]);

  const setSingleMass = useCallback((mass: number) => setSingle((s) => ({ ...s, mass })), []);
  const setSinglePreset = useCallback((preset: string) => setSingle((s) => ({ ...s, preset })), []);

  const setCompareMassA = useCallback((massA: number) => setCompare((c) => ({ ...c, massA })), []);
  const setComparePresetA = useCallback((presetA: string) => setCompare((c) => ({ ...c, presetA })), []);
  const setCompareMassB = useCallback((massB: number) => setCompare((c) => ({ ...c, massB })), []);
  const setComparePresetB = useCallback((presetB: string) => setCompare((c) => ({ ...c, presetB })), []);

  const feedThrow = useCallback((throwableIndex: number, addedMassSolar: number) => {
    setFeed((f) => ({ mass: f.mass + addedMassSolar, log: [...f.log, throwableIndex] }));
  }, []);
  const resetFeed = useCallback(() => setFeed({ ...DEFAULT_FEED }), []);

  return {
    tab,
    setTab,
    single,
    setSingleMass,
    setSinglePreset,
    compare,
    setCompareMassA,
    setComparePresetA,
    setCompareMassB,
    setComparePresetB,
    feed,
    feedThrow,
    resetFeed,
    feedBaselineMass: FEED_BASELINE_MASS,
  };
}
