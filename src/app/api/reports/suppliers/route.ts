import { NextResponse } from 'next/server';
import { dbSuppliersSummary } from '@/lib/reportDbUtils';

export async function GET() {
	return NextResponse.json({ ok: true, data: await dbSuppliersSummary() });
}
