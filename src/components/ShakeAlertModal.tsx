import { useEffect, useState } from 'react';
import { AlertTriangle, X, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { storage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface ShakeAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ShakeAlertModal({ isOpen, onClose, onConfirm }: ShakeAlertModalProps) {
  const [countdown, setCountdown] = useState(10);
  const { latitude, longitude, getLocation, loading } = useGeolocation();

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      getLocation();
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleAutoAlert = () => {
    const user = storage.getUser();
    storage.addReport({
      userId: user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
      description: 'Automatic accident detection via shake sensor',
      photoUrl: null,
      status: 'pending',
      type: 'shake-detected',
    });
    
    toast({
      title: 'Emergency Alert Sent',
      description: 'Your location has been shared with emergency services.',
    });
    
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in">
      <div className="glass-effect rounded-3xl p-8 max-w-md w-full shake-alert">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/20">
              <AlertTriangle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Accident Detected!</h2>
              <p className="text-muted-foreground text-sm">Shake detected on device</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-black text-primary mb-2">{countdown}</div>
          <p className="text-muted-foreground">
            Emergency alert will be sent automatically
          </p>
        </div>

        {latitude && longitude && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 justify-center">
            <MapPin className="w-4 h-4" />
            <span>{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="emergency"
            size="xl"
            onClick={handleAutoAlert}
            className="w-full"
          >
            <Phone className="w-5 h-5" />
            Send Alert Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="w-full"
          >
            I'm OK - Cancel Alert
          </Button>
        </div>
      </div>
    </div>
  );
}
