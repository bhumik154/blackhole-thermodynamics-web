// Direct port of app.py's get_fun_facts() (app.py:166-224). Copy checked
// for em dashes at port time - only plain periods/commas in the source.

import { BlackHoleProperties } from "@/lib/physics/properties";
import { fmtBig, fmtTime, pyExponential, pyToFixed } from "@/lib/format";
import { getRegime, RegimeTag } from "./regimes";

export interface Fact {
  icon: string;
  text: string;
}

const REGIME_FACTS: Partial<Record<RegimeTag, Fact>> = {
  micro: {
    icon: "🌌",
    text: "These might have blinked into existence in the first second after the Big Bang. Tiny knots of density in a universe that was still figuring itself out. Most of them are probably gone by now.",
  },
  smbh: {
    icon: "🌀",
    text: "This is the kind that sits at the center of a galaxy and runs the show. The brightest things in the universe, quasars, are just matter falling into one of these. The light we see is the scream on the way down.",
  },
  stellar: {
    icon: "💫",
    text: "A massive star burned through its fuel, its core gave up, and what was left collapsed into this. The outer layers blew off as a supernova. The core just... kept falling.",
  },
  imbh: {
    icon: "🔭",
    text: "Too heavy to come from a single star. Too light to be the monster at a galaxy's center. These are the ones we can barely find. The universe's middle children.",
  },
};

export function getFunFacts(p: BlackHoleProperties, massSolar: number): Fact[] {
  const facts: Fact[] = [];
  const { rsKm, tempK, evapYr, lumW, massKg, surfGrav, rsM } = p;
  const { tag } = getRegime(massSolar);

  const earthsInside = rsKm ** 3 / 6371 ** 3;
  if (earthsInside >= 1) {
    facts.push({
      icon: "🌍",
      text: `You could park ${fmtBig(earthsInside)} Earths inside this thing. Just... gone. Swallowed whole.`,
    });
  } else if (rsKm < 6371) {
    const pct = (rsKm / 6371) * 100;
    if (pct < 0.001) {
      facts.push({
        icon: "🔬",
        text: `This event horizon is ${pyExponential(pct, 1)}% of Earth's radius. You couldn't see it if you were standing next to it.`,
      });
    } else {
      facts.push({
        icon: "🔬",
        text: `The event horizon is ${pyToFixed(pct, 2)}% of Earth's radius. Tiny. But it'll still ruin your day.`,
      });
    }
  }

  const CMB = 2.725;
  if (tempK < CMB) {
    facts.push({
      icon: "🧊",
      text: "Colder than empty space itself. The cosmic background radiation is 2.725 K and this thing can't even match that. It just sits there, soaking up photons, giving nothing back.",
    });
  } else if (tempK > 5778) {
    facts.push({
      icon: "🔥",
      text: `${fmtBig(tempK / 5778)}× hotter than the surface of the Sun. This black hole is screaming energy into the void and nobody's around to measure it.`,
    });
  } else if (tempK > CMB && tempK < 300) {
    facts.push({
      icon: "❄️",
      text: `Hawking temperature of ${fmtBig(tempK)} Kelvin. Warmer than deep space, colder than your freezer. A weird in-between that nobody will ever feel.`,
    });
  }

  const universeAge = 1.38e10;
  const ageRatio = evapYr / universeAge;
  if (ageRatio > 1e50) {
    facts.push({
      icon: "♾️",
      text: `This takes ${fmtBig(ageRatio)}× the age of the universe to evaporate. The stars will burn out. The galaxies will scatter. And this thing will still be here, barely getting started.`,
    });
  } else if (ageRatio > 1) {
    facts.push({
      icon: "⏳",
      text: `${fmtBig(ageRatio)}× the age of the universe to evaporate. Everything you've ever known will be long gone and this black hole won't even notice.`,
    });
  } else if (evapYr < 1) {
    facts.push({
      icon: "💥",
      text: `Gone in ${fmtTime(evapYr)}. No slow fade. Just a flash of radiation and then nothing. Like it was never there.`,
    });
  }

  const gRatio = surfGrav / 9.81;
  facts.push({
    icon: "⚡",
    text: `Surface gravity: ${fmtBig(gRatio)}× what you feel standing on Earth right now. At this pull, your atoms wouldn't hold together. You'd be stretched into a string of particles before you got close.`,
  });

  const sunLum = 3.828e26;
  if (lumW > sunLum) {
    facts.push({
      icon: "☀️",
      text: `Radiating ${fmtBig(lumW / sunLum)}× more energy than the Sun. A black hole outshining a star. Let that sit for a second.`,
    });
  } else if (lumW < 1e-30) {
    facts.push({
      icon: "🕳️",
      text: "The glow from this thing is so faint that every instrument humanity has ever built would miss it. Hawking radiation is real. We just can't prove it yet. Not at this scale.",
    });
  }

  const regimeFact = REGIME_FACTS[tag];
  if (regimeFact) facts.push(regimeFact);

  const vol = (4 / 3) * Math.PI * rsM ** 3;
  const density = vol > 0 ? massKg / vol : Infinity;
  if (density < 1000) {
    facts.push({
      icon: "🌊",
      text: `Average density inside the horizon: ${fmtBig(density)} kg/m³. That's less dense than water. You could technically float in it. You wouldn't survive, but you could float.`,
    });
  } else if (density > 1e17) {
    facts.push({
      icon: "⚛️",
      text: `Density of ${fmtBig(density)} kg/m³. That's nuclear territory. Imagine crushing a mountain down to the size of a sugar cube. Now do that to everything.`,
    });
  }

  return facts.slice(0, 5);
}
