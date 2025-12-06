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
        'flex flex-col items-center justify-center h-28 w-full',
        'rounded-2xl transition-all duration-300 hover:scale-[1.02]',
        'gap-1',
        className
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-bold">{label}</span>
      {sublabel && (
        <span className="text-xs opacity-80">{sublabel}</span>
      )}
    </Button>
  );
}
