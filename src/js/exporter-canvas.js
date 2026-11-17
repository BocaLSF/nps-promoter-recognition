/* ========================================================================
   4. NATIVE 2K (2560 × 1440) CRISP BAUHAUS PNG CANVAS EXPORTER (100% OFFLINE)
   ======================================================================== */
function getThemeColors(themeName) {
  if (themeName === 'sunlit') {
    return { bg: '#F8FCFF', grid: 'rgba(15,45,80,0.045)', ink: '#122033', c1: '#0EA5E9', c2: '#FACC15', c3: '#FB7185', c4: '#10B981', backdrops: ['#FACC15', '#67B7FF', '#FB7185', '#34D399', '#818CF8'] };
  }
  if (themeName === 'studio') {
    return { bg: '#FCF8F0', grid: 'rgba(30,24,18,0.05)', ink: '#1B1917', c1: '#1D4ED8', c2: '#F59E0B', c3: '#EF4444', c4: '#0D9488', backdrops: ['#FBBF24', '#60A5FA', '#F87171', '#2DD4BF', '#F472B6'] };
  }
  return { bg: '#FFFDF7', grid: 'rgba(24,24,27,0.042)', ink: '#16181D', c1: '#2563EB', c2: '#FFD233', c3: '#FF5938', c4: '#14B88A', backdrops: ['#FFD233', '#67B7FF', '#FF856B', '#4AE3B5', '#A594F9'] };
}

function loadImageAsync(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    const radii = typeof r === 'number' ? Math.min(r, w / 2, h / 2) : r;
    ctx.roundRect(x, y, w, h, radii);
    return;
  }
  const rad = Math.min(Array.isArray(r) ? r[0] : r, w / 2, h / 2);
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

