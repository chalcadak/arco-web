import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { Mail, Phone, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "고객센터 - ARCO",
  description: "ARCO 고객센터 - 자주 묻는 질문, 문의하기",
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "이메일 문의",
      hours: "평일 10:00 - 18:00",
      link: "mailto:admin@arco.com",
      linkText: "admin@arco.com",
    },
    {
      icon: Phone,
      title: "전화 문의",
      hours: "평일 10:00 - 18:00",
      link: "tel:02-1234-5678",
      linkText: "02-1234-5678",
    },
    {
      icon: MessageSquare,
      title: "카카오톡 문의",
      hours: "평일 10:00 - 18:00",
      link: "#",
      linkText: "@arco_official",
    },
  ];

  const faqs = [
    {
      question: "배송은 얼마나 걸리나요?",
      answer:
        "주문 확인 후 2-3일 내 배송됩니다. 제주도 및 도서산간 지역은 추가 1-2일이 소요될 수 있습니다. 배송 조회는 마이페이지에서 가능합니다.",
    },
    {
      question: "촬영 예약은 어떻게 하나요?",
      answer:
        "촬영룩 페이지에서 원하시는 컨셉을 선택하신 후, 예약 가능한 날짜와 시간을 확인하실 수 있습니다. 예약 결제 완료 후 상세한 준비사항을 안내해드립니다.",
    },
    {
      question: "교환 및 환불이 가능한가요?",
      answer:
        "상품 수령 후 7일 이내 미착용 상태에 한하여 교환 및 환불이 가능합니다. 단, 맞춤 제작 상품이나 위생용품은 교환 및 환불이 어려울 수 있습니다.",
    },
    {
      question: "사이즈는 어떻게 선택하나요?",
      answer:
        "각 상품 페이지에 상세한 사이즈 가이드가 제공됩니다. 반려견의 가슴둘레와 등길이를 측정하신 후 사이즈표를 참고해주세요. 사이즈 선택이 어려우시면 고객센터로 문의해주시면 도와드리겠습니다.",
    },
    {
      question: "촬영 후 사진은 언제 받을 수 있나요?",
      answer:
        "촬영 후 5-7일 내 보정 작업을 완료하여 개인 갤러리 링크를 발송해드립니다. 갤러리에서 고해상도 원본 사진을 다운로드하실 수 있으며, 링크는 30일간 유효합니다.",
    },
    {
      question: "배송비는 얼마인가요?",
      answer:
        "5만원 이상 구매 시 무료배송이며, 5만원 미만 구매 시 배송비 3,000원이 부과됩니다. 제주도 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Heading level={1} className="mb-4">
            고객센터
          </Heading>
          <Text size="xl" className="text-muted-foreground">
            무엇을 도와드릴까요?
          </Text>
        </div>

        {/* Contact Info Cards */}
        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} hover className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Heading level={3} size="lg" className="mb-2">
                    {method.title}
                  </Heading>
                  <Text size="sm" className="text-muted-foreground mb-3">
                    {method.hours}
                  </Text>
                  <a
                    href={method.link}
                    className="text-sm font-medium hover:underline"
                  >
                    {method.linkText}
                  </a>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 max-w-4xl mx-auto">
          <Heading level={2} className="text-center mb-12">
            자주 묻는 질문
          </Heading>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="border border-neutral-200 rounded-lg bg-white"
              >
                <summary className="p-6 cursor-pointer font-semibold hover:bg-neutral-50 transition-colors">
                  {faq.question}
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  <Text>{faq.answer}</Text>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="max-w-2xl mx-auto mb-16">
          <Card className="p-8">
            <Heading level={2} className="mb-6 text-center">
              1:1 문의하기
            </Heading>

            <form className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full h-10 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="홍길동"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full h-10 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full h-10 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="010-1234-5678"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  문의 유형 *
                </label>
                <select
                  id="subject"
                  required
                  className="w-full h-10 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">선택해주세요</option>
                  <option value="product">상품 문의</option>
                  <option value="order">주문/배송 문의</option>
                  <option value="photoshoot">촬영 예약 문의</option>
                  <option value="exchange">교환/환불 문의</option>
                  <option value="etc">기타 문의</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  문의 내용 *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="문의하실 내용을 상세히 작성해주세요."
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full">
                문의하기
              </Button>
            </form>

            <Text size="sm" className="text-muted-foreground text-center mt-4">
              * 평일 기준 1-2일 내 답변드립니다.
            </Text>
          </Card>
        </section>

        {/* Business Hours */}
        <section className="max-w-2xl mx-auto text-center bg-neutral-50 rounded-lg p-8">
          <Heading level={3} className="mb-4">
            운영 시간
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <Text>평일: 10:00 - 18:00</Text>
            <Text>점심시간: 12:00 - 13:00</Text>
            <Text>주말 및 공휴일: 휴무</Text>
          </div>
        </section>
      </Container>
    </div>
  );
}
