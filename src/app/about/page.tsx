import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { Sparkles, Paintbrush, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "소개 - ARCO",
  description: "프리미엄 반려견 패션 브랜드 ARCO를 소개합니다.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Sparkles,
      title: "프리미엄 품질",
      description: "최고 품질의 원단과 섬세한 디테일로 만든 프리미엄 제품",
    },
    {
      icon: Paintbrush,
      title: "독창적 디자인",
      description: "트렌디하면서도 개성 있는 ARCO만의 독창적인 디자인",
    },
    {
      icon: Heart,
      title: "반려견 중심",
      description: "반려견의 편안함과 행복을 최우선으로 생각하는 디자인",
    },
  ];

  const productTags = ["아우터", "이너웨어", "액세서리", "신발"];
  const serviceTags = ["에디토리얼", "시즌 스페셜", "특별한 날"];

  return (
    <div className="min-h-screen bg-white">
      <Container size="md" className="py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Heading level={1} className="mb-4">
            ARCO
          </Heading>
          <Text size="xl" className="text-muted-foreground">
            프리미엄 반려견 패션 브랜드
          </Text>
        </div>

        {/* Brand Story */}
        <section className="mb-16">
          <Heading level={2} className="mb-6">브랜드 스토리</Heading>
          <div className="prose prose-lg max-w-none">
            <Text size="lg" className="text-muted-foreground leading-relaxed mb-4">
              ARCO는 반려견과 함께하는 모든 순간을 특별하게 만들어주는 프리미엄 패션 브랜드입니다.
            </Text>
            <Text size="lg" className="text-muted-foreground leading-relaxed mb-4">
              우리는 단순한 옷이 아닌, 반려견의 개성과 스타일을 표현할 수 있는 
              패션 아이템을 디자인합니다. 일상에서 편안하게 입을 수 있는 의류부터 
              특별한 날을 위한 에디토리얼 촬영 의상까지, 다양한 스타일을 제공합니다.
            </Text>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <Heading level={2} className="mb-8">브랜드 가치</Heading>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} hover className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Heading level={3} className="mb-2">{value.title}</Heading>
                  <Text className="text-muted-foreground">
                    {value.description}
                  </Text>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <Heading level={2} className="mb-8">제공 서비스</Heading>
          <div className="space-y-6">
            {/* Service 1 */}
            <Card className="p-6">
              <Heading level={3} className="mb-3">판매상품</Heading>
              <Text className="text-muted-foreground mb-4">
                일상에서 편안하게 입힐 수 있는 실용적이면서도 스타일리시한 반려견 의류를 
                판매합니다. 아우터, 이너웨어, 액세서리 등 다양한 카테고리의 상품을 
                만나보실 수 있습니다.
              </Text>
              <div className="flex gap-2 flex-wrap">
                {productTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-neutral-100 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* Service 2 */}
            <Card className="p-6">
              <Heading level={3} className="mb-3">촬영 서비스</Heading>
              <Text className="text-muted-foreground mb-4">
                특별한 날을 위한 에디토리얼 컨셉의 촬영 의상 대여 및 전문 촬영 서비스를 
                제공합니다. 촬영 후에는 토큰 링크를 통해 안전하게 고해상도 사진을 
                다운로드하실 수 있습니다.
              </Text>
              <div className="flex gap-2 flex-wrap">
                {serviceTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-neutral-100 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-neutral-50 rounded-lg p-12">
          <Heading level={2} className="mb-4">
            ARCO와 함께 특별한 순간을 만들어보세요
          </Heading>
          <Text className="text-muted-foreground mb-6">
            지금 바로 ARCO의 프리미엄 반려견 패션을 경험해보세요
          </Text>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link href="/products">상품 둘러보기</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/photoshoots">촬영 예약하기</Link>
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}
