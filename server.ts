import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed Products Dataset
export interface SustainabilityBadge {
  label: string;
  type: 'farm-to-fork' | 'ethical-sourcing' | 'non-gmo' | 'organic' | 'lab-tested' | 'eco-packaging';
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  pricePerKg: number; // in INR
  varieties: string[];
  tradeForms: string[];
  notes: string;
  hsCode: string;
  minOrderQty: string;
  origin: string;
  image: string;
  isFeatured?: boolean;
  stockStatus: 'In Stock' | 'Low Stock' | 'Available for Bulk Export';
  certifications?: string[];
  sustainabilityBadges?: SustainabilityBadge[];
}

const DEFAULT_SUSTAINABILITY_BADGES: SustainabilityBadge[] = [
  { label: 'Farm-to-Fork', type: 'farm-to-fork', description: 'Direct origin trace from farm harvest to table' },
  { label: 'Ethical Sourcing', type: 'ethical-sourcing', description: '100% Fair trade paid directly to Indian farmers' },
  { label: 'Lab Tested Pure', type: 'lab-tested', description: 'NABL & ISO 22000 lab purity certified' },
];

let productsData: Product[] = [
  {
    id: 'prod-001',
    name: 'Rajapuri & Alleppey Turmeric',
    category: 'Spices & Herbs',
    subCategory: 'Turmeric',
    pricePerKg: 180,
    varieties: ['Rajapuri', 'Alleppey (High Curcumin)', 'Salem', 'Erode', 'Lakadong', 'Organic'],
    tradeForms: ['Whole fingers', 'Ground powder', 'Sliced', 'Extract grade'],
    notes: 'Curcuma longa; Curcumin content 3.5% to 5.5%. Available in food-grade and pharmaceutical extract grades.',
    hsCode: '0910.30.20',
    minOrderQty: '100 kg (Retail) / 1 MT (Export Bulk)',
    origin: 'Maharashtra & Kerala, India',
    image: '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
    certifications: ['Farm-to-Fork Verified', 'APEDA Organic', 'ISO 22000'],
    sustainabilityBadges: [
      { label: 'Farm-to-Fork', type: 'farm-to-fork', description: 'Direct harvest tracing from Kerala & Sangli farms' },
      { label: 'Ethical Sourcing', type: 'ethical-sourcing', description: 'Fair trade farmer partnership guaranteed' },
      { label: 'Non-GMO', type: 'non-gmo', description: '100% natural, heirloom non-GMO turmeric rhizomes' },
    ],
  },
  {
    id: 'prod-002',
    name: 'Byadgi & Teja Red Chilli',
    category: 'Spices & Herbs',
    subCategory: 'Chillies',
    pricePerKg: 240,
    varieties: ['Byadgi (High Color)', 'Teja (Hot S17)', 'Sannam S4', 'Guntur', 'Kashmiri', 'Bhut Jolokia'],
    tradeForms: ['Whole stemless', 'Whole with stem', 'Coarse flakes', 'Fine powder', 'Crushed'],
    notes: 'Byadgi chilli noted for deep red color (100-140 ASTA) and mild pungency. Teja for intense heat.',
    hsCode: '0904.21.10',
    minOrderQty: '50 kg / 500 kg Export',
    origin: 'Karnataka & Andhra Pradesh, India',
    image: '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
    certifications: ['Farm-to-Fork Verified', 'Aflatoxin Tested', 'FSSAI Certified'],
    sustainabilityBadges: [
      { label: 'Farm-to-Fork', type: 'farm-to-fork', description: 'Harvested directly in Byadgi & Guntur spice yards' },
      { label: 'Lab Tested', type: 'lab-tested', description: 'Zero artificial dye or Sudan red contamination' },
      { label: 'Ethical Sourcing', type: 'ethical-sourcing', description: 'Direct farmer cooperative sourcing' },
    ],
  },
  {
    id: 'prod-003',
    name: 'Malabar & Tellicherry Black Pepper',
    category: 'Spices & Herbs',
    subCategory: 'Whole Spices',
    pricePerKg: 620,
    varieties: ['Tellicherry Garbled Extra Bold (TGEB)', 'Tellicherry Double Garbled (TGSEB)', 'Malabar Black'],
    tradeForms: ['Whole berries', 'Coarse crushed', 'Fine ground powder'],
    notes: 'King of Spices. High essential oil content, bold 4.25mm+ size berries from Wayanad and Malabar coast.',
    hsCode: '0904.11.30',
    minOrderQty: '25 kg / 500 kg Export',
    origin: 'Kerala, India',
    image: '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
    certifications: ['Farm-to-Fork Verified', 'Rainforest Alliance Partner', 'ISO 22000'],
    sustainabilityBadges: [
      { label: 'Farm-to-Fork', type: 'farm-to-fork', description: 'Shade-grown in biodiverse Wayanad agro-forests' },
      { label: 'Eco Packaging', type: 'eco-packaging', description: 'Packed in 100% natural jute export bags' },
      { label: 'Ethical Sourcing', type: 'ethical-sourcing', description: 'Supports Western Ghats spice indigenous growers' },
    ],
  },
  {
    id: 'prod-004',
    name: 'Cumin Seeds (Jeera)',
    category: 'Spices & Herbs',
    subCategory: 'Whole Spices',
    pricePerKg: 310,
    varieties: ['Singapore Quality (99% Pure)', 'Europe Quality (99.5% Pure)', 'Organic Cumin'],
    tradeForms: ['Whole seeds', 'Roasted powder', 'Crushed'],
    notes: 'Rich aromatic essential oils (>2.5%). Cleaned and machine sortexed.',
    hsCode: '0909.31.20',
    minOrderQty: '50 kg',
    origin: 'Gujarat & Rajasthan, India',
    image: '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
    isFeatured: false,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-005',
    name: '1121 Steam & Sella Basmati Rice',
    category: 'Cereals & Grains',
    subCategory: 'Rice',
    pricePerKg: 110,
    varieties: ['1121 Steam Basmati', 'Golden Sella', 'Creamy Sella', 'Traditional Raw Basmati'],
    tradeForms: ['Aromatic Raw', 'Milled', 'Parboiled Sella'],
    notes: 'Extra long grain (8.35mm average grain length before cooking). Elongation ratio 2.5x with fragrant aroma.',
    hsCode: '1006.30.20',
    minOrderQty: '500 kg / 1 FCL (24 MT Container)',
    origin: 'Punjab & Haryana, India',
    image: '/src/assets/images/grains_pulses_cereals_1791281653848.jpg',
    isFeatured: true,
    stockStatus: 'Available for Bulk Export',
  },
  {
    id: 'prod-006',
    name: 'Kabuli Chickpeas (Chana)',
    category: 'Pulses & Legumes',
    subCategory: 'Chickpeas',
    pricePerKg: 135,
    varieties: ['42-44 Count / 12mm', '58-60 Count / 9mm', 'Desi Chana (Brown)'],
    tradeForms: ['Whole cleaned', 'Split Chana Dal', 'Besan (Chickpea Flour)'],
    notes: 'Sorted by size, free from infestation, machine cleaned. High protein content.',
    hsCode: '0713.20.00',
    minOrderQty: '100 kg / 1 MT',
    origin: 'Madhya Pradesh & Maharashtra, India',
    image: '/src/assets/images/grains_pulses_cereals_1791281653848.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-007',
    name: 'Toor Dal & Moong Dal',
    category: 'Pulses & Legumes',
    subCategory: 'Lentils & Pulses',
    pricePerKg: 145,
    varieties: ['Toor Dal (Pigeon Pea Oiled/Unoiled)', 'Moong Whole Green', 'Moong Dal Split Yellow'],
    tradeForms: ['Whole grain', 'Split dal', 'Flour'],
    notes: 'First quality unpolished pulses, processed under strict hygienic conditions.',
    hsCode: '0713.40.00',
    minOrderQty: '100 kg',
    origin: 'Maharashtra & Gujarat, India',
    image: '/src/assets/images/grains_pulses_cereals_1791281653848.jpg',
    isFeatured: false,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-008',
    name: 'Natural White & Hulled Sesame Seeds',
    category: 'Oilseeds & Nuts',
    subCategory: 'Sesame',
    pricePerKg: 195,
    varieties: ['Natural White Sesame (99/1/1)', 'Hulled Sesame Auto-Dry (99.95%)', 'Black Sesame'],
    tradeForms: ['Whole seeds', 'Toasted', 'Tahini Grade'],
    notes: 'Purity up to 99.95%. Rich in healthy fats and calcium. Export quality.',
    hsCode: '1207.40.90',
    minOrderQty: '100 kg',
    origin: 'Gujarat, India',
    image: '/src/assets/images/oilseeds_herbs_produce_1791281669213.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-009',
    name: 'Bold & Java Peanuts (Groundnuts)',
    category: 'Oilseeds & Nuts',
    subCategory: 'Groundnuts',
    pricePerKg: 125,
    varieties: ['Bold Peanuts (38/42, 40/50)', 'Java Peanuts (50/60, 80/90)', 'Blanched Kernels'],
    tradeForms: ['Raw in-shell', 'Blanched kernels', 'Roasted salted'],
    notes: 'Aflatoxin tested (<4 ppb compliant for EU/US markets). Crunchy texture.',
    hsCode: '1202.42.20',
    minOrderQty: '500 kg',
    origin: 'Gujarat & Andhra Pradesh, India',
    image: '/src/assets/images/oilseeds_herbs_produce_1791281669213.jpg',
    isFeatured: false,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-010',
    name: 'Button & Oyster Mushrooms',
    category: 'Mushrooms & Fungi',
    subCategory: 'Edible Mushrooms',
    pricePerKg: 350,
    varieties: ['Button Mushroom (Agaricus)', 'Oyster Mushroom', 'Milky Mushroom', 'Paddy Straw'],
    tradeForms: ['Fresh chilled', 'Dried slices', 'Dehydrated powder', 'Canned in brine'],
    notes: 'Farm-fresh cultivation. Dried mushrooms sliced clean with low moisture (<8%).',
    hsCode: '0712.39.00',
    minOrderQty: '10 kg (Dried) / 500 kg (Fresh)',
    origin: 'Maharashtra, India',
    image: '/src/assets/images/oilseeds_herbs_produce_1791281669213.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-011',
    name: 'Dehydrated Garlic & Onion Flakes',
    category: 'Processed & Dehydrated Foods',
    subCategory: 'Dehydrated Vegetables',
    pricePerKg: 280,
    varieties: ['Dehydrated White Onion Flakes', 'Dehydrated Red Onion Powder', 'Dehydrated Garlic Chopped/Minced'],
    tradeForms: ['Flakes', 'Granules', 'Chopped', 'Minced', 'Fine Powder'],
    notes: 'Long shelf life (2 years). Preserves natural aroma and pungent taste without artificial additives.',
    hsCode: '0712.90.20',
    minOrderQty: '50 kg',
    origin: 'Mahuva, Gujarat, India',
    image: '/src/assets/images/oilseeds_herbs_produce_1791281669213.jpg',
    isFeatured: false,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-012',
    name: 'Ashwagandha & Botanical Herbal Roots',
    category: 'Ayurvedic & Herbal',
    subCategory: 'Ayurvedic Botanicals',
    pricePerKg: 420,
    varieties: ['Ashwagandha (Withania somnifera)', 'Wild Turmeric', 'Moringa Leaf Powder', 'Neem Leaves', 'Tulsi'],
    tradeForms: ['Whole roots', 'Cut/Sliced', 'Fine micronized powder', 'Extract grade'],
    notes: 'Withanolides content 2.5% to 5.0%. Lab tested for heavy metals and purity.',
    hsCode: '1211.90.29',
    minOrderQty: '25 kg',
    origin: 'Madhya Pradesh, India',
    image: '/src/assets/images/oilseeds_herbs_produce_1791281669213.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-013',
    name: 'Green Cardamom (Elaichi)',
    category: 'Spices & Herbs',
    subCategory: 'Whole Spices',
    pricePerKg: 2200,
    varieties: ['8mm+ Super Bold', '7.5mm Bold', '7mm Medium Bold'],
    tradeForms: ['Whole green pods', 'Seeds', 'Powder'],
    notes: 'Handpicked from Idukki hills, Kerala. Deep green color and intense aromatic fragrance.',
    hsCode: '0908.31.20',
    minOrderQty: '5 kg / 100 kg Export',
    origin: 'Idukki, Kerala, India',
    image: '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
    isFeatured: true,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-014',
    name: 'Kashmiri Mongra Saffron',
    category: 'Spices & Herbs',
    subCategory: 'Exotic Spices',
    pricePerKg: 180000, // per kg (~180/gram)
    varieties: ['Mongra Grade 1 (All Red Strands)', 'Lacha Saffron'],
    tradeForms: ['Pure Threads', 'Extract Powder'],
    notes: 'Pure Crocus sativus threads from Pampore, Kashmir. Highest safranal and crocin levels.',
    hsCode: '0910.20.10',
    minOrderQty: '50 grams / 1 kg Bulk',
    origin: 'Pampore, Kashmir, India',
    image: '/src/assets/images/spice_turmeric_chilli_1791281639688.jpg',
    isFeatured: true,
    stockStatus: 'Low Stock',
  },
  {
    id: 'prod-015',
    name: 'Natural Bamboo & Phool Brooms',
    category: 'Natural & Rural Products',
    subCategory: 'Rural Crafts',
    pricePerKg: 160,
    varieties: ['Phool Brooms (Ganga Broom)', 'Bali Grass Brooms', 'Bamboo Handicrafts'],
    tradeForms: ['Finished brooms with plastic/bamboo handle', 'Bulk raw grass bundles'],
    notes: 'Durable, eco-friendly natural grass sourced from Assam & North-East India.',
    hsCode: '9603.10.00',
    minOrderQty: '100 pieces',
    origin: 'Assam & Tripura, India',
    image: '/src/assets/images/oilseeds_herbs_produce_1791281669213.jpg',
    isFeatured: false,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod-016',
    name: 'Cattle Feed & De-oiled Rice Bran',
    category: 'Animal Feed & Agri By-products',
    subCategory: 'Agri Feed',
    pricePerKg: 28,
    varieties: ['De-Oiled Rice Bran (DORB)', 'Maize Feed Grits', 'Mustard Oil Cake', 'Soybean Meal'],
    tradeForms: ['Mash', 'Pellets', 'Meal powder'],
    notes: 'High protein content (DORB crude protein 14-16%, Soy meal 46-48%). Ideal for livestock.',
    hsCode: '2306.90.90',
    minOrderQty: '5 MT (Metric Tons)',
    origin: 'Chhattisgarh & Madhya Pradesh, India',
    image: '/src/assets/images/grains_pulses_cereals_1791281653848.jpg',
    isFeatured: false,
    stockStatus: 'In Stock',
  }
];

