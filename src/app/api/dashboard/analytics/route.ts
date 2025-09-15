import { NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { AnalyticsService } from '@/lib/db'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analyticsService = new AnalyticsService()
    const userAnalytics = await analyticsService.getUserAnalytics(user.id)
    
    return NextResponse.json({ stats: userAnalytics })
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}