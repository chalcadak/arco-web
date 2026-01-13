import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { Camera, Sparkles, Heart, Cake } from "lucide-react";

export const metadata: Metadata = {
  title: "갤러리 - ARCO",
  description: "ARCO 프리미엄 반려견 패션 촬영 작품 갤러리",
};

export default function GalleryPage() {
  const categories = [
    {
      icon: Sparkles,
      title: "에디토리얼",
      description: "Vogue 스타일의 고급스러운 패션 화보",
    },
    {
      icon: Heart,
      title: "시즌 스페셜",
      description: "계절별 특별한 테마의 촬영 작품",
    },
    {
      icon: Cake,
      title: "특별한 날",
      description: "생일, 기념일 등 소중한 순간의 기록",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Heading level={1} className="mb-4">
            갤러리
          </Heading>
          <Text size="xl" className="text-muted-foreground">
            ARCO와 함께한 특별한 순간들
          </Text>
        </div>

        {/* Gallery Description */}
        <section className="max-w-3xl mx-auto text-center mb-16">
          <Text size="lg" className="text-muted-foreground leading-relaxed mb-6">
            프리미엄 반려견 패션 촬영의 아름다운 순간들을 담았습니다.
            <br />
            ARCO의 스타일리시한 의상과 함께 빛나는 반려견들의 모습을 만나보세요.
          </Text>
        </section>

        {/* Coming Soon Message */}
        <section className="max-w-2xl mx-auto text-center bg-neutral-50 rounded-lg p-12 mb-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-6">
            <Camera className="w-8 h-8" />
          </div>
          
          <Heading level={2} className="mb-4">곧 공개됩니다</Heading>
          <Text className="text-muted-foreground mb-6">
            ARCO의 멋진 촬영 작품들을 준비 중입니다.
            <br />
            조금만 기다려주세요!
          </Text>
          
          <div className="text-sm text-muted-foreground">
            <Text size="sm">💡 현재는 촬영 예약 후 개인 갤러리를 통해 사진을 받아보실 수 있습니다.</Text>
          </div>
        </section>

        {/* What to Expect */}
        <section className="mb-16">
          <Heading level={2} className="text-center mb-12">갤러리에서 만나보실 작품들</Heading>
          
          <div className="grid gap-8 md:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Heading level={3} className="mb-2">{category.title}</Heading>
                  <Text className="text-muted-foreground">
                    {category.description}
                  </Text>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-neutral-50 rounded-lg p-12">
          <Heading level={2} className="mb-4">
            나만의 특별한 순간을 남겨보세요
          </Heading>
          <Text className="text-muted-foreground mb-6">
            ARCO와 함께 반려견의 아름다운 모습을 전문 촬영으로 담아보세요
          </Text>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link href="/photoshoots">촬영 예약하기</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">의상 둘러보기</Link>
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}
