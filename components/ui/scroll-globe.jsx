"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

// 360 x 180 land/sea bitmap (1° cells, row 0 = 90°N, col 0 = 180°W), base64.
const LAND_MASK = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//8AFb///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///+x/////76fAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gD/p////////AAAAAAAAAACxBwAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAA///uAf//////+AAAABrvwAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAeHznn/h////////4AAAABXsAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAEcIA5MfAI///////8AAAAAPFAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAABoCGc8X/AH///////4AAAAAAAAAAAAAB4AAAAB9+AAAAAAAAAAAAAAAAAAAAAD/wMzz8AAAP/////2AAAAAAAAAAAAD4AAAA////AAAB/oAAAAAAAAAAAAAACAwACAcAAAAP/////+AAAAAAAAAAAAMAAAAX///6AAAAAAAAAAAAAAAAAAAAP+Ac8+M/gAAD////+8AAAAAAAAAAAA4AAAH///+O+HAAHAAAAAAAAAAAAAAAf/+4/Y/94AAD////+wAAAAAAAAAAABwAHhH///////8AHwAAAAAwAAAAAAAAON/8E4//9AADf////gAAAAAAAAAAABwAPZ+///////4nv/gAAAAAAAH8gAAAAAP+A8f//8AA3///ogAAAAAABtgAAAAAfv/////////////8AAAAAB///+B/2H/+DnDxf8AAz////AAAAAAA//wAAAA8Pv//////////////9H8wAP////////QsDPzwD8AAf///wAAAAAAG///wIBe/3+/////////////////+AD////////+//fz4Y/wA7//4AAAAAAAD///+I////v//////////////////4EP///////////5gD/8A///gAAAAAAAf//5+P///8//////////////////7w/////////////qAD+QAP/wABr8AAAAf8f+D///////////////////////AwAf///////////zwx/AAP/wAAP8AAAB/4/+f//////////////////////4AMAf//////////+DBAbwAH/AAADAAAAN/j/////////////////////////+AAH///////////4AwgHQAD/AAAAAAAAf/H///////////////////////n/6AAP///////////wAA/AAAB+AAAAAAAB/+H//////////////////////jP+AAAH/9z////////gAA/wAAAMAAAAAACB//D7////////////////////+A/YAAAA/xAD///////gAA/wQAAAAAAAAAAB9/Ab///////////////////+ODgAAAAAB0AAX//////4AA/94AAAAAAAAAYA5+C///////////////////4AAHQAAAAABcAAP//////8AAf/+AAAAAAAAB8AA+i///////////////////wAAfgAAAAAMAAAC///////wAf/+AAAAAAAAAYAOeH///////////////////AAA/gAAAABQAAADf//////8Af//AAAAAAAAAcAPQH//////////////////8AAA/AAAAAEAAAAAP///////z///4AAAAAAADuAEDv//////////////////+AAA+AAAAAAAAAABP///////x///8AAAAAAAPHAf/////////////////////4AA8AAAAAAAAAAAn///////x///8AAAAAAAPPx//////////////////////6AA4AAAAAAAAAAAD///////////6AAAAAAAAPH//////////////////////6AAwAAAAAAAAAAAC///////////kAAAAAAAAQP//////////////////////zAAAAAAAAAAAAAABv////////+MMAAAAAAAAC///////////////////////7AAAAAAAAAAAAAAAL////////7wPgAAAAAAAf///////////////////////yAAAAAAAAAAAAAAAP/////////gCgAAAAAAAD///////////////////////iAAAAAAAAAAAAAAAP/////////pAAAAAAAAAD/////vP////////////////BAAAAAAAAAAAAAAAP/////////+AAAAAAAAAB//v//GP///////////////+AAAAAAAAAAAAAAAAP////////8wAAAAAAAAAB//P/+EP///////////////8CAAAAAAAAAAAAAAAP////////wgAAAAAAAADj/jz/+AD///////////////4HgAAAAAAAAAAAAAAP////////gAAAAAAAAAH/4Fw/4AA//////////////+ACAAAAAAAAAAAAAAAP////////gAAAAAAAAAH/wAcP8PA//////////////8AAAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/gMHfV///////////////v4AMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/IMCOH//////////////+ZwAMAAAAAAAAAAAAAAAH///////oAAAAAAAQAAH/AACGP//////////////8BwAMAAAAAAAAAAAAAAAH///////wAAAAAAAAAAH+AAYDH//////////////+g4AYAAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgf+AABs//////////////g4D4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAAh/+AAAA//////////////A4fwAAAAAAAAAAAAAAAB///////gAAAAAAAAAAB//8AAAA//////////////Ah2AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////gjwAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAQH///4GAB//////////////gBAAAAAAAAAAAAAAAAAAG/////4AAAAAAAAAAAP///8PwD//////////////gCAAAAAAAAAAAAAAAAAACf////4AAAAAAAAAAAP////v////////////////gAAAAAAAAAAAAAAAAAAABv//xAYAAAAAAAAAAAP//////3//H///////////gAAAAAAAAAAAAAAAAAAAAv//AAYAAAAAAAAAAAf/////////H///////////wAAAAAAAAAAAAAAAAAAAB3/+AAcAAAAAAAAAAB///////8//h///////////gAAAAAAAAAAAAAAAAAAAAZ/+AAMAAAAAAAAAAD///////8//wH//////////AAAAAAAAAAAAAAAAAAAAAJ/+AAEAAAAAAAAAAH///////+f/wB/f////////AAAAAAAAAAAAAAAAAAAAAI/8AAAAAAAAAAAAAH///////+f/44Af///////8QAAAAAAAAAAAAAAAAAAAACf8AAAAAAAAAAAAAP///////+H//+AP///////4gAAAAAAAAAAAAAAAAAAAAAP8AAvAAAAAAAAAAP////////H///AD///////ggAAAAAAAAAAAAAAAAAAAAAH8AQBggAAAAAAAAf////////n//+ADf/4P//YAAAAAAAAAAAAAAAAAAAAAAAH+A4AYAAAAAAAAAP////////j//+AAf/4H/+IAAAAAAAAAAAAAAAgAAAAAAAH/B4ABwAAAAAAAAP////////h//8AAf/gD/8YAAAAAAAAAAAAAAAAAAAAAAAD/lwAD8AAAAAAAAP////////x//4AAf/AD/8QAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAP////////4//gAAf+AB/+AAwAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAP////////4f+AAAf8AD//AAwAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAf////////8/8AAAPwAAP/gAgAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fgAAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAf/////////eAAAAHwAAP/gAsAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAf/////////gBAAAHwAAM/gAKAAAAAAAAAAAAAAAAAAAAAAAADABIAAAAAAAAH/////////gIAAADwAAEfgALAAAAAAAAAAAAAAAAAAAAAAAADgPfIAAAAAAAH/////////34AAADwAAIPABIAAAAAAAAAAAAAAAAAAAAAAAAAyPf+AAAAAAAD//////////4AAADoAAIEACBAAAAAAAAAAAAAAAAAAAAAAAAA8///AAAAAAAB//////////wAAABIAAMAAEHAAAAAAAAAAAAAAAAAAAAAAAAAE///gAAAAAAB//////////wAAAAMAAEAAADgIAAAAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAf/////////gAAAAMAADAAMDAAAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAP/B///////gAAAAAABDgAeAAAAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAACAA3//////AAAAAAAAxgA+AAAAAAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAD/////+AAAAAAAAZgB8BAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAD/////8AAAAAAAAMwH8AIAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAD/////wAAAAAAAAHQf8AIAAAAAAAAAAAAAAAAAAAAAAAAD////4AAAAAAAAAH/////gAAAAAAAAHgf8cIAAAAAAAAAAAAAAAAAAAAAAAAD/////AAAAAAAAAH/////AAAAAAAAAD4f8ASgAAAAAAAAAAAAAAAAAAAAAAAH////+4AAAAAAAAH/////AAAAAAAAABwP50QwAAAAAAAAAAAAAAAAAAAAAAAH/////+AAAAAAAAD////+AAAAAAAAAB8P5wAL4AgAAAAAAAAAAAAAAAAAAAAD//////4AAAAAAAB////8AAAAAAAAAA8AxQif/AAAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAA////4AAAAAAAAAAcAAQAD/gAAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAMABAAI/ywAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAA////4AAAAAAAAAADgAAAIf8BAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAAf///4AAAAAAAAAAB+AABA/4AAAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAAAfsgAOMAAAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAABCAAAGgAAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAP///+AAAAAAAAAAAAAAAAAAgBAAAAAAAAAAAAAAAAAAAAf/////+AAAAAAAAP///8AAAAAAAAAAAAAACgCAEAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAf///8AQAAAAAAAAAAAAB+CAAAAAAAQAAAAAAAAAAAAAAAP/////4AAAAAAAAf///+AQAAAAAAAAAAAAD8DAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+AwAAAAAAAAAAAA38DgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////+BwAAAAAAAAAAAD/8HgAAAAAAAAAAAAAAAAAAAAAAB/////4AAAAAAAA////8PwAAAAAAAAAAAH//XgAABABAAAAAgAAAAAAAAAAAAf////4AAAAAAAA////wPgAAAAAAAAAAAP//3wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAA////gPgAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAAf///8AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgEAAAAAAAAAD////+AAIAAAAAAAAAIAAAAAAAAAAP////gAAAAAAAAP//+AfAAAAAAAAAAAf////+AAEAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAP///AfAAAAAAAAAAA//////AAAAAAAAAAAAAAAAAAAAAAAP///4AAAAAAAAAP//+APAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAH//+AOAAAAAAAAAAB//////wAAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AEAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//wAAAAAAAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAAf//8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAAA//AAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAAAAA/+AAAAAAAAAAAAAAP/AP//wAAAAAAAAAAAAAAAAAAAAAA//vgAAAAAAAAAAA/4AAAAAAAAAAAAAAP8AG//gAAAAAAAAAAAAAAAAAAAAAA//3AAAAAAAAAAAAQAAAAAAAAAAAAAAAOAAF//gAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAABAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAgAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAQAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAAAcAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADQAAAAAAAAAAAAAAAAAD/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAHAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAOAAAAAAAAAAAAAAAAAAF/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAP4AAAAAAL+HgBj/AAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAADf/gAAB//////////AAAAAAAAAAAAAAAAAAAAAAAABoAAAAAAAAAAAAAAAAB////8A////////////mAAAAAAAAAAAAAAAAAAAAAB38AAAAAAAAAAAAAAAGD////4D/////////////4AAAAAAAAAAAAAAAAAAAAAb+AAAAAAAAAAAM/gB//////4//////////////+gAAAAAAAAAAAAAAAAAAAD/8AAAAAAAA7+///////////5////////////////4AAAAAAAAAAAAAAHQABh5+AAAAAAAA//////////////////////////////gAAAAAAAAABgAAAP/+Gl/8AAAAAAAf/////////////////////////////+AAAAAAAAAAiARsAv/////+AAAAAAA//////////////////////////////sAAAAAAAAX////////////wAAAAAAF//////////////////////////////gAAAAAAAX///////////PwAAAAAAf///////////////////////////////gAAAAAD+P///////////8AAAAAAP////////////////////////////////zgAAAAAP///////////fgCAAD8A/////////////////////////////////+AAAAD4B///////////7wwAAD+AB///////////////////////////////+AAAAAAAA////////////wAAA/wAH///////////////////////////////+AAAAAAAP//////////////AAAA/////////////////////////////////+AAAAAAAH//////////////4D/n//////////////////////////////////8AAAAAH//////////////////////////////////////////////////////8A/wAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";

