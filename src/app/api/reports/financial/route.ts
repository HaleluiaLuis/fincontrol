import { NextResponse } from 'next/server';
import { dbFinancialSummary } from '@/lib/reportDbUtils';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const period = searchParams.get('period') || undefined;
	const data = await dbFinancialSummary(period);
	return NextResponse.json({ ok: true, data });
}
