/**
 * A drawn map of the streets around the hospital (no third-party map, no cookies).
 * MotionScope draws the streets, drops the pins and traces the walk from the metro.
 */
export function AreaMap() {
  const label = { fontFamily: 'var(--sans)' };
  return (
    <div className="map" data-map>
      <svg
        role="img"
        aria-label="Map of the streets around Velune Hospital, showing the main entrance at Gate 1 on Riverside Avenue, the emergency entrance at Gate 2 on Market Road, and a 6-minute walk from the metro station"
        viewBox="0 0 700 460"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block', background: '#EEF2F8' }}
      >
        <path d="M0 330 C 120 300 200 360 330 330 S 560 270 700 300 L 700 460 L 0 460 Z" fill="#D6E2F5" />
        <g fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round">
          <path className="rd" pathLength={1} d="M-10 120 L 710 160" />
          <path className="rd" pathLength={1} d="M180 -10 L 230 470" />
          <path className="rd" pathLength={1} d="M470 -10 L 430 470" />
          <path className="rd" pathLength={1} d="M-10 250 L 710 230" />
        </g>
        <g fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round">
          <path className="rd" pathLength={1} d="M60 -10 L 90 300" />
          <path className="rd" pathLength={1} d="M600 -10 L 620 280" />
          <path className="rd" pathLength={1} d="M230 60 L 470 80" />
        </g>
        <g className="bld" fill="#E2E8F3">
          <rect x="250" y="160" width="150" height="56" rx="4" />
          <rect x="490" y="170" width="100" height="50" rx="4" />
          <rect x="100" y="140" width="70" height="90" rx="4" />
          <rect x="250" y="20" width="160" height="50" rx="4" />
        </g>
        <path
          className="route"
          pathLength={1}
          d="M540 170 L 540 151 L 325 139 L 325 176"
          fill="none"
          stroke="#B8862F"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text className="lbl" x="372" y="128" style={label} fontSize="12" fontWeight="600" fill="#7A5512">
          6 min walk
        </text>
        <text className="lbl" x="40" y="410" style={label} fontSize="14" fill="#5A6377">
          Periyar riverside
        </text>
        <text className="lbl" x="492" y="142" style={label} fontSize="13" fill="#5A6377">
          Metro station
        </text>
        <g transform="translate(325 188)">
          <circle className="ripple" r="11" fill="none" stroke="#1E3A8A" strokeWidth="2" />
          <g className="pin">
            <circle r="11" fill="#1E3A8A" />
            <circle r="4" fill="#fff" />
          </g>
        </g>
        <text className="lbl" x="342" y="180" style={label} fontSize="14" fontWeight="600" fill="#0D1838">
          Velune Hospital, Gate 1
        </text>
        <g transform="translate(255 238)">
          <g className="pin">
            <circle r="9" fill="#C8372D" />
            <circle r="3.5" fill="#fff" />
          </g>
        </g>
        <text className="lbl" x="270" y="262" style={label} fontSize="13" fontWeight="600" fill="#9A2A20">
          Emergency, Gate 2
        </text>
      </svg>
    </div>
  );
}