export const DEFAULT_AIRPORTS = {
  JFK: { name: "New York", lat: 40.64, lon: -73.78 },
  LHR: { name: "London", lat: 51.47, lon: -0.45 },
  ORD: { name: "Chicago", lat: 41.98, lon: -87.9 },
  FRA: { name: "Frankfurt", lat: 50.04, lon: 8.56 },
  LAX: { name: "Los Angeles", lat: 33.94, lon: -118.41 },
  IST: { name: "Istanbul", lat: 41.26, lon: 28.74 },
  DXB: { name: "Dubai", lat: 25.25, lon: 55.36 },
  BOM: { name: "Mumbai", lat: 19.09, lon: 72.87 },
  JNB: { name: "Johannesburg", lat: -26.14, lon: 28.24 },
  SIN: { name: "Singapore", lat: 1.36, lon: 103.99 },
  HKG: { name: "Hong Kong", lat: 22.31, lon: 113.91 },
  HND: { name: "Tokyo", lat: 35.55, lon: 139.78 },
  SYD: { name: "Sydney", lat: -33.94, lon: 151.18 },
  GRU: { name: "São Paulo", lat: -23.43, lon: -46.47 },
  EZE: { name: "Buenos Aires", lat: -34.82, lon: -58.54 },
  SCL: { name: "Santiago", lat: -33.39, lon: -70.79 },
  MAD: { name: "Madrid", lat: 40.47, lon: -3.56 },
  PER: { name: "Perth", lat: -31.94, lon: 115.97 },
  CDG: { name: "Paris", lat: 49.01, lon: 2.55 },
  YYZ: { name: "Toronto", lat: 43.68, lon: -79.63 },
  CAI: { name: "Cairo", lat: 30.12, lon: 31.41 },
  ICN: { name: "Seoul", lat: 37.46, lon: 126.44 },
  AKL: { name: "Auckland", lat: -37.01, lon: 174.79 },
};

