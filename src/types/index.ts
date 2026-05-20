export type ServiceType = 'standard' | 'express' | 'cold_chilled' | 'cold_frozen';

export interface PricingBreakdown {
  base: number;
  distance: number;
  weight: number;
  serviceMultiplier: number;
  tags: number;
  fuel: number;
  vat: number;
}

export interface Quote {
  quoteId: string;
  vehicle: 'pickup' | 'van' | 'van_cold' | 'truck6';
  vehicleLabel: string;
  breakdown: PricingBreakdown;
  subtotal: number;
  preVat: number;
  total: number;
  distance: number;
  weight: number;
  service: ServiceType;
  tags: string[];
  origin?: string;
  destination?: string;
  createdAt: string;
}

export type ChatMessageRole = 'user' | 'model' | 'system' | 'function';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  quote?: Quote; // If this message generated/is linked to a quote
}
