import { useState, useRef } from 'react';
import { X, Camera, MapPin, Send, Upload, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { storage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReportAccidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportAccidentModal({ isOpen, onClose }: ReportAccidentModalProps) {
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { latitude, longitude, getLocation, loading: locationLoading, error: locationError } = useGeolocation();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please provide a brief description of the accident.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setIsLoadingAi(true);

    const user = storage.getUser();
    storage.addReport({
      userId: user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
      description,
      photoUrl: photoPreview,
      status: 'pending',
      type: 'manual',
    });

    // Call AI for summary and next steps
    try {
      const userLocation = latitude && longitude 
        ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
        : 'Location not provided';

      const { data, error } = await supabase.functions.invoke('accident-ai', {
        body: { 
          accidentDetails: description,
          userLocation 
        }
      });

      if (error) {
        console.error('AI function error:', error);
        toast({
          title: 'Report Submitted',
          description: 'Thank you! You earned 10 reward points.',
        });
      } else if (data?.message) {
        setAiSummary(data.message);
        toast({
          title: 'Report Submitted',
          description: 'AI is analyzing your report...',
        });
        setIsSubmitting(false);
        setIsLoadingAi(false);
        return; // Don't close modal yet, show AI summary
      }
    } catch (err) {
      console.error('Error calling AI:', err);
      toast({
        title: 'Report Submitted',
        description: 'Thank you! You earned 10 reward points.',
      });
    }

    setIsSubmitting(false);
    setIsLoadingAi(false);
    setDescription('');
    setPhotoPreview(null);
    onClose();
  };

  const handleClose = () => {
    setAiSummary(null);
    setDescription('');
    setPhotoPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  // Show AI Summary view
  if (aiSummary) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in">
        <div className="glass-effect rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              AI Analysis
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Report Summary & Next Steps</p>
            <div className="text-foreground whitespace-pre-wrap">{aiSummary}</div>
          </div>

          <div className="text-center text-sm text-success mb-4">
            ✓ You earned 10 reward points for this report!
          </div>

          <Button variant="default" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in">
      <div className="glass-effect rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Report Accident</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Upload Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
          />
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/50"
                onClick={() => setPhotoPreview(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Camera className="w-8 h-8" />
              <span className="text-sm">Tap to take photo or upload</span>
            </button>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the accident situation..."
            className="w-full h-24 px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Location
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={getLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {latitude && longitude ? 'Update Location' : 'Get Location'}
            </Button>
            {latitude && longitude && (
              <span className="text-sm text-success">
                ✓ Location captured
              </span>
            )}
            {locationError && (
              <span className="text-sm text-destructive">{locationError}</span>
            )}
          </div>
          {latitude && longitude && (
            <p className="text-xs text-muted-foreground mt-2">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          variant="emergency"
          size="xl"
          onClick={handleSubmit}
          disabled={isSubmitting || isLoadingAi}
          className="w-full"
        >
          {isSubmitting || isLoadingAi ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isLoadingAi ? 'Analyzing with AI...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