// Each chapter = one scroll "stop". focus is where the globe turns to,
// distance is camera distance (bigger = further out), routes are [from, to].
// `points` are the bullet lines: each gets a red strip that fills as the slide
// scrolls, on the same timing curve the arcs use, so copy and globe advance
// together. Point count is independent of route count — slide 5 has no arcs.
export const DEFAULT_CHAPTERS = [
  {
    title: "What is an AI Voice Agent",
    body: "",
    focus: { lat: 45, lon: -40 },
    distance: 3.9,
    routes: [["JFK", "LHR"], ["ORD", "FRA"], ["LAX", "LHR"], ["IST", "JFK"], ["MAD", "JFK"], ["CDG", "JFK"], ["YYZ", "LHR"]],
    points: [
      "A trained AI voice agent that answers your line 24/7. No shifts, no breaks, no hold queue.",
      "Built on your own hours, location, services and policies. thus, never a generic script.",
      "Speaks naturally and answers the moment a call arrives.",
      "Runs on your existing number. No hiring, no training, no turnover.",
    ],
  },
  {
    title: "Why Hire an AI Voice Agent",
    body: "",
    focus: { lat: 22, lon: 48 },
    distance: 3.8,
    routes: [["LHR", "DXB"], ["DXB", "BOM"], ["DXB", "JNB"], ["DXB", "SIN"], ["DXB", "HKG"], ["CAI", "DXB"]],
    points: [
      "Every unanswered call is a customer who called your competitor next.",
      "Staff stop losing hours to the same five questions.",
      "Covers nights, weekends and holidays - when most calls go unanswered.",
      "It scales along side your business, as a result, busier season, more locations, more calls, same reliability.",
    ],
  },
  {
    title: "What Problems It Solves",
    body: "",
    focus: { lat: 18, lon: 135 },
    distance: 4.1,
    routes: [["SIN", "HKG"], ["HKG", "HND"], ["SIN", "SYD"], ["HND", "LAX"], ["HND", "SYD"], ["ICN", "SIN"]],
    points: [
      "Missed calls that become missed bookings, orders and patients.",
      "Staff interrupted by repetitive questions instead of serving the customer present.",
      "No coverage after hours, and slow response when every line is busy.",
      "Inconsistent answers, and the cost of staffing a desk just to cover the phone.",
    ],
  },
  {
    title: "Personalised and Tailored for Your Facility's Needs",
    body: "",
    focus: { lat: -24, lon: 12 },
    distance: 4.4,
    routes: [["GRU", "JNB"], ["JNB", "PER"], ["EZE", "MAD"], ["SCL", "GRU"], ["SCL", "SYD"], ["AKL", "SYD"]],
    points: [
      "Trained on your own details: name, location, hours and services.",
      "Adapts to your sector — reservations, appointments or intake requests.",
      "Speaks in your brand's tone and stays strictly within the facts you provide.",
      "Update its knowledge the moment your details change.",
    ],
  },
  {
    title: "Ask for a Free Demo Now!",
    body: "",
    focus: { lat: 22, lon: 20 },
    distance: 5.1,
    routes: [],
    overview: true,
    points: [
      "See it run on your own business details, not a demo script.",
      "Set up in under a minute — a few details and your agent is live.",
      "Hear exactly how it will sound to your customers.",
      "No cost, no commitment. A summary follows to your inbox.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const TILT = 0.85; // how much of the focus latitude the globe tilts toward
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const wrapPi = (a) => a - TAU * Math.floor((a + Math.PI) / TAU);

function latLonToVec3(lat, lon, r) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function greatCircleKm(a, b) {
  const dLat = (b.lat - a.lat) * DEG;
  const dLon = (b.lon - a.lon) * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * DEG) * Math.cos(b.lat * DEG) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function makeLandTest(b64) {
  const bin = atob(b64);
  return (lat, lon) => {
    const row = clamp(Math.floor(90 - lat), 0, 179);
    const col = ((Math.floor(lon + 180) % 360) + 360) % 360;
    const i = row * 360 + col;
    return (bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  };
}

function radialTexture(size, stops) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => grd.addColorStop(o, col));
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/**
 * A speech-like waveform as an SVG path. Deterministic from `seed` — a
 * Math.random() version would render differently on the server and the client
 * and trip a hydration mismatch.
 *
 * Three stacked sines at incommensurate frequencies give the irregular,
 * non-repeating shape of a voice; the `env` term tapers both ends to zero so
 * the line settles onto the baseline instead of being cut off mid-peak.
 */
/**
 * Bar heights for a voice-memo style waveform, as percentages of the row.
 * Deterministic from `seed` — Math.random() would render differently on the
 * server and the client and trip a hydration mismatch.
 *
 * Three stacked sines at incommensurate frequencies (23/41/71) give the
 * irregular, non-repeating rhythm of speech; the absolute value makes it an
 * amplitude rather than a signal, and `env` tapers both ends so the clip starts
 * and finishes quiet the way a recording does.
 */
function waveBars(seed, count = 88) {
  const bars = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const env = Math.pow(Math.sin(Math.PI * t), 0.35);
    const n = Math.abs(
      Math.sin(t * 23 + seed * 1.7) * 0.55 +
        Math.sin(t * 41 + seed * 3.1) * 0.3 +
        Math.sin(t * 71 + seed * 5.3) * 0.15
    );
    // Floor of 14% so quiet passages still read as bars, not gaps.
    bars.push(Math.round(Math.max(0.14, n * env) * 100));
  }
  return bars;
}

/**
 * The same bars drawn twice: a dim resting track, and a lit copy the scroll
 * loop reveals by clipping. Flex with `flex:1` rather than fixed widths, so the
 * bars stay evenly spaced at any column width.
 */
function Waveform({ seed }) {
  const bars = waveBars(seed);
  const layer = (cls) => (
    <span className={cls}>
      {bars.map((pct, k) => (
        <i key={k} style={{ height: `${pct}%` }} />
      ))}
    </span>
  );
  return (
    <span className="sg-wave" aria-hidden="true">
      {layer("sg-wave-track")}
      {layer("sg-fill")}
    </span>
  );
}

// Splits on a standalone "AI" so it can be tinted. The capture group keeps the
// delimiter in the result, and the word boundaries stop it matching inside
// words like "AID" or "SAID".
const AI_TOKEN = /(\bAI\b)/g;

function markAI(text) {
  if (typeof text !== "string") return text;
  return text
    .split(AI_TOKEN)
    .map((part, i) =>
      part === "AI" ? (
        <em key={i} className="sg-ai">
          AI
        </em>
      ) : (
        part
      )
    );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ScrollGlobe({
  chapters = DEFAULT_CHAPTERS,
  airports = DEFAULT_AIRPORTS,
  color = "#ff2e43",
  background = "#090203",
  heightPerChapter = 120, // vh of scrolling per chapter
  loadFonts = true,
  className = "",
  // `= undefined` only so TS, which infers this component's props from the JS
  // source, treats style as optional. Destructuring undefined is identical at
  // runtime to leaving it bare.
  style = undefined,
}) {
  const rootRef = useRef(null);
  const canvasHostRef = useRef(null);
  const chapterEls = useRef([]);
  const pointEls = useRef({});
  const labelEls = useRef({});
  const railEls = useRef([]);
  const hintEl = useRef(null);

  const routes = useMemo(() => {
    const list = [];
    chapters.forEach((c, ci) => {
      const valid = (c.routes || []).filter(([a, b]) => {
        const ok = airports[a] && airports[b];
        if (!ok) console.warn(`ScrollGlobe: unknown airport in route ${a}-${b}`);
        return ok;
      });
      valid.forEach(([from, to], j) => {
        list.push({
          id: `${ci}-${j}`,
          from,
          to,
          chapter: ci,
          index: j,
          count: valid.length,
          km: Math.round(greatCircleKm(airports[from], airports[to])),
        });
      });
    });
    return list;
  }, [chapters, airports]);

  const usedAirports = useMemo(
    () => [...new Set(routes.flatMap((r) => [r.from, r.to]))],
    [routes]
  );
  const tint = useMemo(() => {
    const c = new THREE.Color(color);
    return `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
  }, [color]);

  // Optional: B612 was designed for aircraft cockpit displays.
  useEffect(() => {
    if (!loadFonts || document.getElementById("sg-b612-font")) return;
    const link = document.createElement("link");
    link.id = "sg-b612-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=B612:wght@400;700&family=B612+Mono&display=swap";
    document.head.appendChild(link);
  }, [loadFonts]);

  useEffect(() => {
    const host = canvasHostRef.current;
    const root = rootRef.current;
    if (!host || !root) return;

    const N = chapters.length;
    const R = 1;
    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const tanHalf = Math.tan(20 * DEG);
    const globe = new THREE.Group();
    scene.add(globe);

    const red = new THREE.Color(color);
    const hot = red.clone().lerp(new THREE.Color("#ffffff"), 0.45);
    const disposables = [];
    const track = (o) => (disposables.push(o), o);

    /* ---------- base sphere with a soft red limb ---------- */
    const baseMat = track(
      new THREE.ShaderMaterial({
        uniforms: {
          uBase: { value: new THREE.Color(background).lerp(new THREE.Color("#000"), 0.2) },
          uRim: { value: red.clone().multiplyScalar(0.55) },
        },
        vertexShader: `
          varying vec3 vN;
          void main(){
            vN = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }`,
        fragmentShader: `
          uniform vec3 uBase; uniform vec3 uRim; varying vec3 vN;
          void main(){
            float rim = 1.0 - max(dot(vN, vec3(0.0,0.0,1.0)), 0.0);
            gl_FragColor = vec4(mix(uBase, uRim, pow(rim, 3.0) * 0.7), 1.0);
          }`,
      })
    );
    globe.add(new THREE.Mesh(track(new THREE.SphereGeometry(R * 0.995, 72, 72)), baseMat));

    /* ---------- land as a field of dots ---------- */
    const isLand = makeLandTest(LAND_MASK);
    const DOTS = 30000;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pos = [];
    const rnd = [];
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2;
      const lat = Math.asin(y) / DEG;
      const lon = (((golden * i) / DEG) % 360) - 180;
      if (!isLand(lat, lon)) continue;
      const v = latLonToVec3(lat, lon, R * 1.002);
      pos.push(v.x, v.y, v.z);
      rnd.push(Math.random());
    }
    const dotGeo = track(new THREE.BufferGeometry());
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    dotGeo.setAttribute("aRand", new THREE.Float32BufferAttribute(rnd, 1));
    const dotMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: red },
          uTime: { value: 0 },
          uH: { value: 800 },
          uTan: { value: tanHalf },
          uTwinkle: { value: reduceMotion ? 0 : 1 },
        },
        vertexShader: `
          uniform float uH; uniform float uTan;
          attribute float aRand; varying float vRand; varying float vFacing;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 0.0125 * uH / (2.0 * uTan * -mv.z);
            gl_Position = projectionMatrix * mv;
            vRand = aRand;
            vFacing = normalize(normalMatrix * normalize(position)).z;
          }`,
        fragmentShader: `
          uniform vec3 uColor; uniform float uTime; uniform float uTwinkle;
          varying float vRand; varying float vFacing;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.15, d);
            float edge = smoothstep(-0.05, 0.55, vFacing);
            float tw = 1.0 - uTwinkle * 0.3 * (0.5 + 0.5 * sin(uTime * 1.4 + vRand * 60.0));
            gl_FragColor = vec4(uColor * (0.5 + 0.5 * edge) * tw, a * (0.3 + 0.7 * edge));
          }`,
      })
    );
    globe.add(new THREE.Points(dotGeo, dotMat));

    /* ---------- graticule ---------- */
    const grat = [];
    const gr = R * 1.001;
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let k = 0; k < 144; k++) {
        const a = latLonToVec3(lat, (k / 144) * 360 - 180, gr);
        const b = latLonToVec3(lat, ((k + 1) / 144) * 360 - 180, gr);
        grat.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    for (let lon = -180; lon < 180; lon += 15) {
      for (let k = 0; k < 72; k++) {
        const a = latLonToVec3(-90 + (k / 72) * 180, lon, gr);
        const b = latLonToVec3(-90 + ((k + 1) / 72) * 180, lon, gr);
        grat.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const gratGeo = track(new THREE.BufferGeometry());
    gratGeo.setAttribute("position", new THREE.Float32BufferAttribute(grat, 3));
    const gratMat = track(
      new THREE.LineBasicMaterial({ color: red, transparent: true, opacity: 0.09, depthWrite: false })
    );
    globe.add(new THREE.LineSegments(gratGeo, gratMat));

    /* ---------- atmosphere halo (camera-facing sprite) ---------- */
    const haloTex = track(
      radialTexture(512, [
        [0, `rgba(${tint},0)`],
        [0.7, `rgba(${tint},0)`],
        [0.755, `rgba(${tint},0.55)`],
        [0.8, `rgba(${tint},0.2)`],
        [0.9, `rgba(${tint},0.05)`],
        [1, `rgba(${tint},0)`],
      ])
    );
    const haloMat = track(
      new THREE.SpriteMaterial({
        map: haloTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    const halo = new THREE.Sprite(haloMat);
    const haloScale = (2 * R) / 0.755;
    halo.scale.set(haloScale, haloScale, 1);
    scene.add(halo);

    const dotTex = track(
      radialTexture(64, [
        [0, "rgba(255,255,255,1)"],
        [0.25, "rgba(255,255,255,0.8)"],
        [1, "rgba(255,255,255,0)"],
      ])
    );

    /* ---------- airport markers ---------- */
    const ringGeo = track(new THREE.RingGeometry(0.013, 0.019, 40));
    const coreGeo = track(new THREE.CircleGeometry(0.0075, 24));
    const pulseGeo = track(new THREE.RingGeometry(0.017, 0.02, 40));
    const zAxis = new THREE.Vector3(0, 0, 1);
    const markers = {};
    usedAirports.forEach((code, i) => {
      const ap = airports[code];
      const p = latLonToVec3(ap.lat, ap.lon, R * 1.004);
      const m = new THREE.Group();
      m.position.copy(p);
      m.quaternion.setFromUnitVectors(zAxis, p.clone().normalize());
      const mk = (geo, opacity) => {
        const mat = track(
          new THREE.MeshBasicMaterial({
            color: hot,
            transparent: true,
            opacity,
            depthWrite: false,
            side: THREE.DoubleSide,
          })
        );
        const mesh = new THREE.Mesh(geo, mat);
        m.add(mesh);
        return mesh;
      };
      const ring = mk(ringGeo, 0);
      const core = mk(coreGeo, 0);
      const pulse = mk(pulseGeo, 0);
      globe.add(m);
      markers[code] = { group: m, ring, core, pulse, a: 0, target: 0, phase: i * 0.37 };
    });

    /* ---------- arcs ---------- */
    const SEG = 96;
    const RAD = 6;
    const arcs = routes.map((r) => {
      const A = airports[r.from];
      const B = airports[r.to];
      const a = latLonToVec3(A.lat, A.lon, R * 1.002);
      const b = latLonToVec3(B.lat, B.lon, R * 1.002);
      const ang = a.angleTo(b);
      const alt = 0.05 + (ang / Math.PI) * 0.5;
      const c1 = a.clone().lerp(b, 0.25).normalize().multiplyScalar(R * (1 + alt));
      const c2 = a.clone().lerp(b, 0.75).normalize().multiplyScalar(R * (1 + alt));
      const curve = new THREE.CubicBezierCurve3(a, c1, c2, b);
      const coreGeoA = track(new THREE.TubeGeometry(curve, SEG, 0.0042, RAD, false));
      const glowGeoA = track(new THREE.TubeGeometry(curve, SEG, 0.012, RAD, false));
      const coreMat = track(
        new THREE.MeshBasicMaterial({
          color: hot,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      const glowMat = track(
        new THREE.MeshBasicMaterial({
          color: red,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      const coreMesh = new THREE.Mesh(coreGeoA, coreMat);
      const glowMesh = new THREE.Mesh(glowGeoA, glowMat);
      coreGeoA.setDrawRange(0, 0);
      glowGeoA.setDrawRange(0, 0);
      globe.add(glowMesh, coreMesh);

      const spriteMat = (c) =>
        track(
          new THREE.SpriteMaterial({
            map: dotTex,
            color: c,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            opacity: 0,
          })
        );
      const head = new THREE.Sprite(spriteMat(hot));
      head.scale.set(0.1, 0.1, 1);
      const traffic = new THREE.Sprite(spriteMat(hot));
      traffic.scale.set(0.055, 0.055, 1);
      globe.add(head, traffic);

      const start = r.chapter + 0.08 + r.index * (0.42 / Math.max(1, r.count));
      return {
        ...r,
        curve,
        coreGeo: coreGeoA,
        glowGeo: glowGeoA,
        coreMat,
        glowMat,
        head,
        traffic,
        start,
        end: start + 0.3,
        speed: 0.22 / curve.getLength(),
        offset: Math.random(),
        focus: 0,
        e: 0,
      };
    });

    /* ---------- chapter camera targets ---------- */
    const rotY = [];
    const rotX = [];
    const dist = [];
    chapters.forEach((c, i) => {
      const v = latLonToVec3(c.focus.lat, c.focus.lon, 1);
      const raw = -Math.atan2(v.x, v.z);
      rotY.push(i === 0 ? raw : rotY[i - 1] + wrapPi(raw - rotY[i - 1]));
      rotX.push(c.focus.lat * DEG * TILT);
      dist.push(c.distance || 3.8);
    });

    /* ---------- bullet reveal timings ---------- */
    // Mirrors the arc formula above: staggered across the first 0.42 of the
    // chapter, each taking 0.3 to complete.
    const pointTimings = [];
    chapters.forEach((c, ci) => {
      const pts = c.points || [];
      pts.forEach((_, j) => {
        const start = ci + 0.08 + j * (0.42 / Math.max(1, pts.length));
        pointTimings.push({ id: `${ci}-${j}`, start, end: start + 0.3 });
      });
    });

    /* ---------- sizing ---------- */
    let W = 1;
    let H = 1;
    let mobile = false;
    const resize = () => {
      W = Math.max(1, host.clientWidth);
      H = Math.max(1, host.clientHeight);
      mobile = W < 760;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      if (mobile) camera.setViewOffset(W, H, 0, H * 0.16, W, H);
      else camera.setViewOffset(W, H, -W * 0.16, 0, W, H);
      camera.updateProjectionMatrix();
      dotMat.uniforms.uH.value = H * renderer.getPixelRatio();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(root);

    /* ---------- loop ---------- */
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let sCur = 0;
    let spin = 0;
    const wp = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const nrm = new THREE.Vector3();
    const hasOverview = !!chapters[N - 1]?.overview;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      time += dt;

      // Scroll progress through this component (0 → N)
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const p = clamp(-rect.top / travel, 0, 1);
      const sTarget = p * N;
      sCur += (sTarget - sCur) * (1 - Math.exp(-dt * (reduceMotion ? 20 : 5)));

      const ci = Math.min(Math.floor(sCur), N - 1);
      const f = clamp(sCur - ci, 0, 1);
      const nx = Math.min(ci + 1, N - 1);
      const tr = ci < N - 1 ? smoothstep(0.7, 1.0, f) : 0;

      // Slow spin in the overview chapter, unwound smoothly when leaving it
      const spinW = hasOverview ? smoothstep(N - 1 + 0.15, N - 1 + 0.5, sCur) : 0;
      if (!reduceMotion) spin += dt * 0.1 * spinW;
      const home = Math.round(spin / TAU) * TAU;
      spin += (home - spin) * (1 - spinW) * Math.min(1, dt * 2.5);
      const idle = reduceMotion ? 0 : Math.sin(time * 0.25) * 0.025;

      const ry = lerp(rotY[ci], rotY[nx], tr) + spin + idle;
      const rx = lerp(rotX[ci], rotX[nx], tr);
      globe.rotation.set(rx, ry, 0);

      let d = lerp(dist[ci], dist[nx], tr);
      if (camera.aspect < 1) d = Math.max(d, 0.95 / (tanHalf * camera.aspect));
      camera.position.set(0, 0, d);
      camera.lookAt(0, 0, 0);

      dotMat.uniforms.uTime.value = time;
      Object.values(markers).forEach((m) => (m.target = 0));

      // Arcs
      let done = 0;
      const inOverview = hasOverview && ci === N - 1;
      arcs.forEach((arc) => {
        const raw = clamp((sCur - arc.start) / (arc.end - arc.start), 0, 1);
        const e = easeInOut(raw);
        arc.e = e;
        if (e >= 0.999) done++;
        const drawn = Math.floor(e * SEG) * RAD * 6;
        arc.coreGeo.setDrawRange(0, drawn);
        arc.glowGeo.setDrawRange(0, drawn);

        const focusTarget = arc.chapter === ci || inOverview ? 1 : 0.32;
        arc.focus += (focusTarget - arc.focus) * Math.min(1, dt * 4);
        arc.coreMat.opacity = 0.95 * arc.focus;
        arc.glowMat.opacity = 0.2 * arc.focus;

        // Leading "aircraft" while the arc is being drawn
        const drawing = e > 0.001 && e < 0.999;
        arc.head.material.opacity = drawing ? 1 : 0;
        if (drawing) arc.curve.getPoint(e, arc.head.position);

        // Continuous traffic once the arc is complete
        const trafficOn = !reduceMotion && e >= 0.999;
        if (trafficOn) {
          const t = (time * arc.speed + arc.offset) % 1;
          arc.curve.getPoint(t, arc.traffic.position);
          arc.traffic.material.opacity = smoothstep(0, 0.08, t) * smoothstep(1, 0.92, t) * 0.9 * arc.focus;
        } else arc.traffic.material.opacity = 0;

        if (e > 0.001) markers[arc.from].target = Math.max(markers[arc.from].target, arc.focus);
        if (e > 0.97) markers[arc.to].target = Math.max(markers[arc.to].target, arc.focus);
      });

      // Bullet points: same start/end curve as the arcs, so the copy reveals in
      // step with the routes drawing. Driven off sCur rather than off an arc, so
      // a slide with no routes (the last one) still reveals its list.
      pointTimings.forEach((p) => {
        const row = pointEls.current[p.id];
        if (!row) return;
        const e = easeInOut(clamp((sCur - p.start) / (p.end - p.start), 0, 1));
        const shown = smoothstep(0, 0.22, e);
        row.fill.style.clipPath = `inset(0 ${((1 - e) * 100).toFixed(2)}% 0 0)`;
        row.el.style.opacity = (0.12 + 0.88 * shown).toFixed(3);
        row.el.style.transform = `translateY(${((1 - shown) * 10).toFixed(1)}px)`;
      });

      // Markers + labels
      scene.updateMatrixWorld();
      camera.updateMatrixWorld();
      Object.entries(markers).forEach(([code, m]) => {
        m.a += (m.target - m.a) * Math.min(1, dt * 6);
        m.ring.material.opacity = 0.9 * m.a;
        m.core.material.opacity = m.a;
        const ph = reduceMotion ? 0.35 : (time * 0.55 + m.phase) % 1;
        m.pulse.scale.setScalar(1 + ph * 2.6);
        m.pulse.material.opacity = (1 - ph) * 0.55 * m.a;

        const label = labelEls.current[code];
        if (!label) return;
        m.group.getWorldPosition(wp);
        nrm.copy(wp).normalize();
        camDir.copy(camera.position).sub(wp).normalize();
        const facing = nrm.dot(camDir);
        const op = m.a * smoothstep(0.12, 0.35, facing);
        wp.project(camera);
        const x = (wp.x * 0.5 + 0.5) * W;
        const y = (-wp.y * 0.5 + 0.5) * H;
        label.style.opacity = op.toFixed(3);
        label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });

      // Text + HUD
      chapterEls.current.forEach((el, i) => {
        if (!el) return;
        const fin = i === 0 ? 1 : smoothstep(i - 0.12, i + 0.12, sCur);
        const fout = i === N - 1 ? 0 : smoothstep(i + 0.78, i + 0.95, sCur);
        const o = fin * (1 - fout);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * (sCur < i + 0.5 ? 14 : -14)).toFixed(1)}px)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
      railEls.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${clamp(sCur - i, 0, 1)})`;
      });
      if (hintEl.current) hintEl.current.style.opacity = String(1 - smoothstep(0.02, 0.2, sCur));

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [routes, usedAirports, chapters, airports, color, background, tint]);

  const N = chapters.length;
  const css = `
    .sg-root{position:relative;background:${background};color:#f4dadc;
      font-family:'B612',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;}
    .sg-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;
      background:radial-gradient(90% 80% at 66% 50%, rgba(${tint},0.09), rgba(${tint},0) 60%), ${background};}
    .sg-canvas{position:absolute;inset:0}
    .sg-canvas canvas{display:block;width:100%;height:100%}
    .sg-mono{font-family:'B612 Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
    /* Wider than the original 440px: six bullet lines need the measure. */
    .sg-chapters{position:absolute;left:clamp(20px,5vw,72px);top:0;bottom:0;width:min(560px,44vw)}
    .sg-chapter{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;
      opacity:0;will-change:opacity,transform}
    .sg-title{font-size:clamp(26px,2.9vw,40px);line-height:1.08;font-weight:700;margin:0 0 22px;
      letter-spacing:-0.01em;color:#fff1f2}
    .sg-body{font-size:15px;line-height:1.62;color:#dcb9bd;margin:0 0 28px;max-width:40ch}
    /* One bullet per row: a glowing dot beside the copy, then its strip. */
    .sg-points{list-style:none;margin:0;padding:0;display:grid;gap:20px}
    .sg-point{display:grid;gap:10px;opacity:0;will-change:opacity,transform}
    .sg-point-row{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start}
    /* margin-top centres the dot on the first line rather than the box top. */
    .sg-dot{width:8px;height:8px;margin-top:0.52em;border-radius:50%;background:rgb(${tint});
      box-shadow:0 0 8px 1px rgba(${tint},0.9),0 0 18px rgba(${tint},0.5)}
    .sg-point-text{font-size:17px;line-height:1.5;color:#f0dcde}
    .sg-ai{font-style:normal;font-weight:700;color:rgb(${tint})}
    /* Voice-memo waveform: a row of centred bars in place of the old flat rule. */
    .sg-wave{position:relative;height:26px}
    .sg-wave-track,.sg-wave .sg-fill{position:absolute;inset:0;display:flex;
      align-items:center;gap:2px}
    .sg-wave i{flex:1 1 0;min-width:2px;border-radius:99px}
    .sg-wave-track i{background:rgba(${tint},0.18)}
    .sg-wave .sg-fill i{background:rgb(${tint});box-shadow:0 0 6px rgba(${tint},0.7)}
    /* Clipped rather than scaled: scaleX would squash the bars sideways instead
       of revealing them. Starts fully clipped; the loop opens it on scroll. */
    .sg-wave .sg-fill{clip-path:inset(0 100% 0 0);will-change:clip-path}
    .sg-foot{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:flex-end;justify-content:space-between;
      gap:24px;padding:22px clamp(20px,4vw,56px);font-size:12px;color:#b98b91;pointer-events:none}
    .sg-rail{display:flex;gap:6px;width:min(300px,34vw)}
    .sg-seg{position:relative;flex:1;height:2px;background:rgba(${tint},0.2)}
    .sg-seg i{position:absolute;inset:0;background:rgb(${tint});transform-origin:left center;transform:scaleX(0)}
    .sg-hint{position:absolute;left:50%;bottom:74px;transform:translateX(-50%);font-size:12px;color:#b98b91;
      display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none}
    .sg-hint i{width:1px;height:28px;background:linear-gradient(rgba(${tint},0),rgb(${tint}));
      animation:sg-drop 1.8s ease-in-out infinite}
    @keyframes sg-drop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}
      51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
    .sg-shade{display:none}
    @media (max-width:760px){
      .sg-shade{display:block;position:absolute;left:0;right:0;bottom:0;height:58%;pointer-events:none;
        background:linear-gradient(rgba(0,0,0,0), ${background} 38%)}
      .sg-chapters{left:20px;right:20px;width:auto;top:38%;bottom:56px}
      .sg-chapter{justify-content:flex-end;overflow-y:auto}
      .sg-title{font-size:24px;margin-bottom:14px}
      .sg-body{font-size:14px;margin-bottom:18px}
      .sg-points{gap:14px}
      .sg-point-row{gap:11px}
      .sg-point-text{font-size:15px;line-height:1.45}
      .sg-dot{width:7px;height:7px}
      .sg-rail{width:40vw}
      .sg-hint{display:none}
    }
    @media (prefers-reduced-motion: reduce){ .sg-hint i{animation:none} }
  `;

  return (
    <section
      ref={rootRef}
      className={`sg-root ${className}`}
      style={{ height: `${N * heightPerChapter}vh`, ...style }}
      aria-label="Flight route monitor"
    >
      <style>{css}</style>
      <div className="sg-stage">
        <div ref={canvasHostRef} className="sg-canvas" aria-hidden="true" />

        <div className="sg-shade" />

        <div className="sg-chapters">
          {chapters.map((c, i) => {
            const pts = c.points || [];
            return (
              <article key={i} className="sg-chapter" ref={(el) => (chapterEls.current[i] = el)}>
                {/* Rendered only when set, so a blank slide collapses instead
                    of leaving an empty heading holding its margins open. */}
                {c.title && <h2 className="sg-title">{markAI(c.title)}</h2>}
                {c.body && <p className="sg-body">{markAI(c.body)}</p>}
                {pts.length > 0 && (
                  <ul className="sg-points">
                    {pts.map((text, j) => (
                      <li
                        key={j}
                        className="sg-point"
                        ref={(el) => {
                          if (!el) return;
                          pointEls.current[`${i}-${j}`] = {
                            el,
                            fill: el.querySelector(".sg-fill"),
                          };
                        }}
                      >
                        <span className="sg-point-row">
                          <span className="sg-dot" aria-hidden="true" />
                          <span className="sg-point-text">{markAI(text)}</span>
                        </span>
                        <Waveform seed={i * 7 + j * 3 + 1} />
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        <div className="sg-hint sg-mono" ref={hintEl}>
          <span>Scroll to follow the routes</span>
          <i />
        </div>

        <div className="sg-foot sg-mono">
          <div className="sg-rail" aria-hidden="true">
            {chapters.map((_, i) => (
              <span key={i} className="sg-seg">
                <i ref={(el) => (railEls.current[i] = el)} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
