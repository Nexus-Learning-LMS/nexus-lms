import { db } from '@/lib/db'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // This is the security check. It ensures that only Vercel's cron job can run this function.
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // A very lightweight query to "touch" the database and keep it warm.
    await db.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.log('[KEEP_WARM_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
