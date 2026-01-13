import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { ShoppingBag, Camera, ImageIcon } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: ShoppingBag,
      title: "판매상품",
      description: "일상에서 입힐 수 있는 실용적이면서도 스타일리시한 반려견 의류",
    },
    {
      icon: Camera,
      title: "촬영룩",
      description: "특별한 날을 위한 에디토리얼 컨셉의 촬영 의상과 전문 촬영 서비스",
    },
    {
      icon: ImageIcon,
      title: "사진 납품",
      description: "촬영 후 토큰 링크로 안전하게 사진을 다운로드할 수 있습니다",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center justify-center bg-gradient-to-b from-neutral-50 to-white">
        <Container className="text-center">
          <Heading level={1} className="mb-6">
            ARCO
          </Heading>
          <Text size="xl" className="mb-8 text-muted-foreground">
            프리미엄 반려견 패션 브랜드
          </Text>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/products">상품 둘러보기</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/photoshoots">촬영 예약하기</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-8 w-8" />
                  </div>
                  <Heading level={3} className="mb-2">
                    {feature.title}
                  </Heading>
                  <Text className="text-muted-foreground">
                    {feature.description}
                  </Text>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-50 py-20">
        <Container className="text-center">
          <Heading level={2} className="mb-4">
            프리미엄 반려견 패션을 만나보세요
          </Heading>
          <Text size="lg" className="mb-8 text-muted-foreground">
            ARCO의 스타일리시한 반려견 의류를 둘러보세요
          </Text>
          <Button asChild size="lg">
            <Link href="/products">쇼핑하기</Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}
