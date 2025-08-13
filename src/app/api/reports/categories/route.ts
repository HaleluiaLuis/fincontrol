import { NextResponse } from 'next/server';
import { dbCategoryBreakdown } from '@/lib/reportDbUtils';

export async function GET() {
	return NextResponse.json({ ok: true, data: await dbCategoryBreakdown() });
}
