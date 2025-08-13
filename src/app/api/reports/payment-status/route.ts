import { NextResponse } from 'next/server';
import { dbPaymentStatusSummary } from '@/lib/reportDbUtils';

export async function GET() {
	return NextResponse.json({ ok: true, data: await dbPaymentStatusSummary() });
}
