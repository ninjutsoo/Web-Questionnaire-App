// Drug lookup service using FDA API and other sources
const FDA_BASE_URL = 'https://api.fda.gov/drug';

// UPC barcode lookup using UPC Database API (with CORS proxy)
const UPC_DB_URL = 'https://api.upcitemdb.com/prod/trial/lookup';
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];

// Generate all possible NDC formats (with/without dashes)
function generateNdcFormats(ndc) {
  const ndcStr = ndc.replace(/[^0-9]/g, '');
  const formats = new Set();
  // 11-digit (5-4-2)
  if (ndcStr.length === 11) {
    formats.add(ndcStr);
    formats.add(`${ndcStr.slice(0,5)}-${ndcStr.slice(5,9)}-${ndcStr.slice(9,11)}`);
    formats.add(`${ndcStr.slice(0,4)}-${ndcStr.slice(4,10)}-${ndcStr.slice(10)}`); // 4-6-1
    formats.add(`${ndcStr.slice(0,5)}-${ndcStr.slice(5,10)}-${ndcStr.slice(10)}`); // 5-5-1
  }
  // 10-digit (various)
  if (ndcStr.length === 10) {
    formats.add(ndcStr);
    formats.add(`${ndcStr.slice(0,4)}-${ndcStr.slice(4,8)}-${ndcStr.slice(8,10)}`); // 4-4-2
    formats.add(`${ndcStr.slice(0,5)}-${ndcStr.slice(5,9)}-${ndcStr.slice(9,10)}`); // 5-4-1
    formats.add(`${ndcStr.slice(0,5)}-${ndcStr.slice(5,10)}`); // 5-5
  }
  // Always add the original
  formats.add(ndc);
  return Array.from(formats);
}

export const lookupDrugByNDC = async (ndcCode) => {
  const tried = new Set();
  const formats = generateNdcFormats(ndcCode);

  for (const ndc of formats) {
    if (tried.has(ndc)) continue;
    tried.add(ndc);
    // Try FDA API
    try {
      const fdaResp = await fetch(`${FDA_BASE_URL}/ndc.json?search="${ndc}"&limit=1`);
      if (fdaResp.ok) {
        const data = await fdaResp.json();
        if (data.results && data.results.length > 0) {
          const drug = data.results[0];
          return {
            success: true,
            data: {
              brandName: drug.brand_name || 'Unknown',
              genericName: drug.generic_name || 'Unknown',
              dosageForm: drug.dosage_form || 'Unknown',
              strength: drug.active_ingredients?.[0]?.strength || 'Unknown',
              manufacturer: drug.labeler_name || 'Unknown',
              ndc: ndc
            },
            source: 'FDA',
            tried: Array.from(tried)
          };
        }
      }
    } catch (e) { /* ignore */ }
    // Try RxNorm API
    try {
      const rxnormResp = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?idtype=NDC&id=${ndc}`);
      if (rxnormResp.ok) {
        const rxnormData = await rxnormResp.json();
        if (rxnormData.idGroup && rxnormData.idGroup.rxnormId) {
          const rxcui = rxnormData.idGroup.rxnormId[0];
          // Get drug details from RxNorm
          const detailsResp = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allrelated.json`);
          if (detailsResp.ok) {
            const detailsData = await detailsResp.json();
            const concept = detailsData.allRelatedGroup?.conceptGroup?.[0]?.concept?.[0];
            if (concept) {
              return {
                success: true,
                data: {
                  brandName: concept.synonym || 'Unknown',
                  genericName: concept.name || 'Unknown',
                  dosageForm: 'Unknown',
                  strength: 'Unknown',
                  manufacturer: 'Unknown',
                  ndc: ndc
                },
                source: 'RxNorm',
                tried: Array.from(tried)
              };
            }
          }
        }
      }
    } catch (e) { /* ignore */ }
  }
  // Fallback
  return {
    success: false,
    error: 'Drug information not found in FDA or RxNorm databases',
    ndc: ndcCode,
    tried: Array.from(tried)
  };
};

