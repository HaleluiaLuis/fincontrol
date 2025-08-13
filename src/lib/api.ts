// Helpers genéricos para chamadas à API (fetch wrapper com tratamento padrão)

interface ApiOptions<TBody = unknown> extends RequestInit { json?: TBody; query?: Record<string, string | number | boolean | undefined>; }

export async function api<TResponse = unknown, TBody = unknown>(url: string, opts: ApiOptions<TBody> = {}): Promise<{ ok: boolean; data?: TResponse; error?: string; status: number; }> {
	const { json, query, headers, ...rest } = opts;
	let finalUrl = url;
	if(query){
		const params = new URLSearchParams();
		Object.entries(query).forEach(([k,v])=>{ if(v!==undefined && v!==null && v!=='') params.append(k, String(v)); });
		const qs = params.toString();
		if(qs) finalUrl += (finalUrl.includes('?')? '&':'?') + qs;
	}
	const init: RequestInit = { ...rest, headers: { 'Content-Type':'application/json', ...(headers||{}) }, credentials: 'include' };
	if(json !== undefined) init.body = JSON.stringify(json);
	const res = await fetch(finalUrl, init);
	let body: unknown = null;
	try { body = await res.json(); } catch {/* ignore parse errors */}
	if(!res.ok){
		let err: string | undefined;
		if(body && typeof body === 'object' && 'error' in (body as Record<string,unknown>)){
			err = String((body as Record<string,unknown>).error);
		}
		return { ok:false, error: err || res.statusText || 'Erro', status: res.status };
	}
	let payload: unknown = body;
	if(body && typeof body === 'object' && 'data' in (body as Record<string,unknown>)){
		payload = (body as Record<string,unknown>).data;
	}
	return { ok:true, data: payload as TResponse, status: res.status };
}

export function buildUrl(base: string, params?: Record<string, string | number | boolean | undefined>){
	if(!params) return base;
	const sp = new URLSearchParams();
	Object.entries(params).forEach(([k,v])=>{ if(v!==undefined && v!==null && v!=='') sp.append(k,String(v)); });
	const qs = sp.toString();
	return qs? `${base}?${qs}` : base;
}

