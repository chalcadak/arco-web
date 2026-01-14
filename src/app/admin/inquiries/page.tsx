'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'answered';
  answer?: string;
  created_at: string;
  answered_at?: string;
}

export default function AdminInquiriesPage() {
  const supabase = createClientComponentClient();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'answered'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const loadInquiries = async () => {
    setIsLoading(true);
    let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setInquiries(data);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 문의를 삭제하시겠습니까?')) return;

    const { error } = await supabase.from('inquiries').delete().eq('id', id);

    if (!error) {
      loadInquiries();
      setSelectedInquiry(null);
      alert('문의가 삭제되었습니다.');
    }
  };

  const handleAnswer = async (id: string, answer: string) => {
    const { error } = await supabase
      .from('inquiries')
      .update({
        status: 'answered',
        answer,
        answered_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (!error) {
      loadInquiries();
      setSelectedInquiry(null);
      alert('답변이 등록되었습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading level={2}>1:1 문의 관리</Heading>
          <Text className="text-muted-foreground mt-1">
            고객 문의를 확인하고 답변합니다.
          </Text>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            전체
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
          >
            미답변
          </Button>
          <Button
            variant={statusFilter === 'answered' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('answered')}
          >
            답변완료
          </Button>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : inquiries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Text className="text-muted-foreground">문의가 없습니다.</Text>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {inquiry.status === 'pending' ? (
                          <Mail className="h-5 w-5 text-orange-500" />
                        ) : (
                          <MailOpen className="h-5 w-5 text-green-500" />
                        )}
                        <Heading level={3}>{inquiry.subject}</Heading>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            inquiry.status === 'pending'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {inquiry.status === 'pending' ? '미답변' : '답변완료'}
                        </span>
                      </div>

                      <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                        <div>
                          {inquiry.name} | {inquiry.email}
                          {inquiry.phone && ` | ${inquiry.phone}`}
                        </div>
                        <div>{formatDate(inquiry.created_at)}</div>
                      </div>

                      <Text className="text-sm mb-4 whitespace-pre-wrap">
                        {inquiry.message}
                      </Text>

                      {inquiry.answer && (
                        <div className="mt-4 p-4 bg-green-50 rounded-md">
                          <Text className="text-sm font-semibold text-green-700 mb-2">
                            답변:
                          </Text>
                          <Text className="text-sm whitespace-pre-wrap">
                            {inquiry.answer}
                          </Text>
                          {inquiry.answered_at && (
                            <Text className="text-xs text-muted-foreground mt-2">
                              답변 시간: {formatDate(inquiry.answered_at)}
                            </Text>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {inquiry.status === 'pending' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          답변하기
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(inquiry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Answer Modal */}
        {selectedInquiry && (
          <AnswerModal
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            onSave={handleAnswer}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function AnswerModal({
  inquiry,
  onClose,
  onSave,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onSave: (id: string, answer: string) => void;
}) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    onSave(inquiry.id, answer);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <Heading level={3} className="mb-4">
            답변 작성
          </Heading>

          <div className="mb-4 p-4 bg-neutral-50 rounded-md">
            <Text className="text-sm font-semibold mb-2">문의 내용:</Text>
            <Text className="text-sm whitespace-pre-wrap">{inquiry.message}</Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">답변</label>
              <textarea
                rows={8}
                className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변 내용을 입력해주세요"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                답변 등록
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
