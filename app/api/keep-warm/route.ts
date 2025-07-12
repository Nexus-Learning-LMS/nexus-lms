import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // A very lightweight query to keep the database connection alive.
    await db.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.log('[KEEP_WARM_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
