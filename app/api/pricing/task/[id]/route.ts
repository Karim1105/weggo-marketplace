import { NextRequest, NextResponse } from 'next/server'
import { getPricingJob } from '@/lib/pricingJobStore'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = getPricingJob(id)

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Pricing job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      job
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load pricing job' },
      { status: 500 }
    )
  }
}
