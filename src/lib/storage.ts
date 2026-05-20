import { Quote } from '../types';

const QUOTES_KEY = 'packd_quotes';

export function saveQuoteToHistory(quote: Quote): Quote[] {
  try {
    const existing = getQuoteHistory();
    // Prevent duplicate quote IDs
    if (existing.some(q => q.quoteId === quote.quoteId)) {
      return existing;
    }
    const updated = [quote, ...existing].slice(0, 10); // Keep max 10, newest first
    localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('LocalStorage write error:', error);
    throw new Error('บันทึกไม่ได้ เนื่องจากความจุของเบราว์เซอร์เต็ม กรุณาลบประวัติเก่าก่อน');
  }
}

export function getQuoteHistory(): Quote[] {
  try {
    const stored = localStorage.getItem(QUOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('LocalStorage read error:', error);
    return [];
  }
}

export function deleteQuoteFromHistory(quoteId: string): Quote[] {
  try {
    const existing = getQuoteHistory();
    const updated = existing.filter(q => q.quoteId !== quoteId);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('LocalStorage write error:', error);
    return [];
  }
}

export function clearQuoteHistory(): void {
  try {
    localStorage.removeItem(QUOTES_KEY);
  } catch (error) {
    console.error('LocalStorage clear error:', error);
  }
}
