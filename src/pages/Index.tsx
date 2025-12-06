import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  Trophy, 
  MapPin,
  Vibrate,
  Siren
} from 'lucide-react';
import { Header } from '@/components/Header';
import { EmergencyButton } from '@/components/EmergencyButton';
import { ShakeAlertModal } from '@/components/ShakeAlertModal';
import { ReportAccidentModal } from '@/components/ReportAccidentModal';
import { useShakeDetection } from '@/hooks/useShakeDetection';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [showShakeAlert, setShowShakeAlert] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { latitude, longitude, getLocation, loading: locationLoading } = useGeolocation();
  
  const { 
    shakeDetected, 
    isEnabled: shakeEnabled,
    isSupported: shakeSupported,
    enableDetection, 
    resetShakeDetected 
  } = useShakeDetection(25);

  useEffect(() => {
    if (shakeDetected && shakeEnabled) {
      setShowShakeAlert(true);
    }
  }, [shakeDetected, shakeEnabled]);

  const handleShakeAlertClose = () => {
    setShowShakeAlert(false);
    resetShakeDetected();
  };

  const handleEnableShake = async () => {
    const success = await enableDetection();
    if (success) {
      toast({
        title: 'Shake Detection Enabled',
        description: 'Your device will now detect accidents automatically.',
      });
    } else {
      toast({
        title: 'Permission Denied',
        description: 'Please allow motion sensor access to enable shake detection.',
        variant: 'destructive',
      });
    }
  };

  const handleCallAmbulance = () => {
    window.location.href = 'tel:108';
  };

  const handleCallPolice = () => {
    window.location.href = 'tel:100';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
            <Siren className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Unified Emergency System
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Quick access to emergency services. Report accidents, call for help, and earn rewards for community safety.
          </p>
        </div>

        {/* Location Status */}
        <div className="glass-effect rounded-2xl p-4 mb-8 flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <MapPin className={`w-5 h-5 ${latitude ? 'text-success' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-sm font-medium text-foreground">
                {latitude && longitude 
                  ? 'Location Active' 
                  : 'Location Not Available'}
              </p>
              {latitude && longitude && (
                <p className="text-xs text-muted-foreground">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={getLocation}
            disabled={locationLoading}
          >
            {locationLoading ? 'Getting...' : 'Update'}
          </Button>
        </div>

        {/* Emergency Buttons Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <EmergencyButton
              icon={AlertTriangle}
              label="Report"
              sublabel="Accident"
              variant="warning"
              onClick={() => setShowReportModal(true)}
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <EmergencyButton
              icon={Phone}
              label="Ambulance"
              sublabel="Call 108"
              variant="emergency"
              onClick={handleCallAmbulance}
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <EmergencyButton
              icon={Shield}
              label="Police"
              sublabel="Call 100"
              variant="glass"
              onClick={handleCallPolice}
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <EmergencyButton
              icon={Trophy}
              label="Rewards"
              sublabel="Dashboard"
              variant="success"
              onClick={() => navigate('/dashboard')}
            />
          </div>
        </div>

        {/* Shake Detection */}
        <div className="glass-effect rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-secondary/20">
              <Vibrate className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Auto Accident Detection</h3>
              <p className="text-sm text-muted-foreground">
                {shakeSupported 
                  ? 'Shake your device to trigger emergency alert'
                  : 'Not supported on this device'}
              </p>
            </div>
          </div>
          
          {shakeSupported && (
            <Button
              variant={shakeEnabled ? 'success' : 'outline'}
              onClick={shakeEnabled ? undefined : handleEnableShake}
              className="w-full"
              disabled={shakeEnabled}
            >
              {shakeEnabled ? '✓ Detection Active' : 'Enable Shake Detection'}
            </Button>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="glass-effect rounded-xl p-4">
            <div className="text-2xl font-black text-primary">108</div>
            <div className="text-xs text-muted-foreground">Ambulance</div>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <div className="text-2xl font-black text-accent">100</div>
            <div className="text-xs text-muted-foreground">Police</div>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <div className="text-2xl font-black text-secondary">101</div>
            <div className="text-xs text-muted-foreground">Fire</div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ShakeAlertModal
        isOpen={showShakeAlert}
        onClose={handleShakeAlertClose}
        onConfirm={handleShakeAlertClose}
      />
      
      <ReportAccidentModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};

export default Index;
