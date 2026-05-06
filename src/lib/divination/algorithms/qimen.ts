/**
 * @file 奇门遁甲排盘算法
 * @description 基于转盘奇门法，实现时家奇门的排盘。
 * @流派 奇门遁甲（转盘法）
 * @核心思想
 * 1. 定局数：根据占测当日的节气，以及日干支所属的“旬”，来确定使用阴阳几局。此为奇门之钥。
 * 2. 排地盘：将三奇六仪（戊己庚辛壬癸丁丙乙）按照阳顺阴逆的规则，从局数宫位开始布满九宫。
 * 3. 寻值符值使：根据时辰干支所属的旬，找到旬首，从而定出此局的“值符”（九星之一）和“值使”（八门之一）。
 * 4. 排天盘：值符星追随时干，找到时干在地盘的落宫，值符星即落此宫，其余八星按原宫位顺序随之旋转。天盘之干则随星飞走。
 * 5. 排人盘：值使门追随时支，找到时支的落宫，值使门即落此宫，其余七门按“洛书轨迹”旋转。
 * 6. 排神盘：八神（或称九神）追随天盘值符星，阳顺阴逆飞布八宫。
 */
import { getDivinationTime } from '../../../utils/timeManager.ts';
import {
  tiangan,
  jiazi,
  qimen,
} from '../../../config/divination-data.ts';

const {
  dizhi,
  diPanPalaces,
  palaceStars,
  palaceDoors,
  doorPalaceMap,
  palaceDoorMap,
  yangGods,
  yinGods,
  ninePositions,
  jieQiJuShuMap,
} = qimen;
const tenStems = tiangan;

/**
 * 定局数
 * @param timeInfo 时间信息，包含节气和日干支
 * @returns 返回{阴阳遁, 局数}
 */
function getQimenJuShu(
  timeInfo: { jieQi: string; ganzhi: { day: string } }
) {
  const { jieQi, ganzhi } = timeInfo;
  const dayGanZhi = ganzhi.day;

  const rule = jieQiJuShuMap[jieQi as keyof typeof jieQiJuShuMap];
  if (!rule) {
    throw new Error(`找不到节气 "${jieQi}" 对应的局数规则。`);
  }
  
  // 阴阳遁严格按节气划分
  const isYangDun = rule.dun === '阳';

  // 拆补法按五日一元轮转：上元、中元、下元循环。
  const dayIndex = jiazi.indexOf(dayGanZhi);
  if (dayIndex === -1) {
    throw new Error(`无法识别日干支 "${dayGanZhi}" 的三元归属。`);
  }
  const yuanIndex = Math.floor(dayIndex / 5) % 3;
  const yuan = ['上元', '中元', '下元'][yuanIndex];

  const juShu = rule.ju[yuanIndex];

  return { isYangDun, juShu, yuan };
}

/**
 * 检查特殊时辰情况
 * @param hourGanZhi 时辰干支
 * @returns 返回特殊时辰信息
 */
function checkSpecialHourConditions(hourGanZhi: string) {
  const hourGan = hourGanZhi.charAt(0);
  const hourZhi = hourGanZhi.charAt(1);
  
  const specialConditions = {
    isLiuJiaHour: false,      // 六甲时辰
    isLiuGuiHour: false,      // 六癸时辰
    isShiGanRuMu: false,      // 时干入墓
    isWuBuYuShi: false,       // 五不遇时
    description: ''
  };

  // 1. 检查六甲时辰（甲子、甲戌、甲申、甲午、甲辰、甲寅）
  const liuJiaHours = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
  if (liuJiaHours.includes(hourGanZhi)) {
    specialConditions.isLiuJiaHour = true;
    specialConditions.description += '六甲时辰（甲时），甲遁于六仪之下；';
  }

  // 2. 检查六癸时辰（癸未、癸巳、癸卯、癸丑、癸亥、癸酉）
  const liuGuiHours = ['癸未', '癸巳', '癸卯', '癸丑', '癸亥', '癸酉'];
  if (liuGuiHours.includes(hourGanZhi)) {
    specialConditions.isLiuGuiHour = true;
    specialConditions.description += '六癸时辰，癸为阴干之末；';
  }

  // 3. 检查时干入墓
  // 时干入墓规则：乙入坤宫（未），丙戊入乾宫（戌），丁入艮宫（丑），己入巽宫（辰），庚入坤宫（未），辛入艮宫（丑），壬入巽宫（辰），癸入离宫（午）
  const ruMuMap: { [key: string]: { palace: number; branch: string } } = {
    '乙': { palace: 2, branch: '未' },  // 坤二宫
    '丙': { palace: 6, branch: '戌' },  // 乾六宫
    '戊': { palace: 6, branch: '戌' },  // 乾六宫
    '丁': { palace: 8, branch: '丑' },  // 艮八宫
    '己': { palace: 4, branch: '辰' },  // 巽四宫
    '庚': { palace: 2, branch: '未' },  // 坤二宫
    '辛': { palace: 8, branch: '丑' },  // 艮八宫
    '壬': { palace: 4, branch: '辰' },  // 巽四宫
    '癸': { palace: 9, branch: '午' },  // 离九宫
  };

  const ruMuInfo = ruMuMap[hourGan];
  if (ruMuInfo && hourZhi === ruMuInfo.branch) {
    specialConditions.isShiGanRuMu = true;
    specialConditions.description += `时干${hourGan}入墓（${ruMuInfo.branch}支）；`;
  }

  // 4. 检查五不遇时
  // 五不遇时：时干克时支，且时干为阳干、时支为阳支，或时干为阴干、时支为阴支
  // 具体组合：甲申、乙酉、丙子、丁亥、戊寅、己卯、庚午、辛巳、壬辰、癸未
  const wuBuYuShiHours = ['甲申', '乙酉', '丙子', '丁亥', '戊寅', '己卯', '庚午', '辛巳', '壬辰', '癸未'];
  if (wuBuYuShiHours.includes(hourGanZhi)) {
    specialConditions.isWuBuYuShi = true;
    specialConditions.description += '五不遇时（时干克时支），凶时；';
  }

  return specialConditions;
}

