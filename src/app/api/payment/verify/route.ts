import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TOSS_SECRET_KEY } from '@/lib/payment/config';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // Verify with TossPayments API
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '결제 확인에 실패했습니다.');
    }

    const payment = await response.json();

    // Get order data from session storage (sent from client)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          user_id: user?.id || null,
          customer_name: payment.customerName || '고객',
          customer_email: payment.customerEmail || '',
          customer_phone: payment.customerMobilePhone || '',
          total_amount: payment.totalAmount,
          status: 'pending',
          payment_method: payment.method,
          payment_key: payment.paymentKey,
          items: [],
          shipping_address: {},
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('주문 생성에 실패했습니다.');
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      payment,
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || '결제 처리 중 오류가 발생했습니다.' },
      { status: 400 }
    );
  }
}
