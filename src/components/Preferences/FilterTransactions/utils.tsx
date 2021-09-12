interface Unit {
  unit?: string;
  raw: number;
  display?: string;
}

export const units: Unit[] = [
  {
    raw: Infinity,
  },
  {
    unit: "GAna",
    raw: 1e33,
    display: "1000 Ana",
  },
  {
    unit: "MAna",
    raw: 1e30,
    display: "1 Ana",
  },
  {
    unit: "kana",
    raw: 1e27,
    display: `0.001 Ana`,
  },
  {
    unit: "ana",
    raw: 1e24,
    display: `0.000001 Ana`,
  },
  {
    unit: "mana",
    raw: 1e21,
    display: `1e+21 raw`,
  },
  {
    unit: "μana",
    raw: 1e18,
    display: `1e+18 raw`,
  },
  {
    unit: "raw",
    raw: 1,
    display: "1 raw",
  },
];

export const DEFAULT_UNITS: [number, number] = [units[0].raw, units[2].raw];
