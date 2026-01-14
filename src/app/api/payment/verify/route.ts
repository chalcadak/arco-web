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

    // Create order in database
    const supabase = await createClient();
    
    // Parse order data from orderId (format: ORDER-timestamp-data)
    const orderData = JSON.parse(Buffer.from(orderId.split('-')[2] || '{}', 'base64').toString());

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: payment.orderId,
          customer_name: orderData.customerName || '고객',
          customer_email: orderData.customerEmail || '',
          customer_phone: orderData.customerPhone || '',
          total_amount: payment.totalAmount,
          status: 'pending',
          payment_method: payment.method,
          payment_key: payment.paymentKey,
          items: orderData.items || [],
          shipping_address: orderData.shippingAddress || '',
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
