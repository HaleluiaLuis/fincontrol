import { NextResponse } from 'next/server';
import { dbExportReport } from '@/lib/reportDbUtils';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const type = searchParams.get('type') || 'financial';
	const data = await dbExportReport(type);
	return NextResponse.json({ ok: true, type, data });
}
