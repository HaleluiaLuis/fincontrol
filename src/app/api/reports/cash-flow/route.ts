import { NextResponse } from 'next/server';
import { dbCashFlow } from '@/lib/reportDbUtils';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const yearParam = searchParams.get('year');
	const year = yearParam ? parseInt(yearParam, 10) : undefined;
	return NextResponse.json({ ok: true, data: await dbCashFlow(year) });
}
