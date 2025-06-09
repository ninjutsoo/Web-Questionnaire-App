import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    // Screen dimensions
    width: window.innerWidth,
    height: window.innerHeight,
    
    // Device type
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    
    // Specific devices
    isIOS: false,
    isAndroid: false,
    isIPhone: false,
    isIPad: false,
    
    // Capabilities
    isTouch: false,
    isLandscape: false,
    
    // Breakpoints
    breakpoint: 'desktop' // mobile, tablet, desktop
  });

  const getDeviceInfo = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent;
    
    // Device detection
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isIPhone = /iPhone/.test(userAgent);
    const isIPad = /iPad/.test(userAgent);
    
    // Touch detection
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Orientation
    const isLandscape = width > height;
    
    // Breakpoints
    let breakpoint = 'desktop';
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;
    
    if (width < 768) {
      breakpoint = 'mobile';
      isMobile = true;
    } else if (width < 1024) {
      breakpoint = 'tablet';
      isTablet = true;
    } else {
      breakpoint = 'desktop';
      isDesktop = true;
    }
    
    // Special handling for iPad (sometimes reports as desktop)
    if (isIPad || (isTouch && width >= 768 && width < 1366)) {
      breakpoint = 'tablet';
      isTablet = true;
      isMobile = false;
      isDesktop = false;
    }
    
    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      isIPhone,
      isIPad,
      isTouch,
      isLandscape,
      breakpoint
    };
  };

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    // Initial detection
    setDeviceInfo(getDeviceInfo());

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
};

// Utility functions for common checks
export const useBreakpoint = () => {
  const { breakpoint } = useResponsive();
  return breakpoint;
};

export const useIsMobile = () => {
  const { isMobile } = useResponsive();
  return isMobile;
};

export const useIsTablet = () => {
  const { isTablet } = useResponsive();
  return isTablet;
};

export const useIsDesktop = () => {
  const { isDesktop } = useResponsive();
  return isDesktop;
};

export const useIsTouch = () => {
  const { isTouch } = useResponsive();
  return isTouch;
}; 