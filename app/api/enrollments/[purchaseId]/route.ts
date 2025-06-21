import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// Revoke access by deleting a Purchase record
export async function DELETE(req: Request, { params }: { params: { purchaseId: string } }) {
  try {
    // const { sessionClaims } = auth()
    // if (sessionClaims?.metadata?.role !== 'admin') {
    //   return new NextResponse('Unauthorized', { status: 401 })
    // }

    const purchase = await db.purchase.delete({
      where: {
        id: params.purchaseId,
      },
    })

    return NextResponse.json(purchase)
  } catch (error) {
    console.log('[ENROLLMENTS_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
