export const DISTANCE_LOOKUP: Record<string, number> = {
  "กรุงเทพ-ชลบุรี": 82,
  "กรุงเทพ-ระยอง": 179,
  "กรุงเทพ-นครราชสีมา": 260,
  "กรุงเทพ-ขอนแก่น": 449,
  "กรุงเทพ-เชียงใหม่": 696,
  "กรุงเทพ-อุบลราชธานี": 615,
  "กรุงเทพ-หาดใหญ่": 945,
  "กรุงเทพ-ภูเก็ต": 845,
  "กรุงเทพ-อุดรธานี": 564,
  "กรุงเทพ-พิษณุโลก": 377,
  "กรุงเทพ-นครสวรรค์": 240,
  "กรุงเทพ-สุราษฎร์ธานี": 644,
  "กรุงเทพ-เชียงราย": 825,
  "กรุงเทพ-ลำปาง": 599,
  "กรุงเทพ-นครศรีธรรมราช": 780,
  "กรุงเทพ-อยุธยา": 76,
  "กรุงเทพ-สมุทรสาคร": 36,
  "กรุงเทพ-นครปฐม": 56,
  "กรุงเทพ-ราชบุรี": 100,
  "กรุงเทพ-เพชรบุรี": 123,
  "กรุงเทพ-ประจวบคีรีขันธ์": 281,
  "กรุงเทพ-ฉะเชิงเทรา": 81,
  "กรุงเทพ-ปราจีนบุรี": 132,
  "กรุงเทพ-สระแก้ว": 198,
  "กรุงเทพ-จันทบุรี": 245,
  "กรุงเทพ-ตราด": 315,
  "กรุงเทพ-กาญจนบุรี": 130,
  "กรุงเทพ-สุพรรณบุรี": 107,
  "กรุงเทพ-สระบุรี": 109,
  "กรุงเทพ-ลพบุรี": 153
};

export const POPULAR_CITIES = [
  "กรุงเทพ",
  "ชลบุรี",
  "สมุทรปราการ",
  "นครราชสีมา",
  "ขอนแก่น",
  "เชียงใหม่"
];

/**
 * Find distance from the lookup table, allowing both dynamic direction styles.
 */
export function getLookupDistance(origin: string, destination: string): number | null {
  if (!origin || !destination) return null;
  
  const cleanOr = origin.trim();
  const cleanDest = destination.trim();
  
  const key1 = `${cleanOr}-${cleanDest}`;
  const key2 = `${cleanDest}-${cleanOr}`;
  
  if (DISTANCE_LOOKUP[key1] !== undefined) {
    return DISTANCE_LOOKUP[key1];
  }
  if (DISTANCE_LOOKUP[key2] !== undefined) {
    return DISTANCE_LOOKUP[key2];
  }
  
  return null;
}