// Orders Dataset
export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string;
  shippingAddress: string;
  city: string;
  country: string;
  orderType: 'Retail Domestic' | 'B2B Wholesale Export';
  items: {
    productId: string;
    productName: string;
    selectedTradeForm: string;
    selectedWeight: string;
    quantity: number;
    pricePerUnit: number;
  }[];
  packagingType: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
  currency: 'INR' | 'USD' | 'EUR';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending Verification' | 'Letter of Credit Issued';
  orderStatus: 'Pending' | 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered';
  dispatchInfo?: {
    carrier: string;
    trackingOrBillNumber: string;
    dispatchDate: string;
    estimatedDeliveryDate: string;
    containerOrSealNo?: string;
    dispatchNotes?: string;
  };
}

let ordersData: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VMD-2026-8801',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customerName: 'Rajesh Sharma',
    email: 'rajesh.sharma@spicetraders.in',
    phone: '+91 98201 44552',
    companyName: 'Sharma Foods Pvt Ltd',
    shippingAddress: 'GIDC Industrial Estate, Sector 2',
    city: 'Ahmedabad, Gujarat',
    country: 'India',
    orderType: 'Retail Domestic',
    items: [
      {
        productId: 'prod-001',
        productName: 'Rajapuri & Alleppey Turmeric',
        selectedTradeForm: 'Ground powder',
        selectedWeight: '5 kg Bag',
        quantity: 10,
        pricePerUnit: 900,
      },
      {
        productId: 'prod-002',
        productName: 'Byadgi & Teja Red Chilli',
        selectedTradeForm: 'Whole stemless',
        selectedWeight: '1 kg Pouch',
        quantity: 20,
        pricePerUnit: 250,
      }
    ],
    packagingType: 'Vacuum Sealed Food Grade Foil',
    subtotal: 14000,
    tax: 700,
    shippingFee: 350,
    grandTotal: 15050,
    currency: 'INR',
    paymentMethod: 'UPI / Direct Bank Transfer',
    paymentStatus: 'Paid',
    orderStatus: 'Dispatched',
    dispatchInfo: {
      carrier: 'BlueDart Express',
      trackingOrBillNumber: 'BD-883920192',
      dispatchDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      dispatchNotes: 'Dispatched in 2 heavy corrugated boxes. Invoice attached.',
    }
  },
  {
    id: 'ord-1002',
    orderNumber: 'VMD-2026-8802',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    customerName: 'Michael Sterling',
    email: 'm.sterling@globalspices.co.uk',
    phone: '+44 7700 900123',
    companyName: 'Sterling Spice Importers UK',
    shippingAddress: 'Unit 4, Portside Logistics Park',
    city: 'London',
    country: 'United Kingdom',
    orderType: 'B2B Wholesale Export',
    items: [
      {
        productId: 'prod-005',
        productName: '1121 Steam & Sella Basmati Rice',
        selectedTradeForm: 'Parboiled Sella',
        selectedWeight: '25 kg Jute Export Bag',
        quantity: 40, // 1000 kg
        pricePerUnit: 2750,
      },
      {
        productId: 'prod-003',
        productName: 'Malabar & Tellicherry Black Pepper',
        selectedTradeForm: 'Whole berries',
        selectedWeight: '25 kg Jute Export Bag',
        quantity: 10, // 250 kg
        pricePerUnit: 15500,
      }
    ],
    packagingType: 'Heavy Export Jute Bags on Fumigated Wooden Pallets',
    subtotal: 265000,
    tax: 0,
    shippingFee: 18500,
    grandTotal: 283500,
    currency: 'INR',
    paymentMethod: 'Irrevocable Letter of Credit (L/C)',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
  }
];

