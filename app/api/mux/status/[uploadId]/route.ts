import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)

export async function GET(req: Request, { params }: { params: { uploadId: string } }) {
  try {
    const upload = await Video.Uploads.get(params.uploadId)

    if (!upload.asset_id) {
      return NextResponse.json({ status: 'waiting' })
    }

    const asset = await Video.Assets.get(upload.asset_id)

    return NextResponse.json({
      status: 'ready',
      assetId: asset.id,
      playbackId: asset.playback_ids?.[0]?.id,
    })
  } catch (error) {
    console.error('[MUX_STATUS_ERROR]', error)
    return new NextResponse('Mux status fetch failed', { status: 500 })
  }
}
