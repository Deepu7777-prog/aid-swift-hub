import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmergencyButtonProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  variant?: 'emergency' | 'warning' | 'success' | 'glass';
  onClick: () => void;
  className?: string;
}

export function EmergencyButton({
  icon: Icon,
  label,
  sublabel,
  variant = 'glass',
  onClick,
  className,
}: EmergencyButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center h-auto py-6 px-4 w-full aspect-square max-w-[160px]',
        'rounded-2xl transition-all duration-300 hover:scale-105',
        className
      )}
    >
      <Icon className="w-10 h-10 mb-2" />
      <span className="text-base font-bold">{label}</span>
      {sublabel && (
        <span className="text-xs opacity-80 mt-1">{sublabel}</span>
      )}
    </Button>
  );
}
