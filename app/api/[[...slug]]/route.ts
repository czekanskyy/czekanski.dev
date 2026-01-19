import config from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

const payload = await getPayload({ config })

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  
  if (searchParams.get('slug') === 'init') {
    try {
      await payload.db.connect()
      return NextResponse.json({ success: true })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
