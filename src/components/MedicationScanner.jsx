import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { Button, Modal, message, Spin } from 'antd';
import { QrcodeOutlined, CameraOutlined, SearchOutlined } from '@ant-design/icons';
import { lookupDrugByNDC, lookupDrugByUPC, formatDrugInfo } from '../services/drugLookupService';

function MedicationScanner({ onMedScanned, visible, onClose }) {
  const [isScanning, setIsScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [manualMedication, setManualMedication] = useState('');
  const [hasScanned, setHasScanned] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [drugInfo, setDrugInfo] = useState(null);
  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Initialize Html5Qrcode when modal becomes visible
  useEffect(() => {
    if (visible && !isInitialized) {
      const initScanner = async () => {
        try {
          // Wait for DOM to be ready and check element exists
          let attempts = 0;
          const maxAttempts = 10;
          
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const element = document.getElementById("qr-reader");
            if (element && element.clientWidth > 0 && !scannerRef.current) {
              console.log('QR reader element found and ready');
              const qrCode = new Html5Qrcode("qr-reader");
              scannerRef.current = qrCode;
              setHtml5QrCode(qrCode);
              setIsInitialized(true);
              break;
            }
            attempts++;
            console.log(`Attempt ${attempts}: QR reader element not ready yet`);
          }
          
          if (attempts >= maxAttempts) {
            console.error('Failed to initialize scanner after maximum attempts');
          }
        } catch (error) {
          console.error('Error initializing scanner:', error);
        }
      };
      
      initScanner();
    }

    return () => {
      if (scannerRef.current && isRunning) {
        safeStopScanner();
      }
    };
  }, [visible, isInitialized, html5QrCode]);

  // Start scanning when initialized
  useEffect(() => {
    if (visible && html5QrCode && isInitialized && !isScanning) {
      setTimeout(() => {
        if (visible && !isScanning) {
          startScanning();
        }
      }, 500);
    }
  }, [visible, html5QrCode, isInitialized, isScanning]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!visible) {
      if (scannerRef.current && isRunning) {
        safeStopScanner();
      }
      setIsScanning(false);
      setIsRunning(false);
      setIsInitialized(false);
      setHtml5QrCode(null);
      setShowManualEntry(false);
      setScannedCode('');
      setManualMedication('');
      setHasScanned(false);
      setIsLookingUp(false);
      setDrugInfo(null);
      isProcessingRef.current = false;
      scannerRef.current = null;
    }
  }, [visible, html5QrCode, isRunning]);

  const startScanning = async () => {
    if (!html5QrCode) {
      message.error('QR scanner not initialized');
      return;
    }

    try {
      setIsScanning(true);
      message.loading('Starting camera...', 1);
      
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
          // Prevent multiple scans using ref
          if (isProcessingRef.current || hasScanned) {
            console.log("Ignoring duplicate scan:", decodedText);
            return;
          }
          
          console.log("Scanned medication:", decodedText);
          isProcessingRef.current = true;
          setHasScanned(true);
          
          // Immediately stop the scanner
          if (scannerRef.current) {
            try {
              scannerRef.current.stop().then(() => {
                console.log("Scanner stopped successfully");
                setIsRunning(false);
                setIsScanning(false);
              }).catch((error) => {
                console.log("Error stopping scanner:", error);
                setIsRunning(false);
                setIsScanning(false);
              });
            } catch (error) {
              console.log("Exception stopping scanner:", error);
              setIsRunning(false);
              setIsScanning(false);
            }
          }
          
          // Check if it's a numeric code (NDC or UPC)
          if (/^\d+$/.test(decodedText)) {
            setScannedCode(decodedText);
            setShowManualEntry(true);
            setIsLookingUp(true);
            
            // Determine if it's likely NDC (10-11 digits) or UPC (12-13 digits)
            const codeLength = decodedText.length;
            let lookupResult;
            
            try {
              if (codeLength >= 10 && codeLength <= 11) {
                // Likely NDC code
                console.log('Attempting NDC lookup for:', decodedText);
                lookupResult = await lookupDrugByNDC(decodedText);
              } else if (codeLength >= 12 && codeLength <= 13) {
                // Likely UPC code
                console.log('Attempting UPC lookup for:', decodedText);
                lookupResult = await lookupDrugByUPC(decodedText);
              } else {
                // Try both NDC and UPC
                console.log('Trying both NDC and UPC lookup for:', decodedText);
                lookupResult = await lookupDrugByNDC(decodedText);
                if (!lookupResult.success) {
                  lookupResult = await lookupDrugByUPC(decodedText);
                }
              }
              
              setDrugInfo(lookupResult);
              
              if (lookupResult.success) {
                const formattedInfo = formatDrugInfo(lookupResult);
                setManualMedication(formattedInfo);
                message.success('Drug information found and loaded!');
              } else {
                const codeType = codeLength >= 12 ? 'UPC' : 'NDC';
                message.info(`${codeType} code: ${decodedText}. Drug information not found in databases. Please enter manually.`);
              }
            } catch (error) {
              console.error('Error looking up drug:', error);
              message.info(`Code: ${decodedText}. Please enter medication details manually.`);
            } finally {
              setIsLookingUp(false);
            }
          } else {
            onMedScanned(decodedText);
            message.success('Medication scanned successfully!');
            onClose();
          }
        },
        (error) => {
          // Log all errors for debugging
          console.log('Scanner error:', error);
          
          // Stop scanning on certain errors to prevent loops
          if (error && (error.name === 'NotAllowedError' || error.name === 'NotFoundError')) {
            setIsRunning(false);
            setIsScanning(false);
          }
        }
      );
      
      setIsRunning(true);
      message.success('Camera started successfully!');
      console.log('Scanner started successfully');
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      
      if (error.name === 'NotAllowedError') {
        message.error('Camera access denied. Please allow camera permissions and try again.');
      } else if (error.name === 'NotFoundError') {
        message.error('No camera found. Please check your device has a camera.');
      } else {
        message.error('Failed to start camera. Please check camera permissions and try again.');
      }
    }
  };

  const stopScanning = async () => {
    if (html5QrCode && isRunning) {
      try {
        await html5QrCode.stop();
        setIsRunning(false);
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
        // Even if stop fails, reset the state
        setIsRunning(false);
        setIsScanning(false);
      }
    }
  };

  const safeStopScanner = async () => {
    if (scannerRef.current && isRunning) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        // Ignore "scanner is not running" errors
        if (!error.message?.includes('not running')) {
          console.error('Error stopping scanner:', error);
        }
      } finally {
        setIsRunning(false);
        setIsScanning(false);
        isProcessingRef.current = false;
      }
    }
  };

  const handleClose = () => {
    safeStopScanner();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <QrcodeOutlined style={{ color: '#1890ff' }} />
          <span>Scan Medication QR Code or UPC Barcode</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={[
        showManualEntry ? (
                  <Button key="back" onClick={() => {
          setShowManualEntry(false);
          setScannedCode('');
          setManualMedication('');
          setHasScanned(false);
          setIsLookingUp(false);
          setDrugInfo(null);
          isProcessingRef.current = false;
        }}>
          Back to Scanner
        </Button>
        ) : (
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>
        ),
        showManualEntry ? (
          <Button 
            key="submit" 
            type="primary"
            onClick={() => {
              if (manualMedication.trim()) {
                onMedScanned(`NDC: ${scannedCode} - ${manualMedication}`);
                onClose();
                message.success('Medication added successfully!');
              } else {
                message.error('Please enter medication details');
              }
            }}
            style={{ marginLeft: '8px' }}
          >
            Add Medication
          </Button>
        ) : (
          <Button 
            key="test" 
            onClick={() => {
              console.log('Test button clicked');
              onMedScanned('Lisinopril 10mg - Take 1 tablet daily');
              onClose();
              message.success('Test medication added!');
            }}
            style={{ marginLeft: '8px' }}
          >
            Test Add Medication
          </Button>
        )
      ]}
      width={500}
      destroyOnHidden
    >
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {!showManualEntry ? (
            <div>
              <div 
                id="qr-reader" 
                style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  margin: '0 auto',
                  border: '2px solid #d9d9d9',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }} 
              />
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '15px', color: '#1890ff' }}>
                📋 Enter Medication Details
              </h4>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                {scannedCode.length >= 12 ? 'UPC' : 'NDC'} Code: <strong>{scannedCode}</strong>
              </p>
              
              {isLookingUp && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '15px', 
                  backgroundColor: '#e6f7ff', 
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}>
                  <Spin size="small" style={{ marginRight: '8px' }} />
                  <span style={{ color: '#1890ff' }}>
                    <SearchOutlined /> Looking up drug information...
                  </span>
                </div>
              )}
              
              {drugInfo && drugInfo.success && (
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#f6ffed', 
                  borderRadius: '4px',
                  marginBottom: '15px',
                  border: '1px solid #b7eb8f'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#52c41a' }}>
                    <strong>✓ Drug information found ({drugInfo.source}):</strong>
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                    {drugInfo.data.brandName} {drugInfo.data.strength !== 'Unknown' ? `(${drugInfo.data.strength})` : ''}
                  </p>
                  {drugInfo.data.genericName && drugInfo.data.genericName !== drugInfo.data.brandName && (
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>
                      Generic: {drugInfo.data.genericName}
                    </p>
                  )}
                  {drugInfo.note && (
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#fa8c16' }}>
                      Note: {drugInfo.note}
                    </p>
                  )}
                </div>
              )}
              
              <textarea
                placeholder="Enter medication name, dosage, and instructions (e.g., 'Lisinopril 10mg - Take 1 tablet daily')"
                value={manualMedication}
                onChange={(e) => setManualMedication(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
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
              <p>Point your camera at a medication QR code or UPC barcode</p>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#1890ff' }}>
                Make sure the code is well-lit and clearly visible
              </p>
            </div>
          ) : (
            <div>
              <p>Point your camera at a medication QR code or UPC barcode to scan</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>
                Make sure you have camera permissions enabled
              </p>
            </div>
          )}
        </div>
        
        {/* Test QR Code for debugging */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            <strong>Test Codes:</strong> Try scanning these test codes first
          </p>
          <div style={{ 
            display: 'inline-block',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              {/* Simple test QR code pattern */}
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="black" strokeWidth="2"/>
              <rect x="15" y="15" width="10" height="10" fill="black"/>
              <rect x="75" y="15" width="10" height="10" fill="black"/>
              <rect x="15" y="75" width="10" height="10" fill="black"/>
              <rect x="30" y="30" width="5" height="5" fill="black"/>
              <rect x="40" y="30" width="5" height="5" fill="black"/>
              <rect x="50" y="30" width="5" height="5" fill="black"/>
              <rect x="60" y="30" width="5" height="5" fill="black"/>
              <rect x="30" y="40" width="5" height="5" fill="black"/>
              <rect x="40" y="40" width="5" height="5" fill="black"/>
              <rect x="50" y="40" width="5" height="5" fill="black"/>
              <rect x="60" y="40" width="5" height="5" fill="black"/>
            </svg>
          </div>
          <p style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>
            Test Codes: "TEST_MEDICATION_123" or try a real UPC like "0123456789012"
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default MedicationScanner; 