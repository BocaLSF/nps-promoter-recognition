/* ========================================================================
   5. DOM RENDERING, AUTOCOMPLETE CONSOLE & BOOTSTRAP
   ======================================================================== */
const posterCanvas = document.getElementById('poster-canvas');
const posterStageBody = document.getElementById('poster-stage-body');
const posterDateDisplay = document.getElementById('poster-date-display');
const posterSubWord = document.getElementById('poster-sub-word');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast-banner');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function renderPoster() {
  posterCanvas.setAttribute('data-theme', state.theme);
  posterCanvas.setAttribute('data-crop', state.crop);
  posterDateDisplay.textContent = formatPosterDate(state.date, state.dateFormat);
  posterSubWord.textContent = getPosterSubWord();

  const count = state.promoters.length;
  const metrics = computeLayoutMetrics(count);

  posterStageBody.style.setProperty('--avatar-size', `${metrics.avatarCqh}cqh`);
  posterStageBody.style.setProperty('--name-size', `${metrics.nameCqw}cqw`);
  posterStageBody.style.setProperty('--col-gap', `${metrics.colGapCqw}cqw`);
  posterStageBody.style.setProperty('--row-gap', `${metrics.rowGapCqh}cqh`);
  posterStageBody.style.setProperty('--card-inner-gap', `${metrics.innerGapCqh}cqh`);

  document.getElementById('layout-mode-indicator').textContent = `layout: ${metrics.modeName}`;
  document.getElementById('cc-count-pill').textContent = `promoters: ${count}`;

  posterStageBody.innerHTML = '';

  if (count === 0) {
    const empty = document.createElement('div');
    empty.className = 'poster-empty-minimal';
    empty.textContent = 'NPS PROMOTER · READY';
    posterStageBody.appendChild(empty);
    return;
  }

  let cursor = 0;
  metrics.rows.forEach((rowLen) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'poster-row';

    for (let i = 0; i < rowLen && cursor < count; i++, cursor++) {
      const person = state.promoters[cursor];
      const accent = typeof person.accent === 'number' ? (person.accent % 5) : (cursor % 5);
      const resolved = resolveAvatarSync(person.name);

      const card = document.createElement('div');
      card.className = 'promoter-card';
      card.setAttribute('data-accent', String(accent));
      card.style.animationDelay = `${cursor * 35}ms`;

      card.innerHTML = `
        <div class="avatar-bauhaus-wrap">
          <div class="avatar-backdrop"></div>
          <div class="avatar-mini-geo"></div>
          <div class="avatar-img-holder">
            <img src="${resolved.src}" alt="${escapeHtml(person.name)}" />
          </div>
        </div>
        <div class="promoter-name-tag">${escapeHtml(person.name)}</div>
      `;
      rowEl.appendChild(card);
    }

    posterStageBody.appendChild(rowEl);
  });
}

function renderConsoleRoster() {
  const listEl = document.getElementById('cc-roster-list');
  listEl.innerHTML = '';

  if (state.promoters.length === 0) {
    listEl.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 12.5px; color: var(--cc-dim); padding: 14px; text-align: center; border: 1px dashed var(--cc-border); border-radius: 10px;">
        当前列表为空，请在上方 ❯ 命令行输入今日收获 NPS Promoter 的同事名字。
      </div>
    `;
    return;
  }

  state.promoters.forEach((person, idx) => {
    const resolved = resolveAvatarSync(person.name);
    const isMatched = resolved.source === 'vault' || resolved.source === 'folder';

    const row = document.createElement('div');
    row.className = 'cc-roster-item';
    row.innerHTML = `
      <div class="cc-person-left">
        <div class="cc-avatar-trigger" title="点击为此同事上传/绑定专属 Memoji" data-upload-idx="${idx}">
          <img src="${resolved.src}" alt="${escapeHtml(person.name)}" />
        </div>
        <div class="cc-person-meta">
          <div class="cc-person-name">${escapeHtml(person.name)}</div>
          <div class="cc-person-status ${isMatched ? 'status-matched' : 'status-placeholder'}">
            <span>${isMatched ? '● 已自动匹配 Memoji 素材' : '◌ 活力占位头像 · 点击左侧可替换'}</span>
          </div>
        </div>
      </div>
      <div class="cc-person-controls">
        <button type="button" class="cc-icon-btn" title="切换包豪斯几何底色" data-color-idx="${idx}">◐</button>
        <button type="button" class="cc-icon-btn" title="前移" data-move-up="${idx}" ${idx === 0 ? 'disabled style="opacity:0.35"' : ''}>↑</button>
        <button type="button" class="cc-icon-btn" title="后移" data-move-down="${idx}" ${idx === state.promoters.length - 1 ? 'disabled style="opacity:0.35"' : ''}>↓</button>
        <button type="button" class="cc-icon-btn danger" title="移除" data-remove-idx="${idx}">×</button>
      </div>
    `;
    listEl.appendChild(row);
  });
}

function renderVaultGrid() {
  const grid = document.getElementById('vault-grid');
  const count = vaultCache.size;
  document.getElementById('vault-count-label').textContent = `${count} 已存`;
  document.getElementById('cc-vault-pill').textContent = `memoji-vault: ${count}`;

  grid.innerHTML = '';
  if (count === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; font-family: var(--font-mono); font-size: 11.5px; color: var(--anthro-ink-subtle); padding: 8px 2px;">
        素材库暂无已上传头像（当前自动使用内置 Memoji 风格占位头像）。
      </div>
    `;
    return;
  }

  const sorted = Array.from(vaultCache.values()).sort((a, b) => a.name.localeCompare(b.name));
  sorted.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'vault-chip';
    chip.title = `点击将 ${item.name} 加入今日海报`;
    chip.innerHTML = `
      <img src="${item.dataUrl}" alt="${escapeHtml(item.name)}" />
      <span class="vault-chip-name">${escapeHtml(item.name)}</span>
      <button type="button" class="vault-del-btn" data-del-vault="${escapeHtml(item.key)}" title="从素材库删除">×</button>
    `;
    chip.addEventListener('click', (e) => {
      if (e.target.closest('[data-del-vault]')) return;
      addColleaguesByInput(item.name);
    });
    grid.appendChild(chip);
  });
}