/**
 * 寻值符与值使
 * @param hourGanZhi 时辰干支
 * @returns 返回{值符, 值使, 值符所在宫, 特殊时辰情况}
 */
function getZhiFuZhiShi(hourGanZhi: string) {
  // 法理：值符与值使由时辰干支所属的"旬"来决定。
  // 旬首（如甲子）所在的地盘宫位，其对应的星为值符，门为值使。
  const hourGan = hourGanZhi.charAt(0);
  const hourZhi = hourGanZhi.charAt(1);

  const hourGanIndex = tenStems.indexOf(hourGan);
  const hourZhiIndex = dizhi.indexOf(hourZhi);

  const xunShouZhiIndex = (hourZhiIndex - hourGanIndex + 12) % 12;
  const xunShouZhi = dizhi[xunShouZhiIndex];
  
  const xunShouPalace = diPanPalaces[xunShouZhi as keyof typeof diPanPalaces];

  const zhiFu = palaceStars[xunShouPalace - 1];
  const zhiShi = palaceDoorMap[xunShouPalace as keyof typeof palaceDoorMap];

  // 检查特殊时辰情况
  const specialConditions = checkSpecialHourConditions(hourGanZhi);

  return { zhiFu, zhiShi, zhiFuPalace: xunShouPalace, specialConditions };
}

function getDunJiaStem(hourGanZhi: string): string {
  if (!hourGanZhi.startsWith('甲')) {
    return hourGanZhi.charAt(0);
  }

  const dunJiaMap: Record<string, string> = {
    甲子: '戊',
    甲戌: '己',
    甲申: '庚',
    甲午: '辛',
    甲辰: '壬',
    甲寅: '癸',
  };

  return dunJiaMap[hourGanZhi] || '戊';
}

function getOppositePalace(palace: number): number | null {
  const oppositeMap: Record<number, number> = {
    1: 9,
    2: 8,
    3: 7,
    4: 6,
    6: 4,
    7: 3,
    8: 2,
    9: 1,
  };

  return oppositeMap[palace] || null;
}

function isElementKe(source: string, target: string): boolean {
  const keMap: Record<string, string> = {
    金: '木',
    木: '土',
    土: '水',
    水: '火',
    火: '金',
  };

  return keMap[source] === target;
}

function getDoorElement(door: string): string {
  const doorElementMap: Record<string, string> = {
    休门: '水',
    生门: '土',
    伤门: '木',
    杜门: '木',
    景门: '火',
    死门: '土',
    惊门: '金',
    开门: '金',
  };

  return doorElementMap[door] || '';
}

function getMenPoTags(jiuGongGe: Array<{
  name: string;
  element: string;
  renPan: { door: string };
}>): string[] {
  return jiuGongGe
    .filter((gong) => gong.renPan.door)
    .filter((gong) => isElementKe(getDoorElement(gong.renPan.door), gong.element))
    .map((gong) => `门迫（${gong.name}${gong.renPan.door}）`);
}