// B2B Quote Inquiries Dataset
export interface B2BInquiry {
  id: string;
  createdAt: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  productName: string;
  tradeFormRequired: string;
  targetQuantity: string;
  destinationPort: string;
  notes: string;
  status: 'New' | 'Under Review' | 'Quote Sent' | 'Closed';
}

let b2bInquiriesData: B2BInquiry[] = [
  {
    id: 'inq-501',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    companyName: 'Al-Madina Spice Trading FZE',
    contactPerson: 'Tariq Al-Mansoor',
    email: 'tariq@almadinaspices.ae',
    phone: '+971 50 123 4567',
    country: 'United Arab Emirates',
    productName: 'Rajapuri & Alleppey Turmeric',
    tradeFormRequired: 'Whole fingers (Polished)',
    targetQuantity: '20 Metric Tons (1 x 20ft FCL)',
    destinationPort: 'Jebel Ali Port, Dubai',
    notes: 'Require Phytosanitary Certificate, Fumigation, and Certificate of Origin. Target shipment within 15 days.',
    status: 'Quote Sent',
  },
  {
    id: 'inq-502',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    companyName: 'BioHerb Extracts LLC',
    contactPerson: 'Sarah Jenkins',
    email: 'sjenkins@bioherb.us',
    phone: '+1 415 555 0198',
    country: 'United States',
    productName: 'Ashwagandha & Botanical Herbal Roots',
    tradeFormRequired: 'Micronized Powder (80 mesh)',
    targetQuantity: '2 Metric Tons',
    destinationPort: 'Port of Los Angeles, USA',
    notes: 'Needs COA with HPLC test report for minimum 3.5% Withanolides. Sample required first via DHL.',
    status: 'New',
  }
];

