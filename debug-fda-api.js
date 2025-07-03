// Debug script to test FDA API directly
const FDA_BASE_URL = 'https://api.fda.gov/drug';

async function debugFDAAPI(ndc) {
  console.log('=== Debugging FDA API for NDC:', ndc, '===');
  
  // Test 1: Basic FDA API call
  console.log('\n1. Testing basic FDA API call...');
  try {
    const url = `${FDA_BASE_URL}/ndc.json?search=product_ndc:"${ndc}"&limit=1`;
    console.log('URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.results && data.results.length > 0) {
        console.log('✅ Found drug in FDA database!');
        const drug = data.results[0];
        console.log('Brand Name:', drug.brand_name);
        console.log('Generic Name:', drug.generic_name);
        console.log('Dosage Form:', drug.dosage_form);
        console.log('Strength:', drug.active_ingredients?.[0]?.strength);
        console.log('Manufacturer:', drug.labeler_name);
      } else {
        console.log('❌ No results found in FDA database');
      }
    } else {
      console.log('❌ FDA API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }
  
  // Test 2: Try different search formats
  console.log('\n2. Testing different search formats...');
  const searchFormats = [
    `product_ndc:"${ndc}"`,
    `product_ndc:${ndc}`,
    `ndc:"${ndc}"`,
    `ndc:${ndc}`,
    `"${ndc}"`,
    ndc
  ];
  
  for (const searchFormat of searchFormats) {
    try {
      const url = `${FDA_BASE_URL}/ndc.json?search=${encodeURIComponent(searchFormat)}&limit=1`;
      console.log(`\nTrying: ${searchFormat}`);
      console.log('URL:', url);
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          console.log('✅ Found with format:', searchFormat);
          const drug = data.results[0];
          console.log('Drug:', drug.brand_name || drug.generic_name);
          break;
        } else {
          console.log('❌ No results with format:', searchFormat);
        }
      } else {
        console.log('❌ Error with format:', searchFormat, response.status);
      }
    } catch (error) {
      console.log('❌ Exception with format:', searchFormat, error.message);
    }
  }
  
  // Test 3: Try without any search (just get some results to verify API works)
  console.log('\n3. Testing FDA API without search (to verify API works)...');
  try {
    const url = `${FDA_BASE_URL}/ndc.json?limit=1`;
    console.log('URL:', url);
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ FDA API is working, got sample data');
      console.log('Sample result:', data.results?.[0]?.brand_name || 'No brand name');
    } else {
      console.log('❌ FDA API is not working:', response.status);
    }
  } catch (error) {
    console.error('❌ Exception testing basic FDA API:', error);
  }
}

// Test the NDC from FDA website
debugFDAAPI('29485-8152-6'); 