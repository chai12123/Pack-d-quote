import { Quote } from '../types';

export function generateLineShareUrl(quote: Quote): string {
  const origin = quote.origin || 'ต้นทาง';
  const destination = quote.destination || 'ปลายทาง';
  const vehicleLabel = quote.vehicleLabel;
  const serviceLabel = {
    standard: 'Standard (ทั่วไป 1-3 วัน)',
    express: 'Express (ด่วนพิเศษ)',
    cold_chilled: 'Cold Chilled (แช่เย็น 2-8°C)',
    cold_frozen: 'Cold Frozen (แช่แข็ง -18°C)',
  }[quote.service];

  const tagsList = quote.tags.length > 0 
    ? `\nเงื่อนไขพิเศษ: ${quote.tags.map(t => {
        if (t === 'night') return '🌙 กลางคืน';
        if (t === 'holiday') return '📅 วันหยุด';
        if (t === 'remote') return '🏔️ ห่างไกล';
        if (t === 'multistop') return '📦 หลายจุดส่ง';
        if (t === 'cod') return '💵 COD';
        return t;
      }).join(', ')}` 
    : '';

  const text = `ขอราคาขนส่ง Packd
Quote ID: ${quote.quoteId}
📍 ${origin} ➡️ 🏁 ${destination}
🚛 ฟลีทรถ: ${vehicleLabel} (${quote.distance} กม.)
📦 น้ำหนัก: ${quote.weight.toLocaleString()} กก. | ${serviceLabel}${tagsList}
💰 ราคาประเมิน: ฿${quote.total.toLocaleString()} (รวม VAT)
*ขอยืนยันราคาและต้องการจองรถ*`;

  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}

export function generateEmailUrl(quote: Quote): string {
  const origin = quote.origin || 'ต้นทาง';
  const destination = quote.destination || 'ปลายทาง';
  const vehicleLabel = quote.vehicleLabel;
  const serviceLabel = {
    standard: 'Standard (ทั่วไป 1-3 วัน)',
    express: 'Express (ด่วนพิเศษ)',
    cold_chilled: 'Cold Chilled (แช่เย็น 2-8°C)',
    cold_frozen: 'Cold Frozen (แช่แข็ง -18°C)',
  }[quote.service];

  const subject = `[Packd Quote] ${quote.quoteId} - จาก ${origin} ไปยัง ${destination}`;

  const tagsList = quote.tags.length > 0 
    ? `\nเงื่อนไขพิเศษเพิ่มเติม: ${quote.tags.map(t => {
        if (t === 'night') return 'ส่งช่วงกลางคืน';
        if (t === 'holiday') return 'ส่งวันหยุด';
        if (t === 'remote') return 'พื้นที่ห่างไกล/เกาะ';
        if (t === 'multistop') return 'จอดส่งหลายจุด';
        if (t === 'cod') return 'เก็บเงินปลายทาง';
        return t;
      }).join(', ')}` 
    : '';

  const body = `เรียน ทีมงานฝ่ายขาย Packd,

ขอยืนยันราคาและประสงค์จองรถขนส่งตามรหัสใบเสนอราคานี้:

รหัสอ้างอิง: ${quote.quoteId}
--------------------------------------------------
เส้นทาง: ${origin} ถึง ${destination}
ระยะทาง: ${quote.distance} กม.
น้ำหนักสินค้ารวม: ${quote.weight.toLocaleString()} กก.
ประเภทรถ: ${vehicleLabel}
รูปแบบบริการ: ${serviceLabel}${tagsList}

สรุปรายละเอียดค่าขนส่งประเมินเบื้องต้น:
- ค่าเรียกรถพื้นฐาน: ฿${quote.breakdown.base.toLocaleString()}
- ค่าระยะทางเพิ่มตามจริง: ฿${quote.breakdown.distance.toLocaleString()}
- ค่าน้ำหนักส่วนเกินสะสม: ฿${quote.breakdown.weight.toLocaleString()}
- ค่าตัวคูณประเภทบริการ (x${quote.breakdown.serviceMultiplier.toFixed(2)}): ฿${(quote.subtotal - (quote.breakdown.base + quote.breakdown.distance + quote.breakdown.weight)).toLocaleString()}
- ค่าบริการเงื่อนไขพิเศษเพิ่มเติม: ฿${quote.breakdown.tags.toLocaleString()}
- ค่าชดเชยน้ำมันเชื้อเพลิง (Fuel Surcharge 8%): ฿${quote.breakdown.fuel.toLocaleString()}
- ภาษีมูลค่าเพิ่ม VAT 7%: ฿${quote.breakdown.vat.toLocaleString()}
--------------------------------------------------
ยอดรวมทั้งสิ้น (ราคาสุทธิรวม VAT): ฿${quote.total.toLocaleString()}

*หมายเหตุ: เป็นราคาประเมินเบื้องต้น ±10%*

ผู้ติดต่อ: [โปรดระบุชื่อและเบอร์โทรศัพท์ของท่าน]
วันเวลาที่ต้องการให้เข้ารับสินค้า: [ระบุวันเวลา เช่น 21/05/2026 10:00 น.]

ขอบคุณครับ/ค่ะ`;

  return `mailto:sales@packd.co.th?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
