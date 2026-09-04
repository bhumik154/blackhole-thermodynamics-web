// Direct port of app.py's THROWABLES list (Feed tab). Quips checked for em
// dashes at port time - none found in source.

export interface Throwable {
  name: string;
  icon: string;
  kg: number;
  quip: string;
}

export const THROWABLES: Throwable[] = [
  { name: "You", icon: "🧍", kg: 70, quip: "Gone. Didn't even make a ripple." },
  { name: "A car", icon: "🚗", kg: 1500, quip: "Not even a rounding error." },
  {
    name: "Blue whale",
    icon: "🐋",
    kg: 150000,
    quip: "The largest animal that ever lived. The black hole didn't notice.",
  },
  {
    name: "Titanic",
    icon: "🚢",
    kg: 5.23e7,
    quip:
      "Sank once in the Atlantic. Sank again into a singularity. At least this time was quick.",
  },
  {
    name: "Great Pyramid",
    icon: "🔺",
    kg: 6e9,
    quip: "4,500 years of human labor. Consumed in less time than a thought.",
  },
  {
    name: "Mt. Everest",
    icon: "🏔️",
    kg: 8.1e14,
    quip: "The tallest thing on Earth. In here, it's nothing.",
  },
  {
    name: "The Moon",
    icon: "🌙",
    kg: 7.342e22,
    quip: "No more tides. No more eclipses. Just gone.",
  },
  {
    name: "Earth",
    icon: "🌍",
    kg: 5.972e24,
    quip:
      "8 billion people. Every song, every memory, every sunrise. Swallowed whole.",
  },
  {
    name: "Jupiter",
    icon: "🪐",
    kg: 1.898e27,
    quip:
      "1,300 Earths could fit inside Jupiter. And Jupiter just fit inside this.",
  },
  {
    name: "The Sun",
    icon: "☀️",
    kg: 1.989e30,
    quip: "The thing everything in our solar system orbits. Fed to something that doesn't care.",
  },
  {
    name: "Another 10 M☉ BH",
    icon: "🕳️",
    kg: 1.989e31,
    quip: "Two black holes walk into each other. One walks out. That's the whole joke.",
  },
  {
    name: "Sagittarius A*",
    icon: "⚫",
    kg: 7.956e36,
    quip:
      "You just fed the center of our galaxy to this thing. What are you doing.",
  },
];
