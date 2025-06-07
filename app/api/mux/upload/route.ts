import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)

export async function POST(req: Request) {
  try {
    const upload = await Video.Uploads.create({
      new_asset_settings: {
        playback_policy: 'public',
      },
      cors_origin: '*',
    })

    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id, // used for polling later
    })
  } catch (error) {
    console.error('[MUX_UPLOAD_ERROR]', error)
    return new NextResponse('Mux upload creation failed', { status: 500 })
  }
}
