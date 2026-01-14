import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, category_id')
      .limit(5)
    
    // Test photoshoot looks
    const { data: looks, error: looksError } = await supabase
      .from('photoshoot_looks')
      .select('id, name, price, duration_minutes, category_id')
      .limit(5)
    
    if (productsError || looksError) {
      return Response.json(
        { 
          error: 'Query failed',
          productsError: productsError?.message,
          looksError: looksError?.message
        },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      message: 'Sample data retrieved successfully!',
      products: {
        count: products?.length || 0,
        items: products || []
      },
      photoshootLooks: {
        count: looks?.length || 0,
        items: looks || []
      }
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
