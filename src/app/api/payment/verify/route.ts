import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TOSS_SECRET_KEY } from '@/lib/payment/config';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount, orderData } = await request.json();

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

    // Create order in database with full information
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Prepare order data
    const items = orderData?.items || [];
    const shippingAddress = orderData?.shippingAddress || {};
    const customerName = orderData?.customerName || payment.customerName || '고객';
    const customerEmail = orderData?.customerEmail || payment.customerEmail || '';
    const customerPhone = orderData?.customerPhone || payment.customerMobilePhone || '';

    // Calculate amounts
    const itemsTotal = Array.isArray(items) 
      ? items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      : 0;
    const shippingFee = itemsTotal >= 50000 ? 0 : 3000;
    const subtotal = itemsTotal;
    const totalAmount = payment.totalAmount;
    const discountAmount = Math.max(0, subtotal + shippingFee - totalAmount);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          user_id: user?.id || null,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: typeof shippingAddress === 'object' 
            ? JSON.stringify(shippingAddress) 
            : shippingAddress,
          shipping_zipcode: shippingAddress?.postal_code || null,
          shipping_request: shippingAddress?.detail_address || null,
          items: JSON.stringify(items),
          subtotal: subtotal,
          shipping_fee: shippingFee,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: payment.method,
          payment_key: payment.paymentKey,
          payment_status: 'paid',
          paid_at: payment.approvedAt,
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
      orderNumber: order.order_number,
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
