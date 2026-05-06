/* ==========================================================================
   六十四卦完整数据（去重补全版）
   ========================================================================== */

// 卦象数据接口
export interface HexagramData {
  id: number;
  name: string;
  symbol: string;        // 八卦符号组合，如 "☰☰"
  binarySymbol: string;  // 六位二进制字符串，1 为阳爻，0 为阴爻
  upper: string;         // 上卦
  lower: string;         // 下卦
  palace: string;        // 所属八宫
  description: string;
}

// 八卦基础数据接口
export interface TrigramData {
  name: string;
  symbol: string; // 八卦符号
  nature: string; // 自然属性
  element: string; // 五行属性
  lines: number[]; // 爻线数组，1 为阳爻，0 为阴爻
}

// 八卦数据（字符串键格式，用于二进制查找）
const trigramsByBinary: Record<string, TrigramData> = {
  '111': { name: '乾', symbol: '☰', nature: '天', element: '金', lines: [1, 1, 1] },
  '110': { name: '兑', symbol: '☱', nature: '泽', element: '金', lines: [1, 1, 0] },
  '101': { name: '离', symbol: '☲', nature: '火', element: '火', lines: [1, 0, 1] },
  '001': { name: '震', symbol: '☳', nature: '雷', element: '木', lines: [0, 0, 1] },
  '011': { name: '巽', symbol: '☴', nature: '风', element: '木', lines: [0, 1, 1] },
  '010': { name: '坎', symbol: '☵', nature: '水', element: '水', lines: [0, 1, 0] },
  '100': { name: '艮', symbol: '☶', nature: '山', element: '土', lines: [1, 0, 0] },
  '000': { name: '坤', symbol: '☷', nature: '地', element: '土', lines: [0, 0, 0] },
};

// 八卦数据（数字键格式，用于索引查找）
export const trigramsByIndex: Record<number, TrigramData> = {
  1: trigramsByBinary['111'], // 乾
  2: trigramsByBinary['110'], // 兑
  3: trigramsByBinary['101'], // 离
  4: trigramsByBinary['001'], // 震
  5: trigramsByBinary['011'], // 巽
  6: trigramsByBinary['010'], // 坎
  7: trigramsByBinary['100'], // 艮
  8: trigramsByBinary['000'], // 坤
};

