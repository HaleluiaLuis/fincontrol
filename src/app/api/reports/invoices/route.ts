import { NextResponse } from 'next/server';
import { dbInvoicesStatusSummary } from '@/lib/reportDbUtils';

export async function GET() {
	return NextResponse.json({ ok: true, data: await dbInvoicesStatusSummary() });
}
