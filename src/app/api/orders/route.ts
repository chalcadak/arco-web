import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_zipcode,
      shipping_request,
      items,
      subtotal,
      shipping_fee,
      total_amount,
    } = body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !shipping_address) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: '주문 상품이 없습니다.' },
        { status: 400 }
      );
    }

    // Create order
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_zipcode,
        shipping_request,
        items,
        subtotal,
        shipping_fee,
        total_amount,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json(
        { error: '주문 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const customerEmail = searchParams.get('customer_email');

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.eq('id', orderId);
    }

    if (customerEmail) {
      query = query.eq('customer_email', customerEmail);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json(
        { error: '주문 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
