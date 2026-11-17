/* ========================================================================
   3. APPLICATION STATE & PERSISTENCE + ADAPTIVE HEADCOUNT LAYOUT ENGINE
   ======================================================================== */
const STATE_KEY = 'nps_promoter_daily_state_v1';

function getLocalDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const state = {
  date: getLocalDateString(0),
  dateFormat: 'dot',
  theme: 'bright',
  crop: 'sticker',
  badgeMode: 'auto',
  promoters: []
};

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.date = parsed.date || getLocalDateString(0);
      state.dateFormat = parsed.dateFormat || 'dot';
      state.theme = parsed.theme || 'bright';
      state.crop = parsed.crop || 'sticker';
      state.badgeMode = parsed.badgeMode || 'auto';
      if (Array.isArray(parsed.promoters)) {
        state.promoters = parsed.promoters;
        return;
      }
    }
  } catch (_) {}

  state.promoters = [
    { id: 'demo-1', name: 'Alex', accent: 0 },
    { id: 'demo-2', name: 'Chloe', accent: 1 },
    { id: 'demo-3', name: 'Leo', accent: 3 }
  ];
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (_) {}
}

function resolveAvatarSync(name) {
  const key = normalizeKey(name);
  if (vaultCache.has(key)) {
    return { src: vaultCache.get(key).dataUrl, source: 'vault' };
  }
  if (folderProbeCache.get(key)) {
    return { src: folderProbeCache.get(key), source: 'folder' };
  }
  return { src: generateMemojiPlaceholder(name), source: 'placeholder' };
}

function computeLayoutMetrics(count) {
  if (count <= 0) {
    return { rows: [], avatarCqh: 26, nameCqw: 2.0, colGapCqw: 6, rowGapCqh: 3, innerGapCqh: 1.8, modeName: 'empty' };
  }
  if (count === 1) {
    return { rows: [1], avatarCqh: 36.5, nameCqw: 2.55, colGapCqw: 0, rowGapCqh: 0, innerGapCqh: 2.2, modeName: '1-solo-centered' };
  }
  if (count === 2) {
    return { rows: [2], avatarCqh: 30.0, nameCqw: 2.15, colGapCqw: 11.5, rowGapCqh: 0, innerGapCqh: 2.0, modeName: '2-duo-balanced' };
  }
  if (count === 3) {
    return { rows: [3], avatarCqh: 25.5, nameCqw: 1.9, colGapCqw: 7.2, rowGapCqh: 0, innerGapCqh: 1.8, modeName: '3-trio-spread' };
  }
  if (count === 4) {
    return { rows: [4], avatarCqh: 21.0, nameCqw: 1.68, colGapCqw: 4.4, rowGapCqh: 0, innerGapCqh: 1.6, modeName: '4-gallery-row' };
  }
  if (count === 5) {
    return { rows: [3, 2], avatarCqh: 19.2, nameCqw: 1.52, colGapCqw: 5.8, rowGapCqh: 3.0, innerGapCqh: 1.3, modeName: '5-staggered-3x2' };
  }
  if (count === 6) {
    return { rows: [3, 3], avatarCqh: 18.8, nameCqw: 1.5, colGapCqw: 5.4, rowGapCqh: 3.0, innerGapCqh: 1.3, modeName: '6-grid-3x3' };
  }
  if (count === 7) {
    return { rows: [4, 3], avatarCqh: 17.6, nameCqw: 1.42, colGapCqw: 4.0, rowGapCqh: 2.8, innerGapCqh: 1.2, modeName: '7-staggered-4x3' };
  }
  if (count === 8) {
    return { rows: [4, 4], avatarCqh: 17.2, nameCqw: 1.4, colGapCqw: 3.8, rowGapCqh: 2.8, innerGapCqh: 1.2, modeName: '8-grid-4x4' };
  }
  if (count <= 10) {
    const top = Math.ceil(count / 2);
    return { rows: [top, count - top], avatarCqh: 15.2, nameCqw: 1.28, colGapCqw: 2.9, rowGapCqh: 2.5, innerGapCqh: 1.1, modeName: `${count}-multi-2row` };
  }
  const r1 = Math.ceil(count / 3);
  const rem = count - r1;
  const r2 = Math.ceil(rem / 2);
  const r3 = rem - r2;
  return { rows: [r1, r2, r3], avatarCqh: 12.2, nameCqw: 1.12, colGapCqw: 2.4, rowGapCqh: 1.9, innerGapCqh: 0.9, modeName: `${count}-multi-3row` };
}

function formatPosterDate(isoDate, format) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  if (format === 'slash') return `${y} / ${m} / ${d}`;
  if (format === 'en') {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const mIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1));
    return `${months[mIdx]} ${d} · ${y}`;
  }
  return `${y}.${m}.${d}`;
}

function getPosterSubWord() {
  if (state.badgeMode === 'promote') return 'PROMOTE';
  if (state.badgeMode === 'singular') return 'PROMOTER';
  return state.promoters.length > 1 ? 'PROMOTERS' : 'PROMOTER';
}
