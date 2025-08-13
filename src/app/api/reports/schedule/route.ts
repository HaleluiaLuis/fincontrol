import { NextResponse } from 'next/server';
import { dbScheduleUpcoming } from '@/lib/reportDbUtils';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const limit = parseInt(searchParams.get('limit') || '10', 10);
	return NextResponse.json({ ok: true, data: await dbScheduleUpcoming(limit) });
}