// Lookup drug by UPC barcode
export const lookupDrugByUPC = async (upcCode) => {
  console.log('Looking up drug for UPC:', upcCode);
  
  // Try multiple CORS proxies
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`Trying UPC lookup with proxy: ${proxy}`);
      const response = await fetch(`${proxy}${UPC_DB_URL}?upc=${upcCode}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          
          // Check if it's a medication by looking at category or title
          const title = item.title?.toLowerCase() || '';
          const category = item.category?.toLowerCase() || '';
          
          // Common medication keywords
          const medKeywords = [
            'tablet', 'capsule', 'pill', 'medicine', 'medication', 'drug', 'ibuprofen', 
            'acetaminophen', 'aspirin', 'vitamin', 'supplement', 'tylenol', 'advil',
            'prescription', 'otc', 'over the counter', 'melatonin', 'sleep', 'allergy', 'pain', 'relief'
          ];
          
          const isMedication = medKeywords.some(keyword => 
            title.includes(keyword) || category.includes(keyword)
          );
          
          if (isMedication) {
            return {
              success: true,
              data: {
                brandName: item.title || 'Unknown',
                genericName: 'Unknown',
                dosageForm: 'Unknown',
                strength: 'Unknown',
                manufacturer: item.brand || 'Unknown',
                upc: upcCode
              },
              source: 'UPC Database',
              isMedication: true
            };
          } else {
            return {
              success: true,
              data: {
                brandName: item.title || 'Unknown',
                genericName: 'Unknown',
                dosageForm: 'Unknown',
                strength: 'Unknown',
                manufacturer: item.brand || 'Unknown',
                upc: upcCode
              },
              source: 'UPC Database',
              isMedication: false,
              note: 'Product found but may not be a medication'
            };
          }
        }
      }
    } catch (error) {
      console.error(`Error with proxy ${proxy}:`, error);
      continue; // Try next proxy
    }
  }
  
  // Try alternative UPC lookup (Open Food Facts API)
  try {
    const openFoodResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${upcCode}.json`);
    
    if (openFoodResponse.ok) {
      const data = await openFoodResponse.json();
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        
        return {
          success: true,
          data: {
            brandName: product.product_name || product.brands || 'Unknown',
            genericName: 'Unknown',
            dosageForm: 'Unknown',
            strength: 'Unknown',
            manufacturer: product.brands || 'Unknown',
            upc: upcCode
          },
          source: 'Open Food Facts',
          isMedication: false,
          note: 'Product found in food database'
        };
      }
    }
  } catch (error) {
    console.error('Error with Open Food Facts API:', error);
  }
  
  return {
    success: false,
    error: 'Product not found in UPC databases',
    upc: upcCode
  };
};

// Format drug information for display
export const formatDrugInfo = (drugData) => {
  if (!drugData.success) {
    return `NDC: ${drugData.ndc} - [Drug information not found]`;
  }
  const { brandName, genericName } = drugData.data;

  // Brand: first word
  const brand = brandName.split(' ')[0] || '';

  // Medication: use genericName if available, else try to extract from brandName
  let medication = '';
  if (genericName && genericName !== 'Unknown') {
    medication = genericName;
  } else {
    // Try to extract medication name (second word, or next after brand)
    const words = brandName.split(' ');
    if (words.length > 1) {
      medication = words[1];
    }
  }

  // Dosage: look for "5mg", "10mg", etc.
  const dosageMatch = brandName.match(/\d+mg/i);
  const dosage = dosageMatch ? dosageMatch[0] : '';

  // If any field is missing, try to extract from the rest of the string
  // Try to find a medication name in the title if genericName is missing
  if (!medication) {
    const medWords = ['melatonin', 'acetaminophen', 'ibuprofen', 'aspirin', 'vitamin', 'd3', 'b12', 'zinc', 'magnesium', 'calcium'];
    const titleLower = brandName.toLowerCase();
    for (const medWord of medWords) {
      if (titleLower.includes(medWord)) {
        medication = medWord.charAt(0).toUpperCase() + medWord.slice(1);
        break;
      }
    }
  }

  // If dosage is missing, try to find a number + unit pattern
  let finalDosage = dosage;
  if (!finalDosage) {
    const altDosageMatch = brandName.match(/\d+\s?(mg|mcg|iu|g)/i);
    if (altDosageMatch) {
      finalDosage = altDosageMatch[0].replace(/\s+/, '');
    }
  }

  // Build concise string, only include non-empty fields
  return [brand, medication, finalDosage].filter(Boolean).join(' ');
}; 