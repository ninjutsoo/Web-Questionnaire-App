// Test script for the new formatting function
import { formatDrugInfo } from './src/services/drugLookupService.js';

// Test with the Natrol Melatonin data
const testData = {
  success: true,
  data: {
    brandName: "Natrol Melatonin Fast Dissolve Tablets Helps You Fall Asleep Faster Stay Asleep Longer Easy to Take Dissolves in Mouth Faster Absorption Maximum Strength Strawberry Flavor 5mg 200",
    genericName: "Melatonin",
    dosageForm: "Tablet",
    strength: "5mg",
    manufacturer: "Natrol",
    upc: "047469076054"
  },
  source: "UPC Database",
  isMedication: true
};

console.log('Original brand name:', testData.data.brandName);
console.log('Formatted result:', formatDrugInfo(testData));

// Test with other examples
const testCases = [
  {
    brandName: "Tylenol Extra Strength Acetaminophen 500mg Tablets",
    genericName: "Acetaminophen",
    expected: "Tylenol Acetaminophen 500mg"
  },
  {
    brandName: "Advil Ibuprofen 200mg Caplets",
    genericName: "Ibuprofen", 
    expected: "Advil Ibuprofen 200mg"
  },
  {
    brandName: "Vitamin D3 1000 IU Softgels",
    genericName: "Vitamin D3",
    expected: "Vitamin D3 1000mg"
  }
];

console.log('\n--- Test Cases ---');
testCases.forEach((testCase, index) => {
  const mockData = {
    success: true,
    data: {
      brandName: testCase.brandName,
      genericName: testCase.genericName,
      dosageForm: "Unknown",
      strength: "Unknown",
      manufacturer: "Unknown"
    }
  };
  
  console.log(`Test ${index + 1}:`);
  console.log(`  Input: ${testCase.brandName}`);
  console.log(`  Output: ${formatDrugInfo(mockData)}`);
  console.log(`  Expected: ${testCase.expected}`);
  console.log('');
}); 