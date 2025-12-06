import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  Trophy, 
  MapPin,
  Vibrate
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
    <div className="min-h-screen gradient-emergency-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Location Status */}
        <div className="glass-effect rounded-xl p-3 mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <MapPin className={`w-4 h-4 ${latitude ? 'text-success' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-xs font-medium text-foreground">
                {latitude && longitude 
                  ? 'Location Active' 
                  : 'Location Not Available'}
              </p>
              {latitude && longitude && (
                <p className="text-[10px] text-muted-foreground">
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
            className="text-xs h-8"
          >
            {locationLoading ? 'Getting...' : 'Update'}
          </Button>
        </div>

        {/* Emergency Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <EmergencyButton
              icon={AlertTriangle}
              label="Report"
              sublabel="Accident"
              variant="warning"
              onClick={() => setShowReportModal(true)}
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <EmergencyButton
              icon={Phone}
              label="Ambulance"
              sublabel="Call 108"
              variant="emergency"
              onClick={handleCallAmbulance}
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <EmergencyButton
              icon={Shield}
              label="Police"
              sublabel="Call 100"
              variant="glass"
              onClick={handleCallPolice}
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
        <div className="glass-effect rounded-xl p-4 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Vibrate className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Auto Accident Detection</h3>
              <p className="text-xs text-muted-foreground">
                {shakeSupported 
                  ? 'Shake device to trigger alert'
                  : 'Not supported on this device'}
              </p>
            </div>
          </div>
          
          {shakeSupported && (
            <Button
              variant={shakeEnabled ? 'success' : 'outline'}
              onClick={shakeEnabled ? undefined : handleEnableShake}
              className="w-full h-9 text-sm"
              disabled={shakeEnabled}
            >
              {shakeEnabled ? '✓ Detection Active' : 'Enable Shake Detection'}
            </Button>
          )}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-3 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="glass-effect rounded-xl p-3">
            <div className="text-xl font-black text-primary">108</div>
            <div className="text-[10px] text-muted-foreground">Ambulance</div>
          </div>
          <div className="glass-effect rounded-xl p-3">
            <div className="text-xl font-black text-accent">100</div>
            <div className="text-[10px] text-muted-foreground">Police</div>
          </div>
          <div className="glass-effect rounded-xl p-3">
            <div className="text-xl font-black text-secondary">101</div>
            <div className="text-[10px] text-muted-foreground">Fire</div>
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
