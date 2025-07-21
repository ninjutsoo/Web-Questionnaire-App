import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { Modal, message, Button, Spin } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import { lookupDrugByNDC, lookupDrugByUPC } from '../services/drugLookupService';

function MedicationScanner({ onMedScanned, visible, onClose }) {
  const [isScanning, setIsScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);
  const isUnmountedRef = useRef(false);

  // Awaitable safe stop and destroy
  const safeStopAndDestroyScanner = async () => {
    if (scannerRef.current) {
      if (isRunning) {
        try {
          await scannerRef.current.stop();
        } catch (error) {
          if (!error.message?.includes('not running')) {
            console.error('Error stopping scanner:', error);
          }
        }
      }
      try {
        await scannerRef.current.clear(); // Destroys the scanner and releases camera
      } catch (error) {
        // ignore
      }
      scannerRef.current = null;
      setHtml5QrCode(null);
      setIsInitialized(false);
      setIsRunning(false);
      setIsScanning(false);
      setIsLookingUp(false);
      isProcessingRef.current = false;
    }
  };

  useEffect(() => {
    isUnmountedRef.current = false;
    if (visible) {
      const initScanner = async () => {
        try {
          let attempts = 0;
          const maxAttempts = 10;
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const element = document.getElementById("qr-reader");
            if (element && element.clientWidth > 0 && !scannerRef.current) {
              const qrCode = new Html5Qrcode("qr-reader");
              scannerRef.current = qrCode;
              setHtml5QrCode(qrCode);
              setIsInitialized(true);
              break;
            }
            attempts++;
          }
        } catch (error) {
          console.error('Error initializing scanner:', error);
        }
      };
      initScanner();
    }
    return () => {
      isUnmountedRef.current = true;
      (async () => { await safeStopAndDestroyScanner(); })();
    };
  }, [visible]); // Only depend on visible

  useEffect(() => {
    if (visible && html5QrCode && isInitialized && !isScanning) {
      setTimeout(() => {
        if (visible && !isScanning) {
          startScanning();
        }
      }, 500);
    }
  }, [visible, html5QrCode, isInitialized, isScanning]);

  useEffect(() => {
    if (!visible) {
      (async () => { await safeStopAndDestroyScanner(); })();
    }
  }, [visible]);

  const tryAllLookups = async (code) => {
    // Try NDC and UPC lookups, return the first successful result
    let ndcResult = null;
    let upcResult = null;
    let errorMessages = [];
    try {
      ndcResult = await lookupDrugByNDC(code);
      if (ndcResult && ndcResult.success) return ndcResult;
      if (ndcResult && ndcResult.error) errorMessages.push(ndcResult.error);
    } catch (e) { errorMessages.push('NDC lookup error'); }
    try {
      upcResult = await lookupDrugByUPC(code);
      if (upcResult && upcResult.success) return upcResult;
      if (upcResult && upcResult.error) errorMessages.push(upcResult.error);
    } catch (e) { errorMessages.push('UPC lookup error'); }
    return { success: false, error: errorMessages.join('; ') || 'Not found in any database' };
  };

  const startScanning = async () => {
    if (!html5QrCode) {
      // message.error('QR scanner not initialized');
      console.error('QR scanner not initialized');
      return;
    }
    if (isRunning) return; // Prevent double start
    try {
      setIsScanning(true);
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        },
        async (decodedText) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;
          setIsLookingUp(true);
          if (scannerRef.current) {
            scannerRef.current.stop().finally(() => {
              setIsRunning(false);
              setIsScanning(false);
            });
          }
          if (/^\d+$/.test(decodedText)) {
            const lookupResult = await tryAllLookups(decodedText);
            if (lookupResult.success) {
              onMedScanned(lookupResult.data);
              message.success('Medication found and added!');
              onClose();
            } else {
              // message.error('Drug information not found in any database.');
              console.error('Drug information not found in any database.');
              setIsLookingUp(false);
              isProcessingRef.current = false;
            }
          } else {
            // message.error('Invalid code scanned. Please scan a valid medication barcode.');
            console.error('Invalid code scanned. Please scan a valid medication barcode.');
            setIsLookingUp(false);
            isProcessingRef.current = false;
          }
        },
        (error) => {
          // Handle QR code parse errors gracefully
          if (error && error.toString().includes('QR code parse error')) {
            // message.error('QR code parse error. Please try again with a valid code.');
            console.error('QR code parse error. Please try again with a valid code.');
            setIsScanning(false);
            setIsRunning(false);
            isProcessingRef.current = false;
            return;
          }
          console.log('Scanner error:', error);
          if (error && (error.name === 'NotAllowedError' || error.name === 'NotFoundError')) {
            setIsRunning(false);
            setIsScanning(false);
          }
        }
      );
      setIsRunning(true);
    } catch (error) {
      setIsScanning(false);
      // Remove all user-facing error messages, only log
      // message.error('Camera access denied. Please allow camera permissions and try again.');
      // message.error('No camera found. Please check your device has a camera.');
      // message.error('Failed to start camera. Please check camera permissions and try again.');
      console.error('Camera error:', error);
    }
  };

  const handleClose = async () => {
    await safeStopAndDestroyScanner();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <QrcodeOutlined style={{ color: '#1890ff' }} />
          <span>Scan Medication QR Code or Barcode</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>Cancel</Button>
      ]}
      width={400}
      destroyOnHidden
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div>
          <div
            id="qr-reader"
            style={{
              width: '100%',
              maxWidth: '320px',
              margin: '0 auto',
              border: '2px solid #d9d9d9',
              borderRadius: '8px',
              overflow: 'hidden',
              minHeight: '320px'
            }}
          />
        </div>
        {isLookingUp && (
          <div style={{ marginTop: 24 }}>
            <Spin size="large" />
            <div style={{ marginTop: 8, color: '#1890ff' }}>Looking up drug information...</div>
          </div>
        )}
        <div style={{ marginTop: '16px', color: '#666' }}>
          {!isInitialized ? (
            <div>
              <p style={{ color: '#1890ff', fontWeight: 'bold' }}>⏳ Initializing scanner...</p>
              <p>Please wait while we set up the camera</p>
            </div>
          ) : isScanning ? (
            <div>
              <p style={{ color: '#1890ff', fontWeight: 'bold' }}>🔍 Scanning...</p>
              <p>Point your camera at a medication QR code or barcode</p>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#1890ff' }}>
                Make sure the code is well-lit and clearly visible
              </p>
            </div>
          ) : (
            <div>
              <p>Point your camera at a medication QR code or barcode to scan</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>
                Make sure you have camera permissions enabled
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default MedicationScanner; 