// API Routes

// 1. GET Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, featured } = req.query;
  let filtered = [...productsData];

  if (category && category !== 'All') {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (featured === 'true') {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.varieties.some((v) => v.toLowerCase().includes(q)) ||
        p.tradeForms.some((tf) => tf.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, products: filtered });
});

// 2. Admin Add/Update/Delete Product
app.post('/api/products', (req: Request, res: Response) => {
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    ...req.body,
  };
  productsData.unshift(newProd);
  res.json({ success: true, product: newProd });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = productsData.findIndex((p) => p.id === id);
  if (index !== -1) {
    productsData[index] = { ...productsData[index], ...req.body };
    res.json({ success: true, product: productsData[index] });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  productsData = productsData.filter((p) => p.id !== id);
  res.json({ success: true, message: 'Product deleted' });
});

// 3. GET & POST Orders
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ success: true, orders: ordersData });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrderNumber = `VMD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const order: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: newOrderNumber,
    createdAt: new Date().toISOString(),
    orderStatus: 'Pending',
    paymentStatus: req.body.paymentMethod.includes('Letter')
      ? 'Letter of Credit Issued'
      : 'Paid',
    ...req.body,
  };

  ordersData.unshift(order);
  res.json({ success: true, order });
});

// 4. Admin Dispatch Order
app.patch('/api/orders/:id/dispatch', (req: Request, res: Response) => {
  const { id } = req.params;
  const { carrier, trackingOrBillNumber, estimatedDeliveryDate, containerOrSealNo, dispatchNotes } = req.body;

  const order = ordersData.find((o) => o.id === id);
  if (order) {
    order.orderStatus = 'Dispatched';
    order.dispatchInfo = {
      carrier: carrier || 'AgroGlobal Shipping Line',
      trackingOrBillNumber: trackingOrBillNumber || `TRACK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      dispatchDate: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: estimatedDeliveryDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      containerOrSealNo,
      dispatchNotes,
    };
    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// --- SERVER-SIDE GEMINI API INTEGRATION ---

