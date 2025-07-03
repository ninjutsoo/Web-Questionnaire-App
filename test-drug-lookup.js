// Test script for drug lookup service
import { lookupDrugByNDC, formatDrugInfo } from './src/services/drugLookupService.js';

async function main() {
  const ndc = '29485-8152-6';
  console.log('Testing robust lookup for NDC:', ndc);
  const result = await lookupDrugByNDC(ndc);
  console.log('Lookup result:', result);
  console.log('Formatted:', formatDrugInfo(result));
}

main(); 