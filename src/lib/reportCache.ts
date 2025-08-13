// Cache simples compartilhado para snapshot do dashboard
interface CacheEntry { data: unknown; expires: number }

let dashboardCache: CacheEntry | null = null;
const TTL_MS = 45_000;

export function getDashboardCache(){
  if(dashboardCache && dashboardCache.expires > Date.now()) return dashboardCache.data;
  return null;
}

export function setDashboardCache(data: unknown){
  dashboardCache = { data, expires: Date.now() + TTL_MS };
}

export function invalidateDashboardCache(){
  dashboardCache = null;
}

export function getDashboardTTL(){ return TTL_MS; }