// AI Product Description & Trade Spec Generator for Admin
app.post('/api/ai/describe-product', async (req: Request, res: Response) => {
  try {
    const { name, category, varieties, tradeForms } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an expert agricultural export analyst at VIMODAA AGRO LLP. Write a concise, highly appealing technical product description and trade notes for international buyers for:
Product Name: ${name}
Category: ${category}
Varieties: ${Array.isArray(varieties) ? varieties.join(', ') : varieties}
Trade Forms: ${Array.isArray(tradeForms) ? tradeForms.join(', ') : tradeForms}

Include:
1. Product profile & culinary/industrial applications.
2. Export grade specifications (moisture, purity, essential oil/curcumin/protein value).
3. Recommended packaging & shelf life. Keep it under 150 words in professional title case prose.`,
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Gemini describe-product error:', error);
    res.status(500).json({ success: false, error: error.message || 'Gemini API failed' });
  }
});

// AI Botanical & Usage Insights for Product Detail
app.post('/api/ai/botanical-insights', async (req: Request, res: Response) => {
  try {
    const { productName, category, variety } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide rich botanical & culinary usage insights for Vimodaa Agro product: "${productName}" (${category}${variety ? `, Variety: ${variety}` : ''}).
Return concise structured insights covering:
- Botanical / Scientific background & Active compounds
- Traditional Culinary Uses & Pairing suggestions
- Storage best practices & Quality preservation tip`,
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Gemini botanical-insights error:', error);
    res.status(500).json({ success: false, error: error.message || 'Gemini API failed' });
  }
});

