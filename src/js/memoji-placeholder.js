/* ========================================================================
   1. EXPRESSIVE MEMOJI-STYLE PLACEHOLDER SVG GENERATOR
      (Used automatically before real Memoji PNGs are added)
   ======================================================================== */
function hashName(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function generateMemojiPlaceholder(name) {
  const seed = hashName((name || 'Promoter').trim().toLowerCase());

  const skinPalettes = [
    { base: '#FFDFC4', blush: '#FF9E8A', shadow: '#F0C09C' },
    { base: '#FCE2C4', blush: '#FFA396', shadow: '#EBC39B' },
    { base: '#F5CBA7', blush: '#F48FB1', shadow: '#E0AC82' },
    { base: '#E8B892', blush: '#E57373', shadow: '#CFA07A' }
  ];
  const hairColors = ['#1F2024', '#3B2820', '#593A28', '#2C3545', '#7A4928', '#18181B'];
  const shirtColors = ['#2563EB', '#FF5938', '#14B88A', '#8B5CF6', '#F59E0B', '#EC4899'];

  const skin = skinPalettes[seed % skinPalettes.length];
  const hair = hairColors[(seed >> 2) % hairColors.length];
  const shirt = shirtColors[(seed >> 4) % shirtColors.length];
  const hairStyle = (seed >> 3) % 5;
  const hasGlasses = (seed % 4) === 1;
  const isWink = (seed % 5) === 2;

  let hairBack = '';
  let hairFront = '';

  if (hairStyle === 0) {
    hairFront = `
      <path d="M112 168 C108 102, 152 68, 204 70 C256 72, 292 106, 288 168 C275 132, 240 116, 192 118 C150 120, 126 140, 112 168 Z" fill="${hair}"/>
      <path d="M132 98 C165 72, 238 74, 266 108 C242 96, 184 96, 132 98 Z" fill="rgba(255,255,255,0.12)"/>
    `;
  } else if (hairStyle === 1) {
    hairBack = `<rect x="102" y="120" width="196" height="145" rx="76" fill="${hair}"/>`;
    hairFront = `
      <path d="M112 164 C115 102, 155 74, 200 74 C245 74, 285 102, 288 164 C264 128, 236 116, 200 116 C164 116, 136 128, 112 164 Z" fill="${hair}"/>
    `;
  } else if (hairStyle === 2) {
    hairFront = `
      <circle cx="148" cy="108" r="34" fill="${hair}"/>
      <circle cx="184" cy="94" r="38" fill="${hair}"/>
      <circle cx="224" cy="96" r="36" fill="${hair}"/>
      <circle cx="256" cy="114" r="32" fill="${hair}"/>
      <circle cx="124" cy="134" r="24" fill="${hair}"/>
      <circle cx="276" cy="136" r="24" fill="${hair}"/>
    `;
  } else if (hairStyle === 3) {
    hairBack = `
      <circle cx="200" cy="66" r="36" fill="${hair}"/>
      <rect x="108" y="126" width="184" height="120" rx="64" fill="${hair}"/>
    `;
    hairFront = `
      <path d="M114 164 C118 106, 154 80, 200 80 C246 80, 282 106, 286 164 C258 134, 224 122, 114 164 Z" fill="${hair}"/>
    `;
  } else {
    hairFront = `
      <path d="M112 152 C116 96, 152 72, 200 72 C248 72, 284 96, 288 152 Z" fill="${shirt}"/>
      <path d="M102 146 Q200 124 306 148 Q312 158 294 160 Q200 142 108 158 Z" fill="#18181B"/>
    `;
  }

  const leftEye = `
    <ellipse cx="166" cy="186" rx="10" ry="11.5" fill="#18181B"/>
    <circle cx="169" cy="182" r="3.5" fill="#FFFFFF"/>
  `;
  const rightEye = isWink
    ? `<path d="M222 187 Q234 176 246 187" stroke="#18181B" stroke-width="6.5" stroke-linecap="round" fill="none"/>`
    : `<ellipse cx="234" cy="186" rx="10" ry="11.5" fill="#18181B"/><circle cx="237" cy="182" r="3.5" fill="#FFFFFF"/>`;

  const glassesSvg = hasGlasses ? `
    <g stroke="#18181B" stroke-width="5.5" fill="rgba(255,255,255,0.22)">
      <circle cx="166" cy="186" r="23"/>
      <circle cx="234" cy="186" r="23"/>
      <line x1="189" y1="186" x2="211" y2="186"/>
    </g>
  ` : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="faceG_${seed}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skin.base}"/>
          <stop offset="100%" stop-color="${skin.shadow}"/>
        </linearGradient>
      </defs>
      ${hairBack}
      <path d="M98 358 C106 298, 146 282, 200 282 C254 282, 294 298, 302 358 Z" fill="${shirt}" stroke="#18181B" stroke-width="6" stroke-linejoin="round"/>
      <path d="M168 282 L200 314 L232 282" fill="#FFFFFF" stroke="#18181B" stroke-width="5" stroke-linejoin="round"/>
      <rect x="176" y="252" width="48" height="42" rx="18" fill="${skin.shadow}"/>
      <circle cx="114" cy="194" r="20" fill="${skin.shadow}"/>
      <circle cx="286" cy="194" r="20" fill="${skin.shadow}"/>
      <rect x="118" y="96" width="164" height="182" rx="78" fill="url(#faceG_${seed})"/>
      <ellipse cx="148" cy="212" rx="16" ry="10" fill="${skin.blush}" opacity="0.55"/>
      <ellipse cx="252" cy="212" rx="16" ry="10" fill="${skin.blush}" opacity="0.55"/>
      <path d="M150 162 Q166 154 180 161" stroke="${hair}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      <path d="M220 161 Q234 154 250 162" stroke="${hair}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      ${leftEye}
      ${rightEye}
      ${glassesSvg}
      <path d="M200 188 Q193 206 203 210" stroke="rgba(24,24,27,0.28)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M174 228 Q200 252 226 228 Z" fill="#FFFFFF" stroke="#18181B" stroke-width="5" stroke-linejoin="round"/>
      ${hairFront}
    </svg>
  `.trim();

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
