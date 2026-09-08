import { mapPoints } from "@/lib/content";

/**
 * Equirectangular projection of the agency's destinations, drawn as amber
 * points on a graticule. The window covers roughly Montréal to Kuala Lumpur.
 */
const WINDOW = { west: -100, east: 125, north: 62, south: -8 };
const W = 1200;
const H = 560;

function project(lat: number, lng: number) {
  const x = ((lng - WINDOW.west) / (WINDOW.east - WINDOW.west)) * W;
  const y = ((WINDOW.north - lat) / (WINDOW.north - WINDOW.south)) * H;
  return { x, y };
}

export function DestinationMap() {
  const hub = mapPoints.find((p) => p.hub) ?? mapPoints[0];
  const hubXY = project(hub.lat, hub.lng);
  const meridians = Array.from({ length: 10 }, (_, i) => WINDOW.west + (i * (WINDOW.east - WINDOW.west)) / 9);
  const parallels = Array.from({ length: 6 }, (_, i) => WINDOW.north - (i * (WINDOW.north - WINDOW.south)) / 5);

  return (
    <section id="carte" className="scroll-mt-14 border-b border-line">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Carte des destinations desservies au départ de Montréal"
        className="block h-auto w-full"
      >
        <defs>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#f2a93b" stopOpacity=".55" />
            <stop offset="1" stopColor="#f2a93b" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="#1e333b" strokeWidth="1">
          {meridians.map((lng) => {
            const { x } = project(0, lng);
            return <line key={`m${lng}`} x1={x} y1={0} x2={x} y2={H} />;
          })}
          {parallels.map((lat) => {
            const { y } = project(lat, 0);
            return <line key={`p${lat}`} x1={0} y1={y} x2={W} y2={y} />;
          })}
        </g>

        <g fill="none" stroke="#f2a93b" strokeOpacity=".35" strokeWidth="1" strokeDasharray="3 5">
          {mapPoints
            .filter((p) => !p.hub)
            .map((p) => {
              const { x, y } = project(p.lat, p.lng);
              const cx = (hubXY.x + x) / 2;
              const cy = Math.min(hubXY.y, y) - Math.abs(x - hubXY.x) * 0.18;
              return <path key={p.name} d={`M${hubXY.x},${hubXY.y} Q${cx},${cy} ${x},${y}`} />;
            })}
        </g>

        {mapPoints.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          const r = p.hub ? 6 : 4;
          return (
            <g key={p.name}>
              <circle cx={x} cy={y} r={r * 4} fill="url(#glow)" />
              <circle cx={x} cy={y} r={r} fill="#f2a93b" />
              <text
                x={x}
                y={y - r - 8}
                textAnchor="middle"
                fill="#96a6ab"
                fontSize="12"
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