function getJiXingTag(stem: string, landingPalace: number, palaceName: string): string | null {
  const jiXingMap: Record<string, number> = {
    戊: 3,
    己: 2,
    庚: 8,
    辛: 9,
    壬: 4,
    癸: 4,
  };

  if (jiXingMap[stem] === landingPalace) {
    return `击刑（时干${stem}落${palaceName}）`;
  }

  return null;
}

function getQimenPatternTags(args: {
  zhiFu: string;
  zhiShi: string;
  zhiFuLandingPalace: number;
  zhiShiLandingPalace: number;
  jiuGongGe: Array<{
    gong: number;
    name: string;
    element: string;
    renPan: { door: string };
  }>;
  hourGanForFind: string;
}): string[] {
  const tags: string[] = [];
  const zhiFuOriginalPalace = palaceStars.indexOf(args.zhiFu) + 1;
  const zhiShiOriginalPalace = doorPalaceMap[args.zhiShi as keyof typeof doorPalaceMap] || 0;

  if (args.zhiFuLandingPalace === zhiFuOriginalPalace) {
    tags.push('星伏吟');
  } else if (getOppositePalace(zhiFuOriginalPalace) === args.zhiFuLandingPalace) {
    tags.push('星反吟');
  }

  if (args.zhiShiLandingPalace === zhiShiOriginalPalace) {
    tags.push('门伏吟');
  } else if (getOppositePalace(zhiShiOriginalPalace) === args.zhiShiLandingPalace) {
    tags.push('门反吟');
  }

  tags.push(...getMenPoTags(args.jiuGongGe));

  const zhiFuLandingGong = args.jiuGongGe.find((gong) => gong.gong === args.zhiFuLandingPalace);
  const jiXingTag = zhiFuLandingGong
    ? getJiXingTag(args.hourGanForFind, args.zhiFuLandingPalace, zhiFuLandingGong.name)
    : null;
  if (jiXingTag) {
    tags.push(jiXingTag);
  }

  return tags;
}

function buildPatternDetails(patternTags: string[]): Array<{ tag: string; summary: string }> {
  return patternTags.map((tag) => ({
    tag,
    summary: getPatternSummary(tag),
  }));
}

function getPatternSummary(tag: string): string {
  if (tag === '星伏吟') {
    return '九星回原位，事情多原地盘旋、推进偏慢。';
  }
  if (tag === '星反吟') {
    return '九星临对冲宫，局势波动较大，易反复。';
  }
  if (tag === '门伏吟') {
    return '八门回原位，事项推进迟滞，宜耐心等待。';
  }
  if (tag === '门反吟') {
    return '八门落反吟位，节奏多突变，计划易临时调整。';
  }
  if (tag.startsWith('门迫')) {
    return '门受宫克，该宫事项易受压制，行动阻力偏大。';
  }
  if (tag.startsWith('击刑')) {
    return '时干落击刑位，主压力、掣肘或规章束缚，宜谨慎行事。';
  }
  return '需结合全局继续参看。';
}

function buildPalaceInsights(args: {
  jiuGongGe: Array<{
    gong: number;
    name: string;
    renPan: { door: string };
    shenPan: { god: string };
    tianPan: { star: string };
  }>;
  zhiFu: string;
  zhiShi: string;
  patternTags: string[];
}): Array<{
  gong: number;
  name: string;
  level: '有利' | '风险' | '关注';
  summary: string;
}> {
  const riskDoors = new Set(['死门', '伤门', '惊门']);
  const goodDoors = new Set(['开门', '生门', '休门']);
  const riskGods = new Set(['白虎', '玄武', '螣蛇']);
  const goodGods = new Set(['值符', '六合', '九天', '太阴']);

  return args.jiuGongGe.flatMap((gong) => {
    const insights: Array<{
      gong: number;
      name: string;
      level: '有利' | '风险' | '关注';
      summary: string;
    }> = [];

    const relatedTags = args.patternTags.filter((tag) => tag.includes(`（${gong.name}`) || tag.includes(`落${gong.name}`));
    if (relatedTags.length > 0) {
      insights.push({
        gong: gong.gong,
        name: gong.name,
        level: '风险',
        summary: `该宫带有${relatedTags.join('、')}，行事阻滞和牵制较明显。`,
      });
    } else if (riskDoors.has(gong.renPan.door) || riskGods.has(gong.shenPan.god)) {
      const reasons = [
        riskDoors.has(gong.renPan.door) ? gong.renPan.door : '',
        riskGods.has(gong.shenPan.god) ? gong.shenPan.god : '',
      ].filter(Boolean);
      insights.push({
        gong: gong.gong,
        name: gong.name,
        level: '风险',
        summary: `${reasons.join('、')}同宫，宜防阻力、口舌或反复。`,
      });
    }

    if (gong.tianPan.star === args.zhiFu || gong.renPan.door === args.zhiShi) {
      const focusParts = [
        gong.tianPan.star === args.zhiFu ? `值符落${gong.name}` : '',
        gong.renPan.door === args.zhiShi ? `值使门在${gong.name}` : '',
      ].filter(Boolean);
      insights.push({
        gong: gong.gong,
        name: gong.name,
        level: '关注',
        summary: `${focusParts.join('，')}，是当前局的核心观察位。`,
      });
    }

    if (goodDoors.has(gong.renPan.door) || goodGods.has(gong.shenPan.god)) {
      const goodParts = [
        goodDoors.has(gong.renPan.door) ? gong.renPan.door : '',
        goodGods.has(gong.shenPan.god) ? gong.shenPan.god : '',
      ].filter(Boolean);
      insights.push({
        gong: gong.gong,
        name: gong.name,
        level: '有利',
        summary: `${goodParts.join('、')}同宫，可作为推进、求助或争取资源的优先方位。`,
      });
    }

    return insights;
  });
}

