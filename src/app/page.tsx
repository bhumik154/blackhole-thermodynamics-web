"use client";

import { Suspense } from "react";
import { useAppState } from "@/hooks/useAppState";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabBar } from "@/components/layout/TabBar";
import { SingleTab } from "@/components/tabs/SingleTab";
import { CompareTab } from "@/components/tabs/CompareTab";
import { FeedTab } from "@/components/tabs/FeedTab";

function AppContent() {
  const state = useAppState();

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto w-full px-4 flex-1">
        <div className="mb-6">
          <TabBar tab={state.tab} onChange={state.setTab} />
        </div>
        {state.tab === "single" ? (
          <SingleTab
            massSolar={state.single.mass}
            preset={state.single.preset}
            onMassChange={state.setSingleMass}
            onPresetChange={state.setSinglePreset}
          />
        ) : null}
        {state.tab === "compare" ? (
          <CompareTab
            massA={state.compare.massA}
            presetA={state.compare.presetA}
            massB={state.compare.massB}
            presetB={state.compare.presetB}
            onMassAChange={state.setCompareMassA}
            onPresetAChange={state.setComparePresetA}
            onMassBChange={state.setCompareMassB}
            onPresetBChange={state.setComparePresetB}
          />
        ) : null}
        {state.tab === "feed" ? (
          <FeedTab
            mass={state.feed.mass}
            log={state.feed.log}
            baselineMass={state.feedBaselineMass}
            onThrow={state.feedThrow}
            onReset={state.resetFeed}
          />
        ) : null}
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AppContent />
    </Suspense>
  );
}
