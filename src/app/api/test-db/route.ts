import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test connection by fetching categories
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    if (error) {
      return Response.json(
        { error: error.message, details: 'Database connection failed' },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      message: 'Supabase connection successful!',
      categories: data,
      count: data?.length || 0
    })
  } catch (error) {
    return Response.json(
      { error: 'Connection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
