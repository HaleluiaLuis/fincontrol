import { NextResponse } from 'next/server';
import { dbDashboardSnapshot } from '@/lib/reportDbUtils';
import { getDashboardCache, setDashboardCache } from '@/lib/reportCache';

export async function GET() {
	const cached = getDashboardCache();
	if(cached) return NextResponse.json({ ok:true, data: cached, cached:true });
	const data = await dbDashboardSnapshot();
	setDashboardCache(data);
	return NextResponse.json({ ok:true, data, cached:false });
}
