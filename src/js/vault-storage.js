/* ========================================================================
   2. INDEXED-DB MEMOJI VAULT (UNLIMITED LOCAL STORAGE FOR MEMOJI PNGS)
   ======================================================================== */
const DB_NAME = 'NPSPromoterMemojiVaultDB';
const STORE_NAME = 'memojis';
const vaultCache = new Map();

function normalizeKey(name) {
  return (name || '').trim().toLowerCase();
}

function openVaultDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadVaultFromDB() {
  try {
    const db = await openVaultDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        vaultCache.clear();
        (req.result || []).forEach(item => {
          vaultCache.set(item.key, item);
        });
        resolve();
      };
      req.onerror = () => resolve();
    });
  } catch (_) {}
}

async function saveMemojiToVault(displayName, dataUrl) {
  const cleanName = displayName.trim();
  const key = normalizeKey(cleanName);
  if (!key) return;
  const record = { key, name: cleanName, dataUrl, updatedAt: Date.now() };
  vaultCache.set(key, record);
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(record);
  } catch (_) {}
}

async function deleteMemojiFromVault(key) {
  vaultCache.delete(key);
  try {
    const db = await openVaultDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
  } catch (_) {}
}

/* Probe local ./memojis/<Name>.(png|webp|jpg) folder automatically */
const folderProbeCache = new Map();
function probeLocalFolderMemoji(name) {
  const key = normalizeKey(name);
  if (!key) return Promise.resolve(null);
  if (folderProbeCache.has(key)) return Promise.resolve(folderProbeCache.get(key));

  const raw = name.trim();
  const candidates = [
    `./memojis/${encodeURIComponent(raw)}.png`,
    `./memojis/${encodeURIComponent(raw)}.webp`,
    `./memojis/${encodeURIComponent(raw)}.jpg`,
    `./memojis/${encodeURIComponent(key)}.png`
  ];

  return new Promise((resolve) => {
    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        folderProbeCache.set(key, null);
        resolve(null);
        return;
      }
      const url = candidates[idx++];
      const img = new Image();
      img.onload = () => {
        folderProbeCache.set(key, url);
        resolve(url);
      };
      img.onerror = tryNext;
      img.src = url;
    };
    tryNext();
  });
}