async function exportHighResPosterPNG() {
  showToast('✻ 正在渲染 2560×1440 高清海报...');
  const W = 2560;
  const H = 1440;
  const cqw = W / 100;
  const cqh = H / 100;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const pal = getThemeColors(state.theme);
  const strokeW = 0.2 * cqw;

  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = pal.grid;
  ctx.lineWidth = 1.5;
  const step = 5 * cqw;
  for (let x = 0; x <= W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.lineWidth = 0.22 * cqw;
  ctx.strokeStyle = pal.ink;

  ctx.beginPath();
  ctx.arc(W + 3 * cqw - 7 * cqw, -6 * cqh + 7 * cqw, 7 * cqw, 0, Math.PI * 2);
  ctx.fillStyle = pal.c2; ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.arc(W - 10.25 * cqw, 14.5 * cqh, 1.05 * cqw, 0, Math.PI * 2);
  ctx.fillStyle = pal.c3; ctx.fill(); ctx.stroke();

  drawRoundRect(ctx, 3.2 * cqw, H + 3.5 * cqh - 9.5 * cqw, 9.5 * cqw, 9.5 * cqw, [4.75 * cqw, 4.75 * cqw, 0, 0]);
  ctx.fillStyle = pal.c1; ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.arc(12.9 * cqw, H - 7.4 * cqh, 1.7 * cqw, 0, Math.PI * 2);
  ctx.fillStyle = pal.c2; ctx.fill(); ctx.stroke();

  ctx.save();
  ctx.translate(4.5 * cqw, H - 14.5 * cqh);
  ctx.rotate(-28 * Math.PI / 180);
  drawRoundRect(ctx, -1.9 * cqw, -0.55 * cqw, 3.8 * cqw, 1.1 * cqw, 99);
  ctx.fillStyle = pal.c3; ctx.fill(); ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(W - 6.5 * cqw, H - 7.5 * cqh);
  ctx.rotate(14 * Math.PI / 180);
  drawRoundRect(ctx, -2.9 * cqw, -2.9 * cqw, 5.8 * cqw, 5.8 * cqw, 1.2 * cqw);
  ctx.fillStyle = pal.c4; ctx.fill(); ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(W - 9.5 * cqw, H - 12.5 * cqh, 2.1 * cqw, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.68)'; ctx.fill(); ctx.stroke();

  ctx.save();
  ctx.translate(4.3 * cqw, 45.5 * cqh);
  ctx.rotate(45 * Math.PI / 180);
  drawRoundRect(ctx, -1.1 * cqw, -1.1 * cqw, 2.2 * cqw, 2.2 * cqw, 0.35 * cqw);
  ctx.fillStyle = pal.c4; ctx.fill(); ctx.stroke();
  ctx.restore();

  const headerY = 7.4 * cqh;
  let leftX = 4.8 * cqw;

  const trioW = 5.4 * cqw;
  const trioH = 2.4 * cqw;
  drawRoundRect(ctx, leftX + 0.25 * cqw, headerY - trioH / 2 + 0.25 * cqw, trioW, trioH, 999);
  ctx.fillStyle = pal.ink; ctx.fill();
  drawRoundRect(ctx, leftX, headerY - trioH / 2, trioW, trioH, 999);
  ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.lineWidth = strokeW; ctx.strokeStyle = pal.ink; ctx.stroke();

  ctx.lineWidth = 0.13 * cqw;
  ctx.beginPath(); ctx.arc(leftX + 1.45 * cqw, headerY, 0.56 * cqw, 0, Math.PI * 2);
  ctx.fillStyle = pal.c3; ctx.fill(); ctx.stroke();

  ctx.fillStyle = pal.c1;
  ctx.fillRect(leftX + 2.35 * cqw, headerY - 0.54 * cqw, 1.08 * cqw, 1.08 * cqw);
  ctx.strokeRect(leftX + 2.35 * cqw, headerY - 0.54 * cqw, 1.08 * cqw, 1.08 * cqw);

  ctx.save();
  ctx.translate(leftX + 4.15 * cqw, headerY);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = pal.c2;
  ctx.fillRect(-0.52 * cqw, -0.52 * cqw, 1.04 * cqw, 1.04 * cqw);
  ctx.strokeRect(-0.52 * cqw, -0.52 * cqw, 1.04 * cqw, 1.04 * cqw);
  ctx.restore();

  leftX += trioW + 1.15 * cqw;

  ctx.font = `900 ${3.35 * cqw}px "Avenir Next", -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif`;
  ctx.fillStyle = pal.ink;
  ctx.textBaseline = 'middle';
  ctx.fillText('NPS', leftX, headerY + 0.1 * cqw);
  leftX += ctx.measureText('NPS').width + 0.85 * cqw;

  const subText = getPosterSubWord();
  ctx.font = `800 ${1.62 * cqw}px "Avenir Next", -apple-system, BlinkMacSystemFont, sans-serif`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${0.14 * 1.62 * cqw}px`;
  const pillW = ctx.measureText(subText).width + 2.4 * cqw;
  const pillH = 2.65 * cqw;

  drawRoundRect(ctx, leftX + 0.25 * cqw, headerY - pillH / 2 + 0.25 * cqw, pillW, pillH, 999);
  ctx.fillStyle = pal.ink; ctx.fill();
  drawRoundRect(ctx, leftX, headerY - pillH / 2, pillW, pillH, 999);
  ctx.fillStyle = pal.c1; ctx.fill();
  ctx.lineWidth = strokeW; ctx.strokeStyle = pal.ink; ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(subText, leftX + pillW / 2, headerY + 0.08 * cqw);
  ctx.textAlign = 'left';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  const dateStr = formatPosterDate(state.date, state.dateFormat);
  ctx.font = `700 ${1.45 * cqw}px "SF Mono", "Menlo", monospace`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${0.06 * 1.45 * cqw}px`;
  const datePillW = ctx.measureText(dateStr).width + 3.9 * cqw;
  const datePillH = 2.6 * cqw;
  const dateX = W - 4.8 * cqw - datePillW;

  drawRoundRect(ctx, dateX + 0.25 * cqw, headerY - datePillH / 2 + 0.25 * cqw, datePillW, datePillH, 999);
  ctx.fillStyle = pal.ink; ctx.fill();
  drawRoundRect(ctx, dateX, headerY - datePillH / 2, datePillW, datePillH, 999);
  ctx.fillStyle = '#FFFFFF'; ctx.fill();
  ctx.lineWidth = strokeW; ctx.strokeStyle = pal.ink; ctx.stroke();

  ctx.beginPath();
  ctx.arc(dateX + 1.45 * cqw, headerY, 0.39 * cqw, 0, Math.PI * 2);
  ctx.fillStyle = pal.c4; ctx.fill();
  ctx.lineWidth = 0.13 * cqw; ctx.stroke();

  ctx.fillStyle = pal.ink;
  ctx.fillText(dateStr, dateX + 2.35 * cqw, headerY + 0.06 * cqw);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  const count = state.promoters.length;
  const metrics = computeLayoutMetrics(count);
  if (count > 0) {
    const avatarPx = metrics.avatarCqh * cqh;
    const innerGapPx = metrics.innerGapCqh * cqh;
    const nameFontPx = metrics.nameCqw * cqw;
    const namePillH = nameFontPx * 1.85;
    const cardH = avatarPx + innerGapPx + namePillH;
    const rowGapPx = metrics.rowGapCqh * cqh;
    const colGapPx = metrics.colGapCqw * cqw;

    const totalRowsH = metrics.rows.length * cardH + (metrics.rows.length - 1) * rowGapPx;
    let currentRowY = 14 * cqh + (81 * cqh - totalRowsH) / 2;

    const loadedImgs = await Promise.all(
      state.promoters.map(p => loadImageAsync(resolveAvatarSync(p.name).src))
    );

    let idx = 0;
    for (const rowLen of metrics.rows) {
      const rowTotalW = rowLen * avatarPx + (rowLen - 1) * colGapPx;
      let currentX = (W - rowTotalW) / 2;

      for (let col = 0; col < rowLen && idx < count; col++, idx++) {
        const person = state.promoters[idx];
        const accent = typeof person.accent === 'number' ? (person.accent % 5) : (idx % 5);
        const img = loadedImgs[idx];

        const boxX = currentX;
        const boxY = currentRowY;
        const pad = avatarPx * 0.04;
        const bdSize = avatarPx - pad * 2;
        const bdX = boxX + pad;
        const bdY = boxY + pad;

        let radii = bdSize / 2;
        if (state.crop !== 'circle') {
          if (accent === 1) radii = [bdSize * 0.44, bdSize * 0.44, bdSize * 0.22, bdSize * 0.22];
          else if (accent === 3) radii = bdSize * 0.3;
        }

        drawRoundRect(ctx, bdX + 0.4 * cqw, bdY + 0.4 * cqw, bdSize, bdSize, radii);
        ctx.fillStyle = pal.ink; ctx.fill();

        drawRoundRect(ctx, bdX, bdY, bdSize, bdSize, radii);
        ctx.fillStyle = pal.backdrops[accent]; ctx.fill();
        ctx.lineWidth = 0.24 * cqw; ctx.strokeStyle = pal.ink; ctx.stroke();

        if (img) {
          ctx.save();
          if (state.crop === 'circle') {
            const clipR = avatarPx * 0.43;
            ctx.beginPath();
            ctx.arc(boxX + avatarPx / 2, boxY + avatarPx / 2, clipR, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF'; ctx.fill();
            ctx.clip();
            const scale = Math.max((clipR * 2) / img.width, (clipR * 2) / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            ctx.drawImage(img, boxX + avatarPx / 2 - dw / 2, boxY + avatarPx / 2 - dh / 2, dw, dh);
            ctx.restore();
            ctx.beginPath();
            ctx.arc(boxX + avatarPx / 2, boxY + avatarPx / 2, clipR, 0, Math.PI * 2);
            ctx.lineWidth = 0.2 * cqw; ctx.strokeStyle = pal.ink; ctx.stroke();
          } else {
            const target = avatarPx * 0.96;
            const scale = Math.min(target / img.width, target / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            ctx.shadowColor = 'rgba(20,20,25,0.16)';
            ctx.shadowBlur = 16;
            ctx.shadowOffsetY = 7;
            ctx.drawImage(img, boxX + avatarPx / 2 - dw / 2, boxY + avatarPx / 2 - dh / 2 - avatarPx * 0.02, dw, dh);
            ctx.restore();
          }
        }

        const mini = avatarPx * 0.19;
        ctx.save();
        ctx.lineWidth = 0.2 * cqw;
        ctx.strokeStyle = pal.ink;
        if (accent === 0) {
          ctx.beginPath(); ctx.arc(boxX + avatarPx * 0.87, boxY + avatarPx * 0.13, mini / 2, 0, Math.PI * 2);
          ctx.fillStyle = pal.c1; ctx.fill(); ctx.stroke();
        } else if (accent === 1) {
          ctx.translate(boxX + avatarPx * 0.11, boxY + avatarPx * 0.85);
          ctx.rotate(-15 * Math.PI / 180);
          drawRoundRect(ctx, -mini / 2, -mini / 2, mini, mini, mini * 0.22);
          ctx.fillStyle = pal.c2; ctx.fill(); ctx.stroke();
        } else if (accent === 2) {
          ctx.beginPath(); ctx.arc(boxX + avatarPx * 0.13, boxY + avatarPx * 0.14, mini / 2, 0, Math.PI * 2);
          ctx.fillStyle = pal.c4; ctx.fill(); ctx.stroke();
        } else if (accent === 3) {
          ctx.beginPath(); ctx.arc(boxX + avatarPx * 0.88, boxY + avatarPx * 0.86, mini / 2, 0, Math.PI * 2);
          ctx.fillStyle = pal.c3; ctx.fill(); ctx.stroke();
        } else {
          ctx.translate(boxX + avatarPx * 0.86, boxY + avatarPx * 0.13);
          ctx.rotate(20 * Math.PI / 180);
          drawRoundRect(ctx, -mini / 2, -mini / 2, mini, mini, mini * 0.2);
          ctx.fillStyle = pal.c2; ctx.fill(); ctx.stroke();
        }
        ctx.restore();

        ctx.font = `800 ${nameFontPx}px "Avenir Next", -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif`;
        const nameW = Math.min(26 * cqw, ctx.measureText(person.name).width + 2.9 * cqw);
        const nameX = boxX + avatarPx / 2 - nameW / 2;
        const nameY = boxY + avatarPx + innerGapPx;

        drawRoundRect(ctx, nameX + 0.25 * cqw, nameY + 0.25 * cqw, nameW, namePillH, 999);
        ctx.fillStyle = pal.ink; ctx.fill();
        drawRoundRect(ctx, nameX, nameY, nameW, namePillH, 999);
        ctx.fillStyle = '#FFFFFF'; ctx.fill();
        ctx.lineWidth = 0.2 * cqw; ctx.strokeStyle = pal.ink; ctx.stroke();

        ctx.fillStyle = pal.ink;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(person.name, boxX + avatarPx / 2, nameY + namePillH / 2 + 1);
        ctx.textAlign = 'left';

        currentX += avatarPx + colGapPx;
      }
      currentRowY += cardH + rowGapPx;
    }
  }

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `NPS-Promoter-${state.date}.png`;
    a.click();
    showToast('✻ 高清 16:9 海报 PNG 已导出！');
  } catch (_) {
    showToast('提示：请将本地文件夹图片拖入右侧 Memoji 素材库即可支持离线导出 PNG');
  }
}
