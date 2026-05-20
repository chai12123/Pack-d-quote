import React from 'react';
import { Quote } from '../types';

interface PrintLayoutProps {
  quote: Quote | null;
}

export default function PrintLayout({ quote }: PrintLayoutProps): React.ReactElement | null {
  if (!quote) return null;

  const serviceLabels = {
    standard: 'มาตรฐาน (Standard Road Freight)',
    express: 'ด่วนพิเศษ (Express Next-Day / Same-Day)',
    cold_chilled: 'ควบคุมอุณหภูมิแช่เย็น (Chilled Chilled Logistics 2-8°C)',
    cold_frozen: 'ควบคุมอุณหภูมิแช่แข็ง (Cold Frozen Logistics -18°C)',
  };

  const tagLabel = (tag: string) => {
    switch (tag) {
      case 'night': return 'จัดส่งกลางคืน (+20%)';
      case 'holiday': return 'จัดส่งวันหยุดเสาร์-อาทิตย์ (+15%)';
      case 'remote': return 'จัดส่งพื้นที่ห่างไกล (+฿500)';
      case 'multistop': return 'จุดจอดรับส่งสินค้าหลายจุด (+฿300)';
      case 'cod': return 'บริการเก็บเงินปลายทาง (+฿100)';
      default: return tag;
    }
  };

  // Base + Distance + Weight combined
  const basicItemsSubtotal = quote.breakdown.base + quote.breakdown.distance + quote.breakdown.weight;
  // Multiplier sum
  const serviceMultiplierAddon = Math.round(basicItemsSubtotal * (quote.breakdown.serviceMultiplier - 1));

  return (
    <div className="print-only print-container bg-white text-black p-8 font-sans max-w-4xl mx-auto border-0">
      {/* Print corporate Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F2942]">บริษัท แพ็คดี จำกัด</h1>
          <p className="text-xs font-semibold text-gray-700">ผู้ให้บริการขนส่งสินค้าระดับอุตสาหกรรม B2B ครบวงจร</p>
          <p className="text-[10px] text-gray-500 mt-1 max-w-sm">
            สำนักงานใหญ่ เลขที่อุตสาหกรรมพัฒนา ถนนสุขุมวิท กรุงเทพมหานคร 10110<br />
            โทรศัพท์: 081-234-5678 | LINE ID: @packdlogistics | อีเมล: sales@packd.co.th
          </p>
        </div>
        <div className="text-right">
          <div className="border border-black p-2 rounded text-center min-w-[180px] bg-gray-50">
            <h2 className="text-xs font-bold uppercase tracking-wider">ใบเสนอราคาประเมิน (AI)</h2>
            <p className="text-sm font-mono font-bold mt-0.5">{quote.quoteId}</p>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 font-medium">
            วันที่จัดพิมพ์เอกสาร: {new Date().toLocaleDateString('th-TH')} {new Date().toLocaleTimeString('th-TH')}
          </p>
        </div>
      </div>

      {/* Quote summary table */}
      <h3 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3">1. สรุปเงื่อนไขและพารามิเตอร์การขนส่ง (Logistics Parameters)</h3>
      <table className="w-full text-xs text-left border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100 font-bold border-b border-gray-300">
            <th className="p-2 border-r border-gray-300 w-1/3">ข้อมูลพารามิเตอร์</th>
            <th className="p-2">รายละเอียดการขนส่ง</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">เส้นทางการเดินรถ (Route)</td>
            <td className="p-2">{quote.origin || 'ไม่ได้ระบุต้นทางในระบบ'} ➔ {quote.destination || 'ไม่ได้ระบุปลายทางในระบบ'}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">ระยะทางโดยประมาณ (Estimated Distance)</td>
            <td className="p-2">{quote.distance} กิโลเมตร (กม.)</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">น้ำหนักสินค้าประเมิน (Cargo Weight)</td>
            <td className="p-2">{quote.weight.toLocaleString()} กิโลกรัม (กก.)</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">พาหนะที่จัดสรร (Fleet Allotment)</td>
            <td className="p-2 font-bold">{quote.vehicleLabel}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">รูปแบบการจัดส่ง (Service Category)</td>
            <td className="p-2">{serviceLabels[quote.service]}</td>
          </tr>
          {quote.tags.length > 0 && (
            <tr className="border-b border-gray-300">
              <td className="p-2 border-r border-gray-300 font-bold">เงื่อนไขรหัสพิเศษ (Special Conditions)</td>
              <td className="p-2">{quote.tags.map(tagLabel).join(', ')}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Quote prices breakdown itemized table */}
      <h3 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3">2. ตารางแจกแจงค่าขนส่งประเมิน (Itemized Pricing Estimates)</h3>
      <table className="w-full text-xs border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100 font-bold border-b border-gray-300 text-left">
            <th className="p-2 border-r border-gray-300 w-12 text-center">ลำดับ</th>
            <th className="p-2 border-r border-gray-300">รายการค่าบริการขนส่ง</th>
            <th className="p-2 text-right w-36">จำนวนเงิน (บาท)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="p-2 border-r border-gray-300 text-center">1</td>
            <td className="p-2 border-r border-gray-300">ค่าเรียกรถเปล่ารับสินค้ารถ {quote.vehicleLabel} (ฐานพื้นฐาน)</td>
            <td className="p-2 text-right font-mono">฿{quote.breakdown.base.toLocaleString()}.00</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-2 border-r border-gray-300 text-center">2</td>
            <td className="p-2 border-r border-gray-300">ค่าชดเชยระยะทางเพิ่มสะสม ({quote.distance} กม.)</td>
            <td className="p-2 text-right font-mono">฿{quote.breakdown.distance.toLocaleString()}.00</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-2 border-r border-gray-300 text-center">3</td>
            <td className="p-2 border-r border-gray-300">ค่าบริการส่วนเกินพิกัดน้ำหนัก ({quote.weight} กก.)</td>
            <td className="p-2 text-right font-mono">฿{quote.breakdown.weight.toLocaleString()}.00</td>
          </tr>
          {quote.breakdown.serviceMultiplier > 1 && (
            <tr className="border-b border-gray-200">
              <td className="p-2 border-r border-gray-300 text-center">4</td>
              <td className="p-2 border-r border-gray-300">ส่วนเพิ่มสำหรับรูปแบบการขนส่งด่วน/แช่ควบคุมอุณหภูมิ (บริการด่วน)</td>
              <td className="p-2 text-right font-mono">฿{serviceMultiplierAddon.toLocaleString()}.00</td>
            </tr>
          )}
          {quote.breakdown.tags > 0 && (
            <tr className="border-b border-gray-200">
              <td className="p-2 border-r border-gray-300 text-center">{quote.breakdown.serviceMultiplier > 1 ? '5' : '4'}</td>
              <td className="p-2 border-r border-gray-300">ส่วนต่างค่าบริการตามสัญญารอบงานพิเศษ (Night/Remote/Cod/Stop)</td>
              <td className="p-2 text-right font-mono">฿{quote.breakdown.tags.toLocaleString()}.00</td>
            </tr>
          )}
          <tr className="border-b border-gray-200">
            <td className="p-2 border-r border-gray-300 text-center"></td>
            <td className="p-2 border-r border-gray-300 text-right font-bold bg-gray-50/50">รวมราคาขั้นต้นก่อนปรับเชื้อเพลิงและภาษี (Subtotal)</td>
            <td className="p-2 text-right font-mono font-semibold bg-gray-50/50">฿{(quote.subtotal + quote.breakdown.tags).toLocaleString()}.00</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-2 border-r border-gray-300 text-center"></td>
            <td className="p-2 border-r border-gray-300 text-right">ค่าชดเชยผันแปรราคาน้ำมัน (Fuel Surcharge 8%)</td>
            <td className="p-2 text-right font-mono">฿{quote.breakdown.fuel.toLocaleString()}.00</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-2 border-r border-gray-300 text-center"></td>
            <td className="p-2 border-r border-gray-300 text-right">ภาษีมูลค่าเพิ่มคิดที่อัตรา 7% (VAT 7%)</td>
            <td className="p-2 text-right font-mono">฿{quote.breakdown.vat.toLocaleString()}.00</td>
          </tr>
          <tr className="border-b-2 border-black">
            <td className="p-2 border-r border-gray-300 text-center"></td>
            <td className="p-2 border-r border-gray-300 text-right font-bold bg-gray-100">รวมยอดสุทธิเสนอปู่รวมภาษีมูลค่าเพิ่ม (Grand Total)</td>
            <td className="p-2 text-right font-mono font-bold bg-gray-100 text-sm">฿{quote.total.toLocaleString()}.00</td>
          </tr>
        </tbody>
      </table>

      {/* Disclaimers terms and explanations */}
      <div className="p-3 bg-gray-50 border border-gray-300 rounded mb-8 text-[10px] leading-relaxed text-gray-700">
        <h4 className="font-bold border-b border-gray-200 pb-0.5 mb-1 text-black">เงื่อนไขข้อจำกัดความรับผิดชอบเพิ่มเติม (Terms & Legal Disclaimer)</h4>
        <p>
          1. ยอดสรุปข้างต้นเป็นราคาประเมินเบื้องต้นด้วยระบบ AI (Accuracy Range: ±10%) อ้างอิงตามฐานระยะทางจริงและเงื่อนไขพารามิเตอร์ที่นำเข้าสู่ระบบเท่านั้น<br />
          2. ราคาเสนอนี้ไม่ใช่ใบจองรถจริงและย่อมเปลี่ยนแปลงได้หากพิกัดสถานที่ น้ำหนัก คุณภาพ หรือปริมาตรสินค้าเปลี่ยนแตกต่างจากข้อมูลตั้งต้น<br />
          3. การยืนยันเที่ยววิ่งและการจองฟลีทรถขนส่งของบริษัท แพ็คดี จำกัด จะเสร็จสมบูรณ์เมื่อฝ่ายขาย (Sales) ได้ทำการลงนามอนุมัติใบเสนอราคาฉบับจริงแล้วเท่านั้น<br />
          4. แบรนด์ และผู้จัดทำขอสงวนสิทธิ์ไม่จัดส่งวัสดุประเภทวัตถุระเบิด สารพิษ หรือเคมีภัณฑ์อุตสาหกรรมอันตรายร้ายแรงที่ขัดต่อนโยบายบริษัท
        </p>
      </div>

      {/* Corporate signature sheets */}
      <div className="grid grid-cols-2 gap-8 text-center text-xs mt-12">
        <div className="space-y-12">
          <p className="font-bold">จัดทำโดย (Prepared By)</p>
          <div className="space-y-1">
            <div className="border-b border-black w-48 mx-auto pb-1 font-semibold text-gray-600">ระบบประเมินราคาอัจฉริยะ (Packd Smart AI)</div>
            <p className="text-[10px] text-gray-500">ฝ่ายประมวลผลคำนวณอัตโนมัติ Packd Co., Ltd.</p>
          </div>
        </div>
        <div className="space-y-12">
          <p className="font-bold">อนุมัติยืนยันโดยฝ่ายขาย (Approved By Sales)</p>
          <div className="space-y-1">
            <div className="border-b border-black w-48 mx-auto h-5" />
            <p className="font-semibold text-gray-700">( ........................................................................ )</p>
            <p className="text-[10px] text-gray-500">ตัวแทนสำนักงาน ฝ่ายการพณิชย์และโลจิสติกส์ Packd</p>
          </div>
        </div>
      </div>
    </div>
  );
}