// 六十四卦完整数据（按传统八宫卦序排列）
const rawHexagramsData = [
  /* 乾宫 */
  { id: 1, name: '乾为天', symbol: '☰☰', binarySymbol: '111111', upper: '乾', lower: '乾', palace: '乾', description: '元亨利贞' },
  { id: 44, name: '天风姤', symbol: '☰☴', binarySymbol: '111011', upper: '乾', lower: '巽', palace: '乾', description: '女壮，勿用取女' },
  { id: 33, name: '天山遁', symbol: '☰☶', binarySymbol: '111100', upper: '乾', lower: '艮', palace: '乾', description: '亨，小利贞' },
  { id: 12, name: '天地否', symbol: '☰☷', binarySymbol: '111000', upper: '乾', lower: '坤', palace: '乾', description: '否之匪人，不利君子贞' },
  { id: 20, name: '风地观', symbol: '☴☷', binarySymbol: '011000', upper: '巽', lower: '坤', palace: '乾', description: '盥而不荐，有孚颙若' },
  { id: 23, name: '山地剥', symbol: '☶☷', binarySymbol: '100000', upper: '艮', lower: '坤', palace: '乾', description: '不利有攸往' },
  { id: 35, name: '火地晋', symbol: '☲☷', binarySymbol: '101000', upper: '离', lower: '坤', palace: '乾', description: '康侯用锡马蕃庶' },
  { id: 14, name: '火天大有', symbol: '☲☰', binarySymbol: '101111', upper: '离', lower: '乾', palace: '乾', description: '元亨' },

  /* 坎宫 */
  { id: 29, name: '坎为水', symbol: '☵☵', binarySymbol: '010010', upper: '坎', lower: '坎', palace: '坎', description: '习坎，有孚，维心亨' },
  { id: 60, name: '水泽节', symbol: '☵☱', binarySymbol: '010110', upper: '坎', lower: '兑', palace: '坎', description: '亨，苦节不可贞' },
  { id: 3, name: '水雷屯', symbol: '☵☳', binarySymbol: '010001', upper: '坎', lower: '震', palace: '坎', description: '元亨利贞，勿用有攸往' },
  { id: 63, name: '水火既济', symbol: '☵☲', binarySymbol: '010101', upper: '坎', lower: '离', palace: '坎', description: '亨小，利贞' },
  { id: 49, name: '泽火革', symbol: '☱☲', binarySymbol: '110101', upper: '兑', lower: '离', palace: '坎', description: '己日乃孚，元亨利贞' },
  { id: 55, name: '雷火丰', symbol: '☳☲', binarySymbol: '001101', upper: '震', lower: '离', palace: '坎', description: '亨，王假之' },
  { id: 36, name: '地火明夷', symbol: '☷☲', binarySymbol: '000101', upper: '坤', lower: '离', palace: '坎', description: '利艰贞' },
  { id: 7, name: '地水师', symbol: '☷☵', binarySymbol: '000010', upper: '坤', lower: '坎', palace: '坎', description: '贞，丈人吉，无咎' },

  /* 艮宫 */
  { id: 52, name: '艮为山', symbol: '☶☶', binarySymbol: '100100', upper: '艮', lower: '艮', palace: '艮', description: '艮其背，不获其身' },
  { id: 22, name: '山火贲', symbol: '☶☲', binarySymbol: '100101', upper: '艮', lower: '离', palace: '艮', description: '亨，小利有攸往' },
  { id: 26, name: '山天大畜', symbol: '☶☰', binarySymbol: '100111', upper: '艮', lower: '乾', palace: '艮', description: '利贞，不家食吉' },
  { id: 41, name: '山泽损', symbol: '☶☱', binarySymbol: '100110', upper: '艮', lower: '兑', palace: '艮', description: '有孚，元吉，无咎' },
  { id: 38, name: '火泽睽', symbol: '☲☱', binarySymbol: '101110', upper: '离', lower: '兑', palace: '艮', description: '小事吉' },
  { id: 10, name: '天泽履', symbol: '☰☱', binarySymbol: '111110', upper: '乾', lower: '兑', palace: '艮', description: '履虎尾，不咥人，亨' },
  { id: 61, name: '风泽中孚', symbol: '☴☱', binarySymbol: '011110', upper: '巽', lower: '兑', palace: '艮', description: '豚鱼吉，利涉大川' },
  { id: 53, name: '风山渐', symbol: '☴☶', binarySymbol: '011100', upper: '巽', lower: '艮', palace: '艮', description: '女归吉，利贞' },

  /* 震宫 */
  { id: 51, name: '震为雷', symbol: '☳☳', binarySymbol: '001001', upper: '震', lower: '震', palace: '震', description: '亨，震来虩虩' },
  { id: 16, name: '雷地豫', symbol: '☳☷', binarySymbol: '001000', upper: '震', lower: '坤', palace: '震', description: '利建侯行师' },
  { id: 40, name: '雷水解', symbol: '☳☵', binarySymbol: '001010', upper: '震', lower: '坎', palace: '震', description: '利西南，无所往' },
  { id: 32, name: '雷风恒', symbol: '☳☴', binarySymbol: '001011', upper: '震', lower: '巽', palace: '震', description: '亨，无咎，利贞' },
  { id: 46, name: '地风升', symbol: '☷☴', binarySymbol: '000011', upper: '坤', lower: '巽', palace: '震', description: '元亨，用见大人，勿恤' },
  { id: 48, name: '水风井', symbol: '☵☴', binarySymbol: '010011', upper: '坎', lower: '巽', palace: '震', description: '改邑不改井' },
  { id: 28, name: '泽风大过', symbol: '☱☴', binarySymbol: '110011', upper: '兑', lower: '巽', palace: '震', description: '栋桡，利有攸往' },
  { id: 17, name: '泽雷随', symbol: '☱☳', binarySymbol: '110001', upper: '兑', lower: '震', palace: '震', description: '元亨利贞，无咎' },

  /* 巽宫 */
  { id: 57, name: '巽为风', symbol: '☴☴', binarySymbol: '011011', upper: '巽', lower: '巽', palace: '巽', description: '小亨，利有攸往' },
  { id: 9, name: '风天小畜', symbol: '☴☰', binarySymbol: '011111', upper: '巽', lower: '乾', palace: '巽', description: '亨，密云不雨' },
  { id: 37, name: '风火家人', symbol: '☴☲', binarySymbol: '011101', upper: '巽', lower: '离', palace: '巽', description: '利女贞' },
  { id: 42, name: '风雷益', symbol: '☴☳', binarySymbol: '011001', upper: '巽', lower: '震', palace: '巽', description: '利有攸往，利涉大川' },
  { id: 25, name: '天雷无妄', symbol: '☰☳', binarySymbol: '111001', upper: '乾', lower: '震', palace: '巽', description: '元亨利贞' },
  { id: 21, name: '火雷噬嗑', symbol: '☲☳', binarySymbol: '101001', upper: '离', lower: '震', palace: '巽', description: '亨，利用狱' },
  { id: 27, name: '山雷颐', symbol: '☶☳', binarySymbol: '100001', upper: '艮', lower: '震', palace: '巽', description: '贞吉，观颐' },
  { id: 18, name: '山风蛊', symbol: '☶☴', binarySymbol: '100011', upper: '艮', lower: '巽', palace: '巽', description: '元亨，利涉大川' },

  /* 离宫 */
  { id: 30, name: '离为火', symbol: '☲☲', binarySymbol: '101101', upper: '离', lower: '离', palace: '离', description: '利贞，亨，畜牝牛吉' },
  { id: 56, name: '火山旅', symbol: '☲☶', binarySymbol: '101100', upper: '离', lower: '艮', palace: '离', description: '小亨，旅贞吉' },
  { id: 50, name: '火风鼎', symbol: '☲☴', binarySymbol: '101011', upper: '离', lower: '巽', palace: '离', description: '元吉，亨' },
  { id: 64, name: '火水未济', symbol: '☲☵', binarySymbol: '101010', upper: '离', lower: '坎', palace: '离', description: '亨，小狐汔济，濡其尾' },
  { id: 4, name: '山水蒙', symbol: '☶☵', binarySymbol: '100010', upper: '艮', lower: '坎', palace: '离', description: '亨，匪我求童蒙' },
  { id: 59, name: '风水涣', symbol: '☴☵', binarySymbol: '011010', upper: '巽', lower: '坎', palace: '离', description: '亨，王假有庙' },
  { id: 6, name: '天水讼', symbol: '☰☵', binarySymbol: '111010', upper: '乾', lower: '坎', palace: '离', description: '有孚，窒惕，中吉' },
  { id: 13, name: '天火同人', symbol: '☰☲', binarySymbol: '111101', upper: '乾', lower: '离', palace: '离', description: '同人于野，亨' },

  /* 坤宫 */
  { id: 2, name: '坤为地', symbol: '☷☷', binarySymbol: '000000', upper: '坤', lower: '坤', palace: '坤', description: '元亨，利牝马之贞' },
  { id: 24, name: '地雷复', symbol: '☷☳', binarySymbol: '000001', upper: '坤', lower: '震', palace: '坤', description: '亨，出入无疾' },
  { id: 19, name: '地泽临', symbol: '☷☱', binarySymbol: '000110', upper: '坤', lower: '兑', palace: '坤', description: '元亨利贞，至于八月有凶' },
  { id: 11, name: '地天泰', symbol: '☷☰', binarySymbol: '000111', upper: '坤', lower: '乾', palace: '坤', description: '小往大来，吉亨' },
  { id: 34, name: '雷天大壮', symbol: '☳☰', binarySymbol: '001111', upper: '震', lower: '乾', palace: '坤', description: '利贞' },
  { id: 43, name: '泽天夬', symbol: '☱☰', binarySymbol: '110111', upper: '兑', lower: '乾', palace: '坤', description: '扬于王庭，孚号有厉' },
  { id: 5, name: '水天需', symbol: '☵☰', binarySymbol: '010111', upper: '坎', lower: '乾', palace: '坤', description: '有孚，光亨，贞吉' },
  { id: 8, name: '水地比', symbol: '☵☷', binarySymbol: '010000', upper: '坎', lower: '坤', palace: '坤', description: '吉，原筮，元永贞，无咎' },

  /* 兑宫 */
  { id: 58, name: '兑为泽', symbol: '☱☱', binarySymbol: '110110', upper: '兑', lower: '兑', palace: '兑', description: '亨，利贞' },
  { id: 47, name: '泽水困', symbol: '☱☵', binarySymbol: '110010', upper: '兑', lower: '坎', palace: '兑', description: '亨，贞，大人吉' },
  { id: 45, name: '泽地萃', symbol: '☱☷', binarySymbol: '110000', upper: '兑', lower: '坤', palace: '兑', description: '亨，王假有庙' },
  { id: 31, name: '泽山咸', symbol: '☱☶', binarySymbol: '110100', upper: '兑', lower: '艮', palace: '兑', description: '亨，利贞，取女吉' },
  { id: 39, name: '水山蹇', symbol: '☵☶', binarySymbol: '010100', upper: '坎', lower: '艮', palace: '兑', description: '利西南，不利东北' },
  { id: 15, name: '地山谦', symbol: '☷☶', binarySymbol: '000100', upper: '坤', lower: '艮', palace: '兑', description: '亨，君子有终' },
  { id: 62, name: '雷山小过', symbol: '☳☶', binarySymbol: '001100', upper: '震', lower: '艮', palace: '兑', description: '亨，利贞，可小事' },
  { id: 54, name: '雷泽归妹', symbol: '☳☱', binarySymbol: '001110', upper: '震', lower: '兑', palace: '兑', description: '征凶，无攸利' }
];

// 导出卦象数据
export const hexagramsData: HexagramData[] = rawHexagramsData;

// 获取三爻卦名称
function getTrigramName(symbol: string): string {
  const trigram = trigramsByBinary[symbol as keyof typeof trigramsByBinary];
  if (!trigram) {
    throw new Error(`找不到符号为 "${symbol}" 的八卦`);
  }
  return trigram.name;
}

// 获取三爻卦数据
function getTrigramBySymbol(symbol: string): TrigramData | null {
  const trigram = trigramsByBinary[symbol as keyof typeof trigramsByBinary];
  if (!trigram) {
    throw new Error(`找不到符号为 "${symbol}" 的八卦`);
  }
  return trigram;
}
