import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const regionId = 'qr-reader';

  useEffect(() => {
    let isMounted = true;
    scannerRef.current = new Html5Qrcode(regionId);

    // Wait for the DOM to be ready
    const startScanner = () => {
      if (!isMounted) return;
      scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 20,      // Faster scanning
          qrbox: 320,    // Larger scan area
        },
        (decodedText) => {
          onScan(decodedText);
          scannerRef.current.stop();
          if (onClose) onClose();
        },
        (error) => {
          // Optionally handle scan errors
        }
      ).catch((err) => {
        // Optionally handle start errors
      });
    };

    // Use requestAnimationFrame to ensure the div is rendered
    const waitForDiv = () => {
      const el = document.getElementById(regionId);
      if (el) {
        startScanner();
      } else {
        requestAnimationFrame(waitForDiv);
      }
    };
    waitForDiv();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScan, onClose]);

  return (
    <div style={{ position: 'relative', zIndex: 10, background: '#fff', borderRadius: 8, padding: 8 }}>
      <div id={regionId} style={{ width: 340, height: 340, margin: '0 auto' }} />
      <button onClick={onClose} style={{ marginTop: 8, width: '100%' }}>Close Scanner</button>
    </div>
  );
}

export default QRScanner; 