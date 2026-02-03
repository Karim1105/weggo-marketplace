import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }) // 10 minutes default TTL

export function getCache<T>(key: string): T | undefined {
  return cache.get<T>(key)
}

export function setCache<T>(key: string, value: T, ttl: number = 600): boolean {
  return cache.set(key, value, ttl)
}

export function deleteCache(key: string): number {
  return cache.del(key)
}

export function clearCache(): void {
  cache.flushAll()
}

export function getCacheStats() {
  return cache.getStats()
}


