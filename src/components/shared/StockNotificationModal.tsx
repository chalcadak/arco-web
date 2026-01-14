'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

interface StockNotificationModalProps {
  productId: number;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockNotificationModal({
  productId,
  productName,
  isOpen,
  onClose,
}: StockNotificationModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('stock_notifications')
        .insert({
          product_id: productId,
          customer_email: email,
          customer_name: name,
          is_notified: false,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          // Unique constraint violation
          setError('이미 재입고 알림 신청이 되어 있습니다.');
        } else {
          throw insertError;
        }
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setEmail('');
          setName('');
          setIsSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting notification:', err);
      setError('재입고 알림 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      재입고 알림 신청
                    </CardTitle>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        알림 신청 완료!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        재입고 시 이메일로 알려드리겠습니다.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Product Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          상품명
                        </p>
                        <p className="font-semibold">{productName}</p>
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          이메일 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                          placeholder="example@email.com"
                          required
                        />
                      </div>

                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          이름 (선택)
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                          placeholder="홍길동"
                        />
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Info */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600">
                        💡 재입고 시 입력하신 이메일로 알림을 보내드립니다.
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onClose}
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          취소
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              신청 중...
                            </>
                          ) : (
                            '알림 신청'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
