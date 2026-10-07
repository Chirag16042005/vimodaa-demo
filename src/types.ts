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

export interface CartItem {
  product: Product;
  selectedTradeForm: string;
  selectedWeightLabel: string;
  weightInKg: number;
  quantity: number;
  unitPrice: number; // in INR
}

export interface OrderItem {
  productId: string;
  productName: string;
  selectedTradeForm: string;
  selectedWeight: string;
  quantity: number;
  pricePerUnit: number;
}

export interface DispatchInfo {
  carrier: string;
  trackingOrBillNumber: string;
  dispatchDate: string;
  estimatedDeliveryDate: string;
  containerOrSealNo?: string;
  dispatchNotes?: string;
}

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
  items: OrderItem[];
  packagingType: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
  currency: 'INR' | 'USD' | 'EUR';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending Verification' | 'Letter of Credit Issued';
  orderStatus: 'Pending' | 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered';
  dispatchInfo?: DispatchInfo;
}

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

export type Currency = 'INR' | 'USD' | 'EUR';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
};

export function formatPrice(priceInINR: number, currency: Currency = 'INR'): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
  const converted = priceInINR * config.rate;
  
  if (currency === 'INR') {
    return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  } else {
    return `${config.symbol}${converted.toFixed(2)}`;
  }
}