function arrangeJiuGongGe(
  isYangDun: boolean,
  juShu: number,
  zhiFu: string,
  zhiShi: string,
  ganzhi: { hour: string }
) {
  const jiuGong = Array.from({ length: 9 }, (_, i) => ({
    gong: i + 1,
    name: ninePositions[i].name,
    direction: ninePositions[i].direction,
    element: ninePositions[i].element,
    tianPan: { star: '', stem: '' },
    diPan: { stem: '' },
    renPan: { door: '' },
    shenPan: { god: '' },
  }));

  //【核心修正：重构整个排盘逻辑】
  // 奇门排盘需严格遵循“地、天、人、神”四盘的顺序和法理，原算法多处错乱。
  // 以下为拨乱反正后的正确步骤：

  // 步骤一：排地盘三奇六仪 (Di Pan)
  // 法理：三奇六仪按固定顺序，根据阳遁顺行、阴遁逆行的方式，从局数对应的宫位开始排布。
  const sanQiLiuYi = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
  let centerJiGongStem = '';
  
  // 先按正常顺序排布
  for (let i = 0; i < 9; i++) {
    const palaceNum = isYangDun ? ((juShu + i - 1 + 9) % 9) + 1 : ((juShu - i - 1 + 9) % 9) + 1;
    jiuGong[palaceNum - 1].diPan.stem = sanQiLiuYi[i];
  }
  
  // 法理：戊土居中宫，需寄于坤二宫。
  // 但要注意：只有当戊土确实在中五宫时才需要寄宫
  if (jiuGong[4].diPan.stem === '戊') { // 如果中五宫有戊土
    centerJiGongStem = '戊';
    jiuGong[4].diPan.stem = ''; // 中五宫地盘不布干
  }
  
  // 步骤二：定值符与值使的落宫
  // 法理：值符（星）追随时干，值使（门）追随时支。
  const hourZhi = ganzhi.hour.charAt(1);
  const hourGanForFind = getDunJiaStem(ganzhi.hour);
  
  let zhiFuLandingPalace = -1; // 值符星所落之宫
  
  // 修复时干落宫查找逻辑
  // 需要考虑戊土寄宫的情况：戊土既可能在中五宫，也可能寄在坤二宫
  for (let i = 0; i < 9; i++) {
    if (jiuGong[i].diPan.stem === hourGanForFind) {
      zhiFuLandingPalace = i + 1;
      break;
    }
  }
  
  // 如果没找到，可能是特殊情况，需要进一步处理
  if (zhiFuLandingPalace === -1) {
    if (centerJiGongStem && hourGanForFind === centerJiGongStem) {
      zhiFuLandingPalace = 2;
    }
    
    // 如果还是找不到，抛出详细的错误信息
    if (zhiFuLandingPalace === -1) {
      throw new Error(`找不到时干${hourGanForFind}落宫，请检查地盘排布逻辑`);
    }
  }
  
  const zhiShiLandingPalace = diPanPalaces[hourZhi as keyof typeof diPanPalaces]; // 值使门所落之宫

  // 步骤三：排天盘九星与天干 (Tian Pan)
  // 法理：天盘九星由值符星带领，从值符落宫开始，按九宫顺序（阳顺阴逆）飞布。
  // 天盘天干则随其所附之星飞布，即“星带干飞”。
  const zhiFuStarIndex = palaceStars.indexOf(zhiFu);
  for (let i = 0; i < 9; i++) {
    const palaceIndex = (zhiFuLandingPalace - 1 + (isYangDun ? i : -i) + 9) % 9;
    const starIndex = (zhiFuStarIndex + i + 9) % 9;
    const star = palaceStars[starIndex];
    jiuGong[palaceIndex].tianPan.star = star;

    // 关键：天盘之干，是该星在地盘的“老家”的那个干。
    let originalStarPalaceIndex = starIndex;
    if (star === '天禽' && centerJiGongStem) {
      jiuGong[palaceIndex].tianPan.stem = centerJiGongStem;
      continue;
    }
    // 天禽星的老家是中五宫，但中五宫无干时采用寄宫。
    if (star === '天禽' && !jiuGong[4].diPan.stem) {
      originalStarPalaceIndex = 1;
    }
    jiuGong[palaceIndex].tianPan.stem = jiuGong[originalStarPalaceIndex].diPan.stem;
  }

  // 步骤四：排神盘八神 (Shen Pan)
  // 法理：八神分阴阳遁有不同顺序。小值符（八神之首）永远追随大值符（天盘值符星）。
  const currentGods = isYangDun ? yangGods : yinGods;
  const shenPanPalaces: number[] = [];
  for (let offset = 0; shenPanPalaces.length < 8; offset++) {
    const palaceNum = ((zhiFuLandingPalace - 1 + (isYangDun ? offset : -offset) + 18) % 9) + 1;
    if (palaceNum === 5) {
      continue;
    }
    shenPanPalaces.push(palaceNum);
  }
  currentGods.forEach((god, index) => {
    const palaceNum = shenPanPalaces[index];
    jiuGong[palaceNum - 1].shenPan.god = god;
  });

  // 步骤五：排人盘八门 (Ren Pan)
  // 法理：八门由值使门带领，从值使落宫开始，严格遵循“洛书九宫”的飞行轨迹（1->8->3->4->9->2->7->6）排布。
  const zhiShiDoorIndex = palaceDoors.indexOf(zhiShi);
  const luoShuPath = [1, 8, 3, 4, 9, 2, 7, 6]; // 洛书轨迹，不含中五
  const zhiShiLuoShuIndex = luoShuPath.indexOf(zhiShiLandingPalace);

  for (let i = 0; i < 8; i++) {
    const doorIndex = (zhiShiDoorIndex + i + 8) % 8;
    const luoShuIndex = (zhiShiLuoShuIndex + (isYangDun ? i : -i) + 8) % 8;
    const palaceNum = luoShuPath[luoShuIndex];
    jiuGong[palaceNum - 1].renPan.door = palaceDoors[doorIndex];
  }

  return jiuGong;
}

