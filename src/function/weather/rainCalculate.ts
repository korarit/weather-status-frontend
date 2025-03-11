const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
};

type ColorDbzMap = { hex: string; dBZ: number };

// ตารางสี dBZ (นำเข้าจาก CSV)
const colorDbzList: ColorDbzMap[] = [
    { hex: "#00000000", dBZ: -32 },
    { hex: "#00000000", dBZ: -31 },
    { hex: "#00000000", dBZ: -30 },
    { hex: "#00000000", dBZ: -29 },
    { hex: "#00000000", dBZ: -28 },
    { hex: "#00000000", dBZ: -27 },
    { hex: "#00000000", dBZ: -26 },
    { hex: "#00000000", dBZ: -25 },
    { hex: "#00000000", dBZ: -24 },
    { hex: "#00000000", dBZ: -23 },
    { hex: "#00000000", dBZ: -22 },
    { hex: "#00000000", dBZ: -21 },
    { hex: "#00000000", dBZ: -20 },
    { hex: "#00000000", dBZ: -19 },
    { hex: "#00000000", dBZ: -18 },
    { hex: "#00000000", dBZ: -17 },
    { hex: "#00000000", dBZ: -16 },
    { hex: "#00000000", dBZ: -15 },
    { hex: "#00000000", dBZ: -14 },
    { hex: "#00000000", dBZ: -13 },
    { hex: "#00000000", dBZ: -12 },
    { hex: "#00000000", dBZ: -11 },
    { hex: "#00000000", dBZ: -10 },
    { hex: "#00000000", dBZ: -9 },
    { hex: "#00000000", dBZ: -8 },
    { hex: "#00000000", dBZ: -7 },
    { hex: "#00000000", dBZ: -6 },
    { hex: "#00000000", dBZ: -5 },
    { hex: "#00000000", dBZ: -4 },
    { hex: "#00000000", dBZ: -3 },
    { hex: "#00000000", dBZ: -2 },
    { hex: "#00000000", dBZ: -1 },
    { hex: "#00000000", dBZ: 0 },
    { hex: "#00000000", dBZ: 1 },
    { hex: "#00000000", dBZ: 2 },
    { hex: "#00000000", dBZ: 3 },
    { hex: "#00000000", dBZ: 4 },
    { hex: "#00000000", dBZ: 5 },
    { hex: "#00000000", dBZ: 6 },
    { hex: "#00000000", dBZ: 7 },
    { hex: "#00000000", dBZ: 8 },
    { hex: "#00000000", dBZ: 9 },
    { hex: "#01b714ff", dBZ: 10 },
    { hex: "#01b614ff", dBZ: 11 },
    { hex: "#01b414ff", dBZ: 12 },
    { hex: "#02ad14ff", dBZ: 13 },
    { hex: "#049f14ff", dBZ: 14 },
    { hex: "#088915ff", dBZ: 15 },
    { hex: "#088815ff", dBZ: 16 },
    { hex: "#088615ff", dBZ: 17 },
    { hex: "#098116ff", dBZ: 18 },
    { hex: "#0c7617ff", dBZ: 19 },
    { hex: "#11651aff", dBZ: 20 },
    { hex: "#106419ff", dBZ: 21 },
    { hex: "#106218ff", dBZ: 22 },
    { hex: "#0e5d15ff", dBZ: 23 },
    { hex: "#0b5310ff", dBZ: 24 },
    { hex: "#064307ff", dBZ: 25 },
    { hex: "#074407ff", dBZ: 26 },
    { hex: "#154d07ff", dBZ: 27 },
    { hex: "#3b6707ff", dBZ: 28 },
    { hex: "#859a07ff", dBZ: 29 },
    { hex: "#ffee07ff", dBZ: 30 },
    { hex: "#feed07ff", dBZ: 31 },
    { hex: "#feea07ff", dBZ: 32 },
    { hex: "#fde207ff", dBZ: 33 },
    { hex: "#fbd307ff", dBZ: 34 },
    { hex: "#f8bb08ff", dBZ: 35 },
    { hex: "#f7ba08ff", dBZ: 36 },
    { hex: "#f7b708ff", dBZ: 37 },
    { hex: "#f6b008ff", dBZ: 38 },
    { hex: "#f5a208ff", dBZ: 39 },
    { hex: "#f38b08ff", dBZ: 40 },
    { hex: "#f28a08ff", dBZ: 41 },
    { hex: "#f28908ff", dBZ: 42 },
    { hex: "#f28508ff", dBZ: 43 },
    { hex: "#f17d08ff", dBZ: 44 },
    { hex: "#f07108ff", dBZ: 45 },
    { hex: "#ef7008ff", dBZ: 46 },
    { hex: "#ef6f08ff", dBZ: 47 },
    { hex: "#ee6c08ff", dBZ: 48 },
    { hex: "#ec6708ff", dBZ: 49 },
    { hex: "#ea5e09ff", dBZ: 50 },
    { hex: "#e95d09ff", dBZ: 51 },
    { hex: "#e95b09ff", dBZ: 52 },
    { hex: "#e75509ff", dBZ: 53 },
    { hex: "#e44a09ff", dBZ: 54 },
    { hex: "#df370aff", dBZ: 55 },
    { hex: "#de360aff", dBZ: 56 },
    { hex: "#de340aff", dBZ: 57 },
    { hex: "#dc2e0aff", dBZ: 58 },
    { hex: "#d8230bff", dBZ: 59 },
    { hex: "#d3100cff", dBZ: 60 },
    { hex: "#d20f0bff", dBZ: 61 },
    { hex: "#d10f0bff", dBZ: 62 },
    { hex: "#ce0f0bff", dBZ: 63 },
    { hex: "#c90e0aff", dBZ: 64 },
    { hex: "#c00d09ff", dBZ: 65 },
    { hex: "#bf0c08ff", dBZ: 66 },
    { hex: "#bf0c08ff", dBZ: 67 },
    { hex: "#be0c08ff", dBZ: 68 },
    { hex: "#bb0c08ff", dBZ: 69 },
    { hex: "#b80c08ff", dBZ: 70 },
    { hex: "#b80c08ff", dBZ: 71 },
    { hex: "#b80c08ff", dBZ: 72 },
    { hex: "#b80c08ff", dBZ: 73 },
    { hex: "#b80c08ff", dBZ: 74 },
    { hex: "#b80c08ff", dBZ: 75 },
    { hex: "#b80c08ff", dBZ: 76 },
    { hex: "#b80c08ff", dBZ: 77 },
    { hex: "#b80c08ff", dBZ: 78 },
    { hex: "#b80c08ff", dBZ: 79 },
    { hex: "#b80c08ff", dBZ: 80 },
    { hex: "#b80c08ff", dBZ: 81 },
    { hex: "#b80c08ff", dBZ: 82 },
    { hex: "#b80c08ff", dBZ: 83 },
    { hex: "#b80c08ff", dBZ: 84 },
    { hex: "#b80c08ff", dBZ: 85 },
    { hex: "#b80c08ff", dBZ: 86 },
    { hex: "#b80c08ff", dBZ: 87 },
    { hex: "#b80c08ff", dBZ: 88 },
    { hex: "#b80c08ff", dBZ: 89 },
    { hex: "#b80c08ff", dBZ: 90 },
    { hex: "#b80c08ff", dBZ: 91 },
    { hex: "#b80c08ff", dBZ: 92 },
    { hex: "#b80c08ff", dBZ: 93 },
    { hex: "#b80c08ff", dBZ: 94 },
    { hex: "#b80c08ff", dBZ: 95 }
];