// AI Agro Export & Sourcing Assistant Chat
app.post('/api/ai/export-assistant', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    const formattedHistory = Array.isArray(history)
      ? history.map((item: { role: string; content: string }) => `${item.role === 'user' ? 'Buyer' : 'Vimodaa Agro AI Expert'}: ${item.content}`).join('\n')
      : '';

    const prompt = `You are Vimodaa Agro LLP's Senior Global Export & Botanical Consultant.
You assist international spice importers, food processors, wholesalers, and retail buyers with product specifications, bulk trade container sizing, export packaging, HS codes, and phytosanitary rules for Vimodaa Agro products (Spices, Grains, Pulses, Oilseeds, Mushrooms, Dehydrated Foods, Ayurvedic Botanicals).

Company Contact: Ms. Yogita C. Thakur (Managing Partner), Phone: +91 77188 12732, Email: info@vimodaaagro.com. Address: Plot No. 2, Sector 9, Khanda Colony, New Panvel (W), Maharashtra - 410206, India.

Conversation history:
${formattedHistory}

Buyer question: ${message}

Provide a knowledgeable, warm, professional response (max 180 words).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Gemini export-assistant error:', error);
    res.status(500).json({ success: false, error: error.message || 'Gemini API failed' });
  }
});

// Production static or Vite dev middleware
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Vimodaa Agro Server running at http://localhost:${PORT}`);
  });
}

setupServer();