/**
 * 生成奇门遁甲盘
 * @param customDate 自定义时间，若不提供则使用当前时间
 * @returns 返回一个完整的奇门遁甲盘数据对象
 */
export function generateQimen(
  customDate?: Date
) {
  const { timeInfo, ganzhi, timestamp } = getDivinationTime(customDate);
  const { jieQi } = timeInfo;

  const { isYangDun, juShu, yuan } = getQimenJuShu(timeInfo);
  const { zhiFu, zhiShi, specialConditions } = getZhiFuZhiShi(ganzhi.hour);
  const jiuGongGe = arrangeJiuGongGe(isYangDun, juShu, zhiFu, zhiShi, { hour: ganzhi.hour });
  const hourZhi = ganzhi.hour.charAt(1);
  const hourGanForFind = getDunJiaStem(ganzhi.hour);
  const zhiFuLandingPalace =
    jiuGongGe.find((gong) => gong.tianPan.star === zhiFu)?.gong || 0;
  const zhiShiLandingPalace = diPanPalaces[hourZhi as keyof typeof diPanPalaces];
  const patternTags = getQimenPatternTags({
    zhiFu,
    zhiShi,
    zhiFuLandingPalace,
    zhiShiLandingPalace,
    jiuGongGe,
    hourGanForFind,
  });
  const patternDetails = buildPatternDetails(patternTags);
  const palaceInsights = buildPalaceInsights({
    jiuGongGe,
    zhiFu,
    zhiShi,
    patternTags,
  });

  return {
    timeInfo: {
      solarTerm: jieQi,
      epoch: yuan,
    },
    ganzhi,
    isYangDun,
    juShu,
    zhiFu,
    zhiShi,
    patternTags,
    patternDetails,
    palaceInsights,
    specialConditions,
    jiuGongGe,
    timestamp,
  };
}
