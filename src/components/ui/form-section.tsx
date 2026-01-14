import { ReactNode } from 'react';
import { Heading, Text } from '@/components/ui/typography';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <Heading level={3}>{title}</Heading>
        {description && <Text variant="muted">{description}</Text>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
