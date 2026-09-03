const entries = new Map();
const DEFAULT_TTL = 15000;

export function cachedRequest(key, loader, ttl = DEFAULT_TTL) {
  const now = Date.now();
  const existing = entries.get(key);
  if (existing && (existing.promise || existing.expiresAt > now)) {
    return existing.promise || Promise.resolve(existing.value);
  }

  const promise = Promise.resolve().then(loader);
  entries.set(key, { promise });
  promise.then((value) => {
    entries.set(key, { value, expiresAt: Date.now() + ttl });
  }).catch(() => {
    if (entries.get(key)?.promise === promise) entries.delete(key);
  });
  return promise;
}

export function invalidateRequests(...keys) {
  keys.forEach((key) => entries.delete(key));
}
