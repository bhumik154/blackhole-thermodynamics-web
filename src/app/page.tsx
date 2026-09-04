"use client";

import { Suspense } from "react";
import { useAppState } from "@/hooks/useAppState";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabBar } from "@/components/layout/TabBar";
import { SingleTab } from "@/components/tabs/SingleTab";

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
          <div className="text-muted">Compare tab coming up next.</div>
        ) : null}
        {state.tab === "feed" ? (
          <div className="text-muted">Feed tab coming up next.</div>
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
