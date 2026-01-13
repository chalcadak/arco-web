'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { PhotoshootLook } from '@/types/photoshoot';

interface BookingFormProps {
  photoshootLook: PhotoshootLook;
}

const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const PET_SIZES = [
  { value: 'small', label: '소형 (5kg 이하)' },
  { value: 'medium', label: '중형 (5-15kg)' },
  { value: 'large', label: '대형 (15kg 이상)' }
];

export function BookingForm({ photoshootLook }: BookingFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 고객 정보
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // 반려견 정보
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petSize, setPetSize] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    if (!customerName || !phone || !email) {
      alert('고객 정보를 모두 입력해주세요.');
      return;
    }

    if (!petName || !petAge || !petSize) {
      alert('반려견 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        photoshoot_look_id: photoshootLook.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
        customer_name: customerName,
        customer_phone: phone,
        customer_email: email,
        pet_name: petName,
        pet_age: parseInt(petAge),
        pet_size: petSize,
        special_requests: specialRequests,
        status: 'pending',
        total_amount: photoshootLook.price
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('예약 실패');
      }

      const { booking } = await response.json();
      
      // 예약 완료 페이지로 이동
      router.push(`/bookings/${booking.id}/success`);
    } catch (error) {
      console.error('Booking error:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 과거 날짜 비활성화
  const disabledDays = { before: new Date() };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 촬영 정보 요약 */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-2">{photoshootLook.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{photoshootLook.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">촬영 시간</span>
            <span className="font-medium">{photoshootLook.duration_minutes}분</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">가격</span>
            <span className="text-xl font-bold">₩{photoshootLook.price.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* 날짜 및 시간 선택 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">날짜 및 시간 선택</h3>
        
        <div>
          <Label>촬영 날짜</Label>
          <div className="mt-2">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              locale={ko}
              className="border rounded-lg p-3"
            />
          </div>
        </div>

        <div>
          <Label>촬영 시간</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {TIME_SLOTS.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? 'default' : 'outline'}
                onClick={() => setSelectedTime(time)}
                className="w-full"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 고객 정보 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">고객 정보</h3>
        
        <div>
          <Label htmlFor="customerName">이름 *</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="홍길동"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">전화번호 *</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">이메일 *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>
      </div>

      {/* 반려견 정보 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">반려견 정보</h3>
        
        <div>
          <Label htmlFor="petName">반려견 이름 *</Label>
          <Input
            id="petName"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="멍멍이"
            required
          />
        </div>

        <div>
          <Label htmlFor="petAge">나이 (만) *</Label>
          <Input
            id="petAge"
            type="number"
            value={petAge}
            onChange={(e) => setPetAge(e.target.value)}
            placeholder="3"
            min="0"
            max="30"
            required
          />
        </div>

        <div>
          <Label>크기 *</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {PET_SIZES.map((size) => (
              <Button
                key={size.value}
                type="button"
                variant={petSize === size.value ? 'default' : 'outline'}
                onClick={() => setPetSize(size.value)}
                className="w-full justify-start"
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="specialRequests">특이사항 및 요청사항</Label>
          <Textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="반려견의 특이사항이나 촬영 시 주의사항을 알려주세요."
            rows={4}
          />
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? '예약 중...' : '예약하기'}
        </Button>
      </div>
    </form>
  );
}