// ฟังก์ชันแปลง HEX → RGB
const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
};

// คำนวณ Luminance เพื่อเทียบความเข้มของสี
const getLuminance = (r: number, g: number, b: number): number => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// คำนวณระยะห่างระหว่างสองสี (Euclidean Distance)
const colorDistance = (rgb1: [number, number, number], rgb2: [number, number, number]): number => {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
};

// ค้นหาสีที่ใกล้ที่สุด 3 อันดับแรก
const findTopClosestColors = (rgb: [number, number, number], topN = 3): ColorDbzMap[] => {
  return [...colorDbzList]
    .map(color => ({
      ...color,
      distance: colorDistance(rgb, hexToRgb(color.hex))
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, topN);
};

// ค้นหา dBZ โดยใช้สีที่ใกล้ที่สุดและปรับค่าความเข้ม
const findNearestDbz = (hexColor: string): number => {
  const rgb = hexToRgb(hexColor);
  const luminance = getLuminance(...rgb);

  // หาสีที่ใกล้ที่สุด 3 อันดับแรก
  const closestColors = findTopClosestColors(rgb);

  // ตรวจสอบการ "ข้าม" dBZ
  const sortedDbz = closestColors.map(c => c.dBZ).sort((a, b) => a - b);
  const minDbz = sortedDbz[0];
  const maxDbz = sortedDbz[sortedDbz.length - 1];
  
  if (maxDbz - minDbz > 5) {
    // ถ้า dBZ มีการข้ามมาก ให้ใช้ค่าเฉลี่ยของใกล้ที่สุด 2 อันดับแรก
    return Math.round((closestColors[0].dBZ + closestColors[1].dBZ) / 2);
  }

  // ปรับค่า dBZ ตามระดับความเข้ม (Linear Interpolation)
  const closestColor = closestColors[0];
  const closestRgb = hexToRgb(closestColor.hex);
  const closestLuminance = getLuminance(...closestRgb);

  const dbzDiff = closestColor.dBZ - (-32);
  const intensityFactor = luminance / closestLuminance;
  const estimatedDbz = -32 + dbzDiff * intensityFactor;

  return Math.round(estimatedDbz);
};

/**
 * แปลงค่าความสะท้อนเรดาร์ (dBZ) เป็นอัตราปริมาณฝน (มม./ชม.)
 * @param dBZ - ค่าความสะท้อนเรดาร์ (เดซิเบล)
 * @param a - ค่าคงที่ a ในสมการ Z-R
 * @param b - ค่าคงที่ b ในสมการ Z-R
 * @returns อัตราปริมาณฝน (มม./ชม.)
 */
function dBZToRainRate(dBZ: number, a: number = 200, b: number = 1.6): number {
    // แปลง dBZ เป็นค่าเชิงเส้น (Z)
    console.log("dBZ", dBZ);
    const linearZ: number = Math.pow(10, dBZ / 10);
  
    // คำนวณอัตราการตกของฝน (R)
    const rainRate: number = Math.pow(linearZ / a, 1 / b);
  
    return rainRate;
  }
  

export { rgbToHex, hexToRgb, getLuminance, colorDistance, findNearestDbz, dBZToRainRate };