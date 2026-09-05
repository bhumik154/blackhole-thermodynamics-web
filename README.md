# ⚫ Black Hole Thermodynamics

A calculator for things that shouldn't exist.

Plug in a mass. Get back the temperature, entropy, radius, luminosity, surface gravity, and evaporation timescale of a black hole. Watch how the numbers change across 30 orders of magnitude. Compare two black holes side by side. Or just throw Earth into one and see what happens.

**[Live app →](https://blackhole-thermodynamics-web.vercel.app)**

Built with Next.js, TypeScript, and Tailwind. The physics is real, verified byte-for-byte against the original engine. The fun facts are too.

---

## What's in here

**Single mode** — Pick a mass (or choose a preset like Cygnus X-1, Sagittarius A*, or M87*). Get every thermodynamic property, an animated event-horizon visualization, a size-comparison chart, scaling relations across the full mass range, and a handful of facts that'll make you stare at the ceiling for a bit.

**Compare mode** — Put two black holes next to each other. A 10 solar-mass stellar remnant vs. the 6.5 billion solar-mass monster at the center of M87. The numbers are... not close.

**Feed mode** — Start with a 10 solar-mass black hole. Throw things into it. You. A car. The Moon. Earth. Jupiter. The Sun. Sagittarius A* itself. Each one gets a quip, the mass updates live, and every property shifts in real time. A cosmic garbage disposal with math.

**Shareable links** — Every view's state (mode, mass, presets, feed history) lives in the URL, so any configuration can be linked and shared directly.

**Export** — Download any view as a clean, self-contained HTML snapshot.

---

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build          # production build
npm run lint            # eslint
npm run verify:parity   # diff the TS physics engine against the reference Python implementation
```

---

## The physics

Everything here comes from three results:

- **Schwarzschild (1916)** solved Einstein's field equations for a non-rotating black hole
- **Bekenstein (1973)** showed that black holes have entropy proportional to their horizon area
- **Hawking (1974)** proved they radiate thermally and will eventually evaporate

The formulas live in `src/lib/physics/` — short, clean, and a direct port of the original Python engine, checked automatically (`npm run verify:parity`) against a vendored copy of that original across 14 representative masses. If you're studying this stuff, read that directory first.

---

## Stack

Next.js (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Framer Motion · d3-scale/d3-shape for the hand-built charts · Canvas 2D for the event-horizon visualization.

This is a ground-up rebuild of my original [Streamlit version](https://github.com/bhumik154/blackhole-thermodynamics) — same physics, same core ideas, rebuilt from scratch with real architecture and hosted properly.

---

## Some things you'll learn

- A 10 solar-mass black hole is colder than empty space
- Sagittarius A* is less dense than water
- A primordial micro black hole evaporates faster than you can blink, and it's hotter than anything that has ever existed
- If you threw the Sun into a stellar black hole, the black hole wouldn't even change regime

---

**Bhumik Khatwani** · Astrophysics · University of Illinois Urbana-Champaign
[bhumikkhatwani.com](https://bhumikkhatwani.com) · [LinkedIn](https://www.linkedin.com/in/bhumik-khatwani)
