import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/typography';

interface FormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
}

export function FormField({
  label,
  id,
  required = false,
  error,
  description,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <Text variant="muted" className="text-xs">
          {description}
        </Text>
      )}
      {children}
      {error && (
        <Text variant="muted" className="text-xs text-red-500">
          {error}
        </Text>
      )}
    </div>
  );
}
