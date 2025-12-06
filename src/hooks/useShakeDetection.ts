import { useState, useEffect, useCallback, useRef } from 'react';

interface ShakeDetectionState {
  isShaking: boolean;
  shakeDetected: boolean;
  isSupported: boolean;
  isEnabled: boolean;
}

export function useShakeDetection(threshold: number = 15, timeout: number = 1000) {
  const [state, setState] = useState<ShakeDetectionState>({
    isShaking: false,
    shakeDetected: false,
    isSupported: typeof DeviceMotionEvent !== 'undefined',
    isEnabled: false,
  });

  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const shakeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    const last = lastAcceleration.current;

    const deltaX = Math.abs((x || 0) - last.x);
    const deltaY = Math.abs((y || 0) - last.y);
    const deltaZ = Math.abs((z || 0) - last.z);

    if (deltaX + deltaY + deltaZ > threshold) {
      setState(prev => ({ ...prev, isShaking: true, shakeDetected: true }));
      
      if (shakeTimeout.current) {
        clearTimeout(shakeTimeout.current);
      }
      
      shakeTimeout.current = setTimeout(() => {
        setState(prev => ({ ...prev, isShaking: false }));
      }, 500);
    }

    lastAcceleration.current = { x: x || 0, y: y || 0, z: z || 0 };
  }, [threshold]);

  const enableDetection = useCallback(async () => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setState(prev => ({ ...prev, isSupported: false }));
      return false;
    }

    // Request permission for iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          return false;
        }
      } catch (error) {
        console.error('Error requesting motion permission:', error);
        return false;
      }
    }

    window.addEventListener('devicemotion', handleMotion);
    setState(prev => ({ ...prev, isEnabled: true }));
    return true;
  }, [handleMotion]);

  const disableDetection = useCallback(() => {
    window.removeEventListener('devicemotion', handleMotion);
    setState(prev => ({ ...prev, isEnabled: false }));
  }, [handleMotion]);

  const resetShakeDetected = useCallback(() => {
    setState(prev => ({ ...prev, shakeDetected: false }));
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (shakeTimeout.current) {
        clearTimeout(shakeTimeout.current);
      }
    };
  }, [handleMotion]);

  return { ...state, enableDetection, disableDetection, resetShakeDetected };
}