function syncControlsUI() {
  document.getElementById('date-picker').value = state.date;
  document.getElementById('date-format-select').value = state.dateFormat;

  document.querySelectorAll('#theme-selector .seg-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeVal === state.theme);
  });
  document.querySelectorAll('#crop-selector .seg-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cropVal === state.crop);
  });
  document.querySelectorAll('#badge-selector .seg-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.badgeVal === state.badgeMode);
  });
}

function renderAll() {
  syncControlsUI();
  renderPoster();
  renderConsoleRoster();
  renderVaultGrid();
}

async function addColleaguesByInput(rawStr) {
  const names = rawStr
    .split(/[,，、\n]+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (!names.length) return;

  for (const name of names) {
    const accent = state.promoters.length % 5;
    state.promoters.push({
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      name,
      accent
    });
    if (!vaultCache.has(normalizeKey(name))) {
      probeLocalFolderMemoji(name).then((foundUrl) => {
        if (foundUrl) {
          renderPoster();
          renderConsoleRoster();
        }
      });
    }
  }

  saveState();
  renderPoster();
  renderConsoleRoster();
  showToast(`✻ 已添加 ${names.join(', ')}`);
}

const colleagueInput = document.getElementById('colleague-input');
const autocompleteEl = document.getElementById('cc-autocomplete');
const liveMatchChip = document.getElementById('live-match-chip');
const liveMatchImg = document.getElementById('live-match-img');
const liveMatchText = document.getElementById('live-match-text');
let acActiveIndex = -1;
let currentMatches = [];

function updateInputMatchFeedback() {
  const val = colleagueInput.value.trim();
  const lastToken = val.split(/[,，、]+/).pop().trim();
  const key = normalizeKey(lastToken);

  if (key && vaultCache.has(key)) {
    const rec = vaultCache.get(key);
    liveMatchImg.src = rec.dataUrl;
    liveMatchText.textContent = `已匹配 ${rec.name}`;
    liveMatchChip.classList.add('visible');
  } else {
    liveMatchChip.classList.remove('visible');
  }

  if (!key || vaultCache.size === 0) {
    autocompleteEl.classList.remove('open');
    currentMatches = [];
    return;
  }

  currentMatches = Array.from(vaultCache.values())
    .filter(item => item.key.includes(key))
    .slice(0, 6);

  if (!currentMatches.length) {
    autocompleteEl.classList.remove('open');
    return;
  }

  acActiveIndex = 0;
  renderAutocompleteItems();
  autocompleteEl.classList.add('open');
}

function renderAutocompleteItems() {
  autocompleteEl.innerHTML = '';
  currentMatches.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cc-ac-item' + (idx === acActiveIndex ? ' active' : '');
    div.innerHTML = `
      <div class="cc-ac-left">
        <img src="${item.dataUrl}" alt="" />
        <span>${escapeHtml(item.name)}</span>
      </div>
      <span class="cc-ac-badge">● Memoji 库匹配 · ⏎</span>
    `;
    div.addEventListener('mousedown', (e) => {
      e.preventDefault();
      applyAutocompleteItem(item);
    });
    autocompleteEl.appendChild(div);
  });
}

