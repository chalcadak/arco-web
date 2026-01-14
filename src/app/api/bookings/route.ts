import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      photoshoot_look_id,
      booking_date,
      booking_time,
      customer_name,
      customer_phone,
      customer_email,
      pet_name,
      pet_age,
      pet_size,
      special_requests,
      status = 'pending',
      total_amount
    } = body;

    // 필수 필드 검증
    if (!photoshoot_look_id || !booking_date || !booking_time) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_phone || !customer_email) {
      return NextResponse.json(
        { error: '고객 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (!pet_name || !pet_age || !pet_size) {
      return NextResponse.json(
        { error: '반려견 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 예약 생성
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        photoshoot_look_id,
        booking_date,
        booking_time,
        customer_name,
        customer_phone,
        customer_email,
        pet_name,
        pet_age,
        pet_size,
        special_requests,
        status,
        total_amount
      })
      .select()
      .single();

    if (error) {
      console.error('Booking creation error:', error);
      return NextResponse.json(
        { error: '예약 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ booking }, { status: 201 });
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
    const customerId = searchParams.get('customer_id');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        photoshoot_look:photoshoot_looks(*)
      `)
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Bookings fetch error:', error);
      return NextResponse.json(
        { error: '예약 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
