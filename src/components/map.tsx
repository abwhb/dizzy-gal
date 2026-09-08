import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
// 110m resolution keeps the inline SVG around 80 KB; 50m would be ~750 KB.
import world from "world-atlas/countries-110m.json";

import { mapPoints } from "@/lib/content";

/**
 * Vita-style destination map: real country outlines from Natural Earth,
 * drawn as barely-lighter land with hairline borders on the page ground,
 * vignetted at the edges, with the agency's destinations as amber points.
 * Everything is computed at build time; the output is a static SVG.
 */
const W = 1400;
const H = 760;

/** Montréal in the top-left, Kuala Lumpur bottom-right, like Vita's crop. */
const WINDOW = { west: -105, east: 128, north: 74, south: -10 };

const topology = world as unknown as Topology<{ countries: GeometryCollection }>;
const countries = feature(topology, topology.objects.countries);

// Fit to the window's corner points (a polygon this large would be read as
// the rest of the sphere), then clip so only the visible land is emitted.
const projection = geoMercator()
  .fitSize([W, H], {
    type: "MultiPoint",
    coordinates: [
      [WINDOW.west, WINDOW.south],
      [WINDOW.east, WINDOW.north],
      [WINDOW.west, WINDOW.north],
      [WINDOW.east, WINDOW.south],
    ],
  })
  .clipExtent([
    [0, 0],
    [W, H],
  ]);
const path = geoPath(projection).digits(1);
const landPaths = countries.features.map((f) => path(f)).filter((d): d is string => Boolean(d));

function project(lat: number, lng: number) {
  const p = projection([lng, lat]) ?? [0, 0];
  return { x: p[0], y: p[1] };
}

export function DestinationMap() {
  const hub = mapPoints.find((p) => p.hub) ?? mapPoints[0];
  const hubXY = project(hub.lat, hub.lng);

  return (
    <section id="carte" className="scroll-mt-14 border-b border-line bg-night">
      <svg
        data-reveal
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Carte des destinations desservies au départ de Montréal"
        className="block h-auto w-full"
      >
        <defs>
          <radialGradient id="map-vignette" cx="50%" cy="50%" r="62%">
            <stop offset="0" stopColor="#0a1a20" stopOpacity="0" />
            <stop offset="0.7" stopColor="#0a1a20" stopOpacity="0.15" />
            <stop offset="1" stopColor="#0a1a20" stopOpacity="0.92" />
          </radialGradient>
          <radialGradient id="map-glow">
            <stop offset="0" stopColor="#f2a93b" stopOpacity=".55" />
            <stop offset="1" stopColor="#f2a93b" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="#0a1a20" />

        <g fill="#0f2129" stroke="#1d353d" strokeWidth="0.7" strokeLinejoin="round">
          {landPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        <rect width={W} height={H} fill="url(#map-vignette)" />

        <g fill="none" stroke="#f2a93b" strokeOpacity=".3" strokeWidth="1" strokeDasharray="3 5">
          {mapPoints
            .filter((p) => !p.hub)
            .map((p) => {
              const { x, y } = project(p.lat, p.lng);
              const cx = (hubXY.x + x) / 2;
              const cy = Math.min(hubXY.y, y) - Math.abs(x - hubXY.x) * 0.16;
              return <path key={p.name} d={`M${hubXY.x},${hubXY.y} Q${cx},${cy} ${x},${y}`} />;
            })}
        </g>

        {mapPoints.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          const r = p.hub ? 6 : 4.5;
          return (
            <g key={p.name}>
              <circle cx={x} cy={y} r={r * 4} fill="url(#map-glow)" />
              <circle cx={x} cy={y} r={r} fill="#f2a93b" />
              <text
                x={x}
                y={p.labelBelow ? y + r + 17 : y - r - 9}
                textAnchor="middle"
                fill="#96a6ab"
                fontSize="13"
                fontWeight="600"
                fontFamily="inherit"
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