function applyAutocompleteItem(item) {
  const parts = colleagueInput.value.split(/([,，、]+)/);
  if (parts.length > 1) {
    parts[parts.length - 1] = ' ' + item.name;
    colleagueInput.value = parts.join('');
  } else {
    colleagueInput.value = item.name;
  }
  autocompleteEl.classList.remove('open');
  addColleaguesByInput(colleagueInput.value);
  colleagueInput.value = '';
  liveMatchChip.classList.remove('visible');
}

colleagueInput.addEventListener('input', updateInputMatchFeedback);
colleagueInput.addEventListener('keydown', (e) => {
  if (autocompleteEl.classList.contains('open') && currentMatches.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      acActiveIndex = (acActiveIndex + 1) % currentMatches.length;
      renderAutocompleteItems();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      acActiveIndex = (acActiveIndex - 1 + currentMatches.length) % currentMatches.length;
      renderAutocompleteItems();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      applyAutocompleteItem(currentMatches[acActiveIndex]);
      return;
    }
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    if (autocompleteEl.classList.contains('open') && currentMatches.length === 1 &&
        normalizeKey(colleagueInput.value) === currentMatches[0].key) {
      applyAutocompleteItem(currentMatches[0]);
      return;
    }
    if (colleagueInput.value.trim()) {
      addColleaguesByInput(colleagueInput.value);
      colleagueInput.value = '';
      autocompleteEl.classList.remove('open');
      liveMatchChip.classList.remove('visible');
    }
  } else if (e.key === 'Escape') {
    autocompleteEl.classList.remove('open');
  }
});

colleagueInput.addEventListener('blur', () => {
  setTimeout(() => autocompleteEl.classList.remove('open'), 150);
});

document.getElementById('add-colleague-btn').addEventListener('click', () => {
  if (colleagueInput.value.trim()) {
    addColleaguesByInput(colleagueInput.value);
    colleagueInput.value = '';
    autocompleteEl.classList.remove('open');
    liveMatchChip.classList.remove('visible');
  }
});

let pendingUploadPersonIdx = null;
const singleAvatarInput = document.getElementById('single-avatar-input');

document.getElementById('cc-roster-list').addEventListener('click', (e) => {
  const uploadTrigger = e.target.closest('[data-upload-idx]');
  if (uploadTrigger) {
    pendingUploadPersonIdx = parseInt(uploadTrigger.dataset.uploadIdx, 10);
    singleAvatarInput.value = '';
    singleAvatarInput.click();
    return;
  }

  const colorBtn = e.target.closest('[data-color-idx]');
  if (colorBtn) {
    const idx = parseInt(colorBtn.dataset.colorIdx, 10);
    state.promoters[idx].accent = ((state.promoters[idx].accent || 0) + 1) % 5;
    saveState();
    renderPoster();
    return;
  }

  const upBtn = e.target.closest('[data-move-up]');
  if (upBtn) {
    const idx = parseInt(upBtn.dataset.moveUp, 10);
    if (idx > 0) {
      const tmp = state.promoters[idx - 1];
      state.promoters[idx - 1] = state.promoters[idx];
      state.promoters[idx] = tmp;
      saveState();
      renderPoster();
      renderConsoleRoster();
    }
    return;
  }

  const downBtn = e.target.closest('[data-move-down]');
  if (downBtn) {
    const idx = parseInt(downBtn.dataset.moveDown, 10);
    if (idx < state.promoters.length - 1) {
      const tmp = state.promoters[idx + 1];
      state.promoters[idx + 1] = state.promoters[idx];
      state.promoters[idx] = tmp;
      saveState();
      renderPoster();
      renderConsoleRoster();
    }
    return;
  }

  const removeBtn = e.target.closest('[data-remove-idx]');
  if (removeBtn) {
    const idx = parseInt(removeBtn.dataset.removeIdx, 10);
    state.promoters.splice(idx, 1);
    saveState();
    renderPoster();
    renderConsoleRoster();
  }
});

function readImageCompressed(file, maxDim = 720) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(c.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

singleAvatarInput.addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file || pendingUploadPersonIdx === null) return;
  const person = state.promoters[pendingUploadPersonIdx];
  if (!person) return;
  const dataUrl = await readImageCompressed(file, 720);
  await saveMemojiToVault(person.name, dataUrl);
  renderAll();
  showToast(`✻ 已为 ${person.name} 绑定 Memoji 并存入素材库`);
  pendingUploadPersonIdx = null;
});

const demoNamesPool = ['Alex', 'Chloe', 'Leo', 'Maya', 'Ethan', 'Zoe'];
document.querySelectorAll('[data-demo]').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.demo;
    if (mode === 'clear') {
      state.promoters = [];
    } else {
      const n = parseInt(mode, 10);
      const vaultNames = Array.from(vaultCache.values()).map(v => v.name);
      const sourceNames = vaultNames.length >= n ? vaultNames : [...vaultNames, ...demoNamesPool];
      state.promoters = sourceNames.slice(0, n).map((name, i) => ({
        id: 'demo-' + Date.now() + '-' + i,
        name,
        accent: i % 5
      }));
    }
    saveState();
    renderPoster();
    renderConsoleRoster();
  });
});

