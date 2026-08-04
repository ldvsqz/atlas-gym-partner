// Central registry for module settings
// Allows modules to register defaults, apply global overrides, and subscribe to changes.

const registry = new Map();
const subscribers = new Map();

// Special key for storing overrides
const OVERRIDES_KEY = '__overrides__';

function applyOverrides(moduleName, defaults = {}, overrides = {}) {
  const modOverrides = overrides[moduleName] || {};
  return { ...defaults, ...modOverrides };
}

function notify(moduleName, settings) {
  const subs = subscribers.get(moduleName);
  if (!subs) return;
  for (const cb of Array.from(subs)) cb(settings);
}

export function registerModule(moduleName, defaults = {}) {
  if (!moduleName) throw new Error('moduleName is required');
  registry.set(moduleName, { ...defaults });
  const merged = applyOverrides(moduleName, defaults, registry.get(OVERRIDES_KEY) || {});
  notify(moduleName, merged);
  return merged;
}

export function getSettings(moduleName) {
  const defaults = registry.get(moduleName) || {};
  const overrides = registry.get(OVERRIDES_KEY) || {};
  return applyOverrides(moduleName, defaults, overrides);
}

export function getAllSettings() {
  const overrides = registry.get(OVERRIDES_KEY) || {};
  const result = {};
  for (const [key, defaults] of registry.entries()) {
    if (key === OVERRIDES_KEY) continue;
    result[key] = applyOverrides(key, defaults, overrides);
  }
  return result;
}

// Load a batch of overrides: { moduleName: { key: value } }
export function loadOverrides(overrides = {}) {
  const current = registry.get(OVERRIDES_KEY) || {};
  registry.set(OVERRIDES_KEY, { ...current, ...overrides });
  // Notify subscribers of all modules
  for (const key of registry.keys()) {
    if (key === OVERRIDES_KEY) continue;
    notify(key, getSettings(key));
  }
}

export function setOverride(moduleName, key, value) {
  const overrides = registry.get(OVERRIDES_KEY) || {};
  const mod = { ...(overrides[moduleName] || {}), [key]: value };
  loadOverrides({ ...overrides, [moduleName]: mod });
}

export function subscribe(moduleName, callback) {
  if (!subscribers.has(moduleName)) subscribers.set(moduleName, new Set());
  subscribers.get(moduleName).add(callback);
  // initial call with current settings
  callback(getSettings(moduleName));
  return () => {
    subscribers.get(moduleName)?.delete(callback);
  };
}

export function clearRegistry() {
  registry.clear();
  subscribers.clear();
}

// Optional: convenience methods for persistence (localStorage)
export function persistOverrides(key = 'moduleSettings.overrides') {
  const overrides = registry.get(OVERRIDES_KEY) || {};
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(overrides));
    }
  } catch (e) {
    // ignore
  }
}

export function restoreOverrides(key = 'moduleSettings.overrides') {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw) loadOverrides(JSON.parse(raw));
    }
  } catch (e) {
    // ignore
  }
}

export default {
  registerModule,
  getSettings,
  getAllSettings,
  loadOverrides,
  setOverride,
  subscribe,
  persistOverrides,
  restoreOverrides,
  clearRegistry,
};
