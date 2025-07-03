// Test script for UPC lookup functionality
import { lookupDrugByUPC } from './src/services/drugLookupService.js';

// Test UPC codes (some real, some fake)
const testUPCs = [
  '047469076054', // Natrol Melatonin 5mg, 180 Tablets
  '0123456789012', // Generic test UPC
  '036000291452',  // Real UPC (Tylenol)
  '012345678901',  // 12-digit test
  '1234567890123', // 13-digit test
  '036000291452',  // Tylenol (common medication)
  '036000291453',  // Another potential medication
  '036000291454',  // Another potential medication
];

async function testUPCLookup() {
  console.log('Testing UPC lookup functionality...\n');
  
  for (const upc of testUPCs) {
    console.log(`Testing UPC: ${upc}`);
    try {
      const result = await lookupDrugByUPC(upc);
      console.log('Result:', JSON.stringify(result, null, 2));
      
      if (result.success && result.isMedication) {
        console.log('✅ MEDICATION DETECTED!');
      } else if (result.success) {
        console.log('⚠️ Product found but not identified as medication');
      } else {
        console.log('❌ Product not found');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    console.log('---\n');
  }
}

// Run the test
testUPCLookup(); 