document.getElementById('date-picker').addEventListener('change', (e) => {
  state.date = e.target.value;
  saveState();
  renderPoster();
});

document.getElementById('btn-date-today').addEventListener('click', () => {
  state.date = getLocalDateString(0);
  saveState();
  syncControlsUI();
  renderPoster();
});

document.getElementById('btn-date-yesterday').addEventListener('click', () => {
  state.date = getLocalDateString(-1);
  saveState();
  syncControlsUI();
  renderPoster();
});

document.getElementById('date-format-select').addEventListener('change', (e) => {
  state.dateFormat = e.target.value;
  saveState();
  renderPoster();
});

document.getElementById('theme-selector').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-theme-val]');
  if (!btn) return;
  state.theme = btn.dataset.themeVal;
  saveState();
  syncControlsUI();
  renderPoster();
});

document.getElementById('crop-selector').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-crop-val]');
  if (!btn) return;
  state.crop = btn.dataset.cropVal;
  saveState();
  syncControlsUI();
  renderPoster();
});

document.getElementById('badge-selector').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-badge-val]');
  if (!btn) return;
  state.badgeMode = btn.dataset.badgeVal;
  saveState();
  syncControlsUI();
  renderPoster();
});

const vaultDropzone = document.getElementById('vault-dropzone');
const vaultFileInput = document.getElementById('vault-file-input');

async function handleVaultFiles(fileList) {
  const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
  if (!files.length) return;
  let count = 0;
  for (const file of files) {
    const baseName = file.name.replace(/\.[^.]+$/, '').trim();
    if (!baseName) continue;
    const dataUrl = await readImageCompressed(file, 720);
    await saveMemojiToVault(baseName, dataUrl);
    count++;
  }
  renderAll();
  updateInputMatchFeedback();
  showToast(`✻ 成功导入 ${count} 个 Memoji 到本地素材库`);
}

vaultDropzone.addEventListener('click', () => vaultFileInput.click());
vaultFileInput.addEventListener('change', (e) => handleVaultFiles(e.target.files));
vaultDropzone.addEventListener('dragover', (e) => { e.preventDefault(); vaultDropzone.classList.add('dragover'); });
vaultDropzone.addEventListener('dragleave', () => vaultDropzone.classList.remove('dragover'));
vaultDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  vaultDropzone.classList.remove('dragover');
  handleVaultFiles(e.dataTransfer.files);
});

document.getElementById('vault-grid').addEventListener('click', async (e) => {
  const delBtn = e.target.closest('[data-del-vault]');
  if (!delBtn) return;
  e.stopPropagation();
  await deleteMemojiFromVault(delBtn.dataset.delVault);
  renderAll();
  showToast('已从素材库移除');
});

document.getElementById('btn-export-vault').addEventListener('click', () => {
  if (vaultCache.size === 0) {
    showToast('素材库当前为空，无需导出');
    return;
  }
  const data = Array.from(vaultCache.values());
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nps-memoji-vault-${state.date}.json`;
  a.click();
});

const vaultJsonInput = document.getElementById('vault-json-input');
document.getElementById('btn-import-vault').addEventListener('click', () => vaultJsonInput.click());
vaultJsonInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const arr = JSON.parse(reader.result);
      if (Array.isArray(arr)) {
        for (const item of arr) {
          if (item.name && item.dataUrl) {
            await saveMemojiToVault(item.name, item.dataUrl);
          }
        }
        renderAll();
        showToast(`✻ 成功恢复 ${arr.length} 个 Memoji 素材`);
      }
    } catch (_) {
      showToast('备份文件格式有误');
    }
  };
  reader.readAsText(file);
});

function toggleFullscreenStage() {
  const shell = document.getElementById('poster-shell');
  if (!document.fullscreenElement) {
    if (shell.requestFullscreen) shell.requestFullscreen();
    else if (shell.webkitRequestFullscreen) shell.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreenStage);
document.getElementById('dock-fullscreen-btn').addEventListener('click', toggleFullscreenStage);
document.getElementById('btn-scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    toggleFullscreenStage();
  }
});

document.getElementById('btn-export-png').addEventListener('click', exportHighResPosterPNG);
document.getElementById('dock-export-btn').addEventListener('click', exportHighResPosterPNG);

(async function init() {
  loadState();
  await loadVaultFromDB();
  renderAll();

  for (const p of state.promoters) {
    if (!vaultCache.has(normalizeKey(p.name))) {
      probeLocalFolderMemoji(p.name).then(found => {
        if (found) {
          renderPoster();
          renderConsoleRoster();
        }
      });
    }
  }
})();
