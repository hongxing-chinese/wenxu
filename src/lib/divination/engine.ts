import type {
  DivinationData,
  LiurenData,
  LiurenTemplateType,
  LiuyaoData,
  MeihuaData,
  QimenData,
  SsgwData,
  SupplementaryInfo,
  TarotData,
} from '../../types';
import { LunarUtil } from '../../utils/lunar';
import { createQimenPriorityPalaces, createQimenQuestionHints } from '../../utils/qimen-guidance';
import type { DivinationMethodId } from './config';

const CONCRETE_DIVINATION_METHODS: Array<Exclude<DivinationMethodId, 'random'>> = [
  'liuyao',
  'meihua',
  'qimen',
  'liuren',
  'tarot',
  'ssgw',
];

export type DivinationDraft = {
  method: DivinationMethodId;
  question: string;
  gender: '' | '男' | '女';
  birthYear: string;
  meihuaMethod: 'time' | 'number' | 'random';
  meihuaNumber: string;
  liurenTemplate: LiurenTemplateType;
  tarotSpread: 'single' | 'three' | 'love' | 'career' | 'decision';
};

export type DivinationSession = {
  method: Exclude<DivinationMethodId, 'random'>;
  requestedMethod: DivinationMethodId;
  question: string;
  prompt: string;
  data: DivinationData;
};

function buildTimeInfoText() {
  const timeInfo = LunarUtil.getCurrentTimeInfo();
  const display = LunarUtil.formatTimeDisplay(timeInfo);
  return [
    display.solar,
    display.lunar,
    display.ganzhi,
    `节气：${timeInfo.jieQi}`,
  ].join('\n');
}

function formatGanzhi(ganzhi?: { year: string; month: string; day: string; hour: string }) {
  if (!ganzhi) {
    return '干支：未知';
  }

  return `干支：${ganzhi.year}年 ${ganzhi.month}月 ${ganzhi.day}日 ${ganzhi.hour}时`;
}

function formatSupplementaryInfoSection(supplementaryInfo?: SupplementaryInfo) {
  if (!supplementaryInfo) {
    return '';
  }

  const lines: string[] = [];
  if (supplementaryInfo.gender) {
    lines.push(`性别：${supplementaryInfo.gender}`);
  }
  if (typeof supplementaryInfo.birthYear === 'number' && Number.isFinite(supplementaryInfo.birthYear)) {
    lines.push(`出生年份：${supplementaryInfo.birthYear}`);
  }
  if (supplementaryInfo.meihuaSettings?.method) {
    const methodLabelMap: Record<string, string> = {
      time: '时间起卦',
      number: '数字起卦',
      random: '随机起卦',
      external: '外应起卦',
    };
    lines.push(`起卦方式：${methodLabelMap[supplementaryInfo.meihuaSettings.method] || supplementaryInfo.meihuaSettings.method}`);
  }
  if (typeof supplementaryInfo.meihuaSettings?.number === 'number') {
    lines.push(`起卦数字：${supplementaryInfo.meihuaSettings.number}`);
  }

  if (lines.length === 0) {
    return '';
  }

  return lines.join('\n');
}

function buildSection(title: string, content: string) {
  const body = content.trim();
  if (!body) {
    return '';
  }

  return `${title}\n${body}`;
}

function formatLiuyaoInfo(data: LiuyaoData) {
  const movingYaos = data.changingYaos?.length
    ? data.changingYaos.map((item) => `第${item.position}爻${item.type ? `（${item.type}）` : ''}`).join('、')
    : '无动爻';
  const worldYao = data.yaosDetail.find((item) => item.isWorld);
  const responseYao = data.yaosDetail.find((item) => item.isResponse);
  const focusParts = [
    worldYao ? `世爻在第${worldYao.position}爻` : '世爻未知',
    responseYao ? `应爻在第${responseYao.position}爻` : '应爻未知',
    `动爻${movingYaos}`,
    `空亡${data.voidBranches?.join('、') || '无'}`,
    data.specialPattern ? `卦式${data.specialPattern}` : '',
  ].filter(Boolean);
  const yaoLines = [...data.yaosDetail]
    .sort((a, b) => b.position - a.position)
    .map((item) => {
      const flags = [
        item.isWorld ? '世' : '',
        item.isResponse ? '应' : '',
        item.isVoid ? '空' : '',
        item.isChanging ? `动变${item.changeType}` : '',
      ].filter(Boolean);
      const changedYaoText = item.changedYao
        ? `；变爻${item.changedYao.dizhi}${item.changedYao.wuxing}，六亲${item.changedYao.liuqin}${item.changedYao.isVoid ? '，变爻空亡' : ''}`
        : '';
      return `- 第${item.position}爻：${item.yaoType}爻，六亲${item.sixRelative}，六神${item.sixGod}，纳甲${item.najiaDizhi}${item.wuxing}${flags.length ? `，${flags.join(' / ')}` : ''}${changedYaoText}`;
    });

  return [
    '占法：六爻',
    `时间干支：${formatGanzhi(data.ganzhi).replace('干支：', '')}`,
    `核心结构：主卦${data.originalName}${data.palace?.name ? `（${data.palace.name}宫）` : ''}；变卦${data.changedName || '无'}；互卦${data.interName || '无'}`,
    `关键提示：空亡${data.voidBranches?.join('、') || '无'}；动爻${movingYaos}；世应${worldYao ? `世爻在第${worldYao.position}爻` : '世爻未知'}、${responseYao ? `应爻在第${responseYao.position}爻` : '应爻未知'}；特殊卦式${data.specialPattern || '常规卦'}`,
    `断卦抓手：${focusParts.join('；')}`,
    data.specialAdvice ? `补充提示：${data.specialAdvice}` : '',
    '结构明细：',
    ...yaoLines,
  ].filter(Boolean).join('\n');
}

function formatMeihuaInfo(data: MeihuaData) {
  return [
    '占法：梅花易数',
    `时间干支：${formatGanzhi(data.ganzhi).replace('干支：', '')}`,
    `核心结构：主卦${data.originalName}；互卦${data.interName || '无'}；变卦${data.changedName || '无'}`,
    `关键提示：体卦${data.tiGua.name}（${data.tiGua.element}）；用卦${data.yongGua.name}（${data.yongGua.element}）；动爻第${data.movingYao.position}爻`,
    '结构明细：',
    `- 四时旺衰：${data.analysis.season}季，体卦${data.analysis.tiSeasonState}，用卦${data.analysis.yongSeasonState}`,
    `- 体用关系：${data.analysis.tiYongRelation}`,
    `- 过程关系：互上${data.analysis.inter2Relation}体，互下${data.analysis.inter1Relation}体`,
    `- 结果关系：${data.analysis.changedRelation}`,
    data.calculation?.externalSummary ? `补充提示：${data.calculation.externalSummary}` : '',
  ].filter(Boolean).join('\n');
}

function formatQimenInfo(
  question: string,
  data: QimenData,
  supplementaryInfo?: SupplementaryInfo,
) {
  const palaceLines = data.jiuGongGe
    .map((item) => `- ${item.name}：天盘${item.tianPan.stem}${item.tianPan.star}，地盘${item.diPan.stem}，人盘${item.renPan.door}，神盘${item.shenPan.god}`)
    .join('\n');
  const patternSummary = data.patternDetails?.map((item) => `${item.tag}：${item.summary}`).join('；') || '';
  const palaceSummary = data.palaceInsights?.map((item) => `${item.name}${item.level}，${item.summary}`).join('；') || '';
  const questionHints = createQimenQuestionHints(question, data, supplementaryInfo);
  const priorityPalaces = createQimenPriorityPalaces(question, data, supplementaryInfo).slice(0, 3);
  const specialConditionsText = data.specialConditions?.description?.trim();
  const questionHintText = questionHints.length > 0
    ? questionHints.map((item) => `${item.label}：${item.value}`).join('；')
    : priorityPalaces.length > 0
      ? `当前问题可先从${priorityPalaces.map((item) => item.name).join('、')}切入，再回看值符值使与门星神干组合`
      : '';
  const priorityPalaceText = priorityPalaces
    .map((item) => `${item.name}（${item.score}分，${item.reasons.join('、')}）`)
    .join('；');
  const focusParts = [
    `值符${data.zhiFu}`,
    `值使${data.zhiShi}`,
    `${data.isYangDun ? '阳遁' : '阴遁'}${data.juShu}局`,
    data.patternTags?.length ? `格局${data.patternTags.join('、')}` : '',
    priorityPalaces[0] ? `先看${priorityPalaces[0].name}` : '',
  ].filter(Boolean);

  return [
    '占法：奇门遁甲',
    `时间干支：${formatGanzhi(data.ganzhi).replace('干支：', '')}`,
    `核心结构：${data.isYangDun ? '阳遁' : '阴遁'}${data.juShu}局；值符${data.zhiFu}；值使${data.zhiShi}；值符值使主轴优先看落宫与门星神干组合`,
    `关键提示：节令${`${data.timeInfo?.solarTerm || '未知'} ${data.timeInfo?.epoch || ''}`.trim()}；格局标签${data.patternTags?.join('、') || '无'}`,
    `起局抓手：${focusParts.join('；')}`,
    specialConditionsText ? `特殊时辰：${specialConditionsText}` : '',
    questionHintText ? `问事参考：${questionHintText}` : '',
    priorityPalaceText ? `优先看宫：${priorityPalaceText}` : '',
    patternSummary ? `判断依据：${patternSummary}` : '',
    palaceSummary ? `补充提示：${palaceSummary}` : '',
    '结构明细：',
    palaceLines,
  ].filter(Boolean).join('\n');
}

function formatLiurenInfo(data: LiurenData) {
  const lessonLines = data.fourLessons.map((item) => (
    `- ${item.name}：天盘${item.upper}临地盘${item.lower}，天将${item.god}，关系${item.relation}，提示${item.note}`
  ));
  const transmissionLines = data.threeTransmissions.map((item) => (
    `- ${item.stage}：${item.branch}，天将${item.god}，关系${item.relation}，提示${item.note}`
  ));
  const plateLines = data.heavenlyPlate
    .slice(0, 6)
    .map((item) => `- ${item.under}位见${item.branch}，天将${item.god}`)
    .join('\n');
  const firstTransmission = data.threeTransmissions[0];
  const focusParts = [
    firstTransmission
      ? `发用${firstTransmission.branch}乘${firstTransmission.god}，先看${firstTransmission.note}`
      : '',
    data.transmissionPattern ? `传态${data.transmissionPattern}` : '',
    data.xunKong?.length ? `旬空${data.xunKong.join('、')}` : '',
    data.transmissionRule ? `取传${data.transmissionRule}` : '',
  ].filter(Boolean);

  return [
    '占法：大六壬',
    `时间干支：${formatGanzhi(data.ganzhi).replace('干支：', '')}`,
    `核心结构：月将${data.monthLeader}；占时${data.divinationBranch}；发用${data.threeTransmissions[0]?.branch || '未知'}；末传${data.threeTransmissions[2]?.branch || '未知'}`,
    `关键提示：${data.dayNight || '未知时段'}；贵人落${data.noblemanBranch || '未知'}；旬空${data.xunKong?.join('、') || '未知'}；取传法${data.transmissionRule || '未标注'}；传态${data.transmissionPattern || '未标注'}；课体标签${data.patternTags?.join('、') || '无'}`,
    focusParts.length ? `断课抓手：${focusParts.join('；')}` : '',
    data.guaTi?.length ? `课体补充：${data.guaTi.join('、')}` : '',
    data.shenShaSummary?.length ? `神煞补充：${data.shenShaSummary.join('；')}` : '',
    data.lessonSummary ? `判断依据：${data.lessonSummary}` : '',
    data.transmissionDetail ? `取传说明：${data.transmissionDetail}` : '',
    data.transmissionSummary ? `传变依据：${data.transmissionSummary}` : '',
    '结构明细：',
    ...lessonLines,
    ...transmissionLines,
    plateLines ? '天盘摘要：' : '',
    plateLines,
  ].filter(Boolean).join('\n');
}

function formatTarotInfo(data: TarotData) {
  const cardLines = data.cards.map((card) => (
    `- ${card.position}：${card.name}${card.reversed ? '（逆位）' : '（正位）'}，关键词：${card.keywords.join('、')}`
  ));

  return [
    '占法：塔罗',
    '时间干支：以【当前时间】为准',
    `核心结构：牌阵${data.spreadName}；共${data.cards.length}张牌`,
    '关键提示：重点关注各位置含义、正逆位变化与牌面之间的呼应关系',
    '结构明细：',
    ...cardLines,
  ].join('\n');
}

function formatSsgwInfo(data: SsgwData) {
  const detailLines = data.details
    ? Object.entries(data.details).map(([key, value]) => `- ${key}：${value}`)
    : [];

  return [
    '占法：三山国王灵签',
    `时间干支：${formatGanzhi(data.ganzhi).replace('干支：', '')}`,
    `核心结构：第${data.number}签；签题《${data.title}》`,
    `关键提示：签诗“${data.poem}”`,
    '结构明细：',
    `- 签号：第${data.number}签`,
    `- 签题：${data.title}`,
    data.story ? `补充提示：${data.story}` : '',
    ...detailLines,
  ].filter(Boolean).join('\n');
}

function formatDivinationInfo(
  method: Exclude<DivinationMethodId, 'random'>,
  data: DivinationData,
  question: string,
  supplementaryInfo?: SupplementaryInfo,
) {
  switch (method) {
    case 'liuyao':
      return formatLiuyaoInfo(data as LiuyaoData);
    case 'meihua':
      return formatMeihuaInfo(data as MeihuaData);
    case 'qimen':
      return formatQimenInfo(question, data as QimenData, supplementaryInfo);
    case 'liuren':
      return formatLiurenInfo(data as LiurenData);
    case 'tarot':
      return formatTarotInfo(data as TarotData);
    case 'ssgw':
      return formatSsgwInfo(data as SsgwData);
    default:
      return '占卜信息暂不可用';
  }
}

function buildRoleText(method: Exclude<DivinationMethodId, 'random'>) {
  switch (method) {
    case 'liuyao':
      return '你是资深六爻断卦师，熟悉卦宫、六亲、六神、世应、用神、伏神、动变与生克旺衰。';
    case 'meihua':
      return '你是资深梅花易数解读师，熟悉体用、生克、互卦、变卦与四时旺衰。';
    case 'qimen':
      return '你是资深奇门遁甲分析师，熟悉值符值使、门星神干、宫位格局、特殊时辰与时机策略。';
    case 'liuren':
      return '你是资深大六壬断课师，熟悉月将、四课、三传、天将、课体、神煞与发用主线。';
    case 'tarot':
      return '你是资深塔罗解读师，熟悉牌阵结构、正逆位、位置关系与行动建议。';
    case 'ssgw':
      return '你是资深三山国王灵签解签师，熟悉签诗、典故、吉凶趋向与现实建议。';
    default:
      return '你是资深占卜分析师。';
  }
}

function buildTaskText(method: Exclude<DivinationMethodId, 'random'>) {
  switch (method) {
    case 'liuyao':
      return '请围绕用神、世应、动爻、变卦、伏神和旺衰判断，直接回答问题，并说明该如何推进或规避风险。';
    case 'meihua':
      return '请围绕体用关系、互卦过程、变卦结果和四时旺衰判断，直接回答问题，并给出顺势应对建议。';
    case 'qimen':
      return '请围绕值符值使、用门落宫、门星神干组合、格局强弱、特殊时辰与时机策略判断，直接回答问题，并指出可行方向。';
    case 'liuren':
      return '请围绕月将、四课、三传、天将、课体与神煞主线判断，直接回答问题，并说明事情会如何演变、卡点在哪、下一步该先做什么；输出时务必按【断课模板】逐段作答。';
    case 'tarot':
      return '请围绕牌阵整体主题、关键牌、正逆位与位置关系判断，直接回答问题，并给出最值得执行的建议。';
    case 'ssgw':
      return '请围绕签诗本意、典故启示、现实映射与行动提醒判断，直接回答问题，并说明当前宜进还是宜守。';
    default:
      return '请结合占卜信息直接回答问题，并给出明确建议。';
  }
}

function buildMethodRequirementText(method: Exclude<DivinationMethodId, 'random'>) {
  switch (method) {
    case 'liuyao':
      return '- 优先看世应、动爻、变卦与空亡，再结合伏神、旺衰或神煞区分主证据与辅助证据。';
    case 'meihua':
      return '- 解释顺序以体用为先，再看互卦过程、变卦结果与四时旺衰，不要只按卦名泛讲。';
    case 'qimen':
      return '- 优先看值符值使、用门落宫与门星神干组合，再看格局标签、特殊时辰和方位时机。';
    case 'liuren':
      return '- 优先按月将、四课、三传立主线；若信息中给出课体、神煞、旬奇旬仪、空亡或贵人信息，必须纳入判断并标明主次。';
    case 'tarot':
      return '- 先统合牌阵主题，再解释位置关系与正逆位差异，不要把每张牌拆成互不相关的单点解释。';
    case 'ssgw':
      return '- 先解释签诗主旨，再联系典故和现实处境，不要只做空泛吉凶判断。';
    default:
      return '';
  }
}

function buildMethodOutputRequirementText(method: Exclude<DivinationMethodId, 'random'>) {
  switch (method) {
    case 'liuyao':
      return '明确说明哪一项是本次判断的主轴，例如世应、动爻、变卦、用神或伏神。';
    case 'meihua':
      return '把起因、过程、结果分别落到体用、互卦、变卦，不要混写。';
    case 'qimen':
      return '若盘面支持，请明确写出宜动、宜守、宜避的方向、动作或时间窗口，并说明先看哪一宫。';
    case 'liuren':
      return '若信息中有课体或神煞，要区分主线证据与辅助证据，避免堆名词。';
    case 'tarot':
      return '每个重点都要交代牌位含义、牌面关系和建议。';
    case 'ssgw':
      return '每个重点都要交代签诗原意、现实映射和行动提醒。';
    default:
      return '';
  }
}

function getLiurenPatternHint(pattern?: LiurenData['transmissionPattern']) {
  if (pattern === '伏吟') {
    return '传态伏吟：旧因反复，先稳局再推进。';
  }
  if (pattern === '反吟') {
    return '传态反吟：冲动与反复并存，先定底线和止损。';
  }
  if (pattern === '回环') {
    return '传态回环：问题会回到原点，要先切断循环触发点。';
  }
  if (pattern === '递传') {
    return '传态递传：宜分阶段推进，按节奏逐步落地。';
  }

  return '传态未标注：优先按初传-中传-末传的顺序说明。';
}

function buildLiurenTemplateText(template: LiurenTemplateType, data: LiurenData) {
  const templateLabelMap: Record<LiurenTemplateType, string> = {
    general: '通用断课',
    ganqing: '感情断课',
    shiye: '事业断课',
    caifu: '财富断课',
  };
  const templateFocusMap: Record<LiurenTemplateType, string> = {
    ganqing: '关系定位、沟通边界、推进节奏（继续/观望/止损）。',
    shiye: '岗位路径、协作阻力、窗口时机（推进/调整/暂缓）。',
    caifu: '现金流稳定性、风险敞口、操作节奏（进攻/防守/回撤）。',
    general: '核心目标、现实阻力、下一步动作（先做什么）。',
  };
  const chu = data.threeTransmissions[0];
  const zhong = data.threeTransmissions[1];
  const mo = data.threeTransmissions[2];

  return [
    `模板选择：${templateLabelMap[template]}`,
    `模板关注：${templateFocusMap[template]}`,
    getLiurenPatternHint(data.transmissionPattern),
    `主线证据：先以${chu ? `${chu.branch}乘${chu.god}` : '初传'}定发用主线，再结合${data.transmissionRule || '取传法'}、${data.transmissionPattern || '传态'}与旬空${data.xunKong?.join('、') || '未知'}判断节奏。`,
    '主辅分层：四课三传为主证，课体与神煞为辅证；若辅证与三传主线冲突，先以发用与三传演变为准。',
    '作答模板：',
    `1. 起因判断：围绕初传${chu ? `${chu.branch}（${chu.relation}）` : '未知'}，交代事件为何起。`,
    `2. 过程判断：围绕中传${zhong ? `${zhong.branch}（${zhong.relation}）` : '未知'}，交代主要卡点与转折。`,
    `3. 结果判断：围绕末传${mo ? `${mo.branch}（${mo.relation}）` : '未知'}，交代短期落点与走势。`,
    '4. 行动建议：给出一条可立即执行的动作和一条必须回避的风险。',
  ].join('\n');
}

export function buildDivinationPrompt(
  method: Exclude<DivinationMethodId, 'random'>,
  question: string,
  data: DivinationData,
  supplementaryInfo?: SupplementaryInfo,
  liurenTemplate: LiurenTemplateType = 'general',
) {
  const timeInfo = buildTimeInfoText();
  const supplementarySection = formatSupplementaryInfoSection(supplementaryInfo);
  const infoText = formatDivinationInfo(method, data, question, supplementaryInfo);
  const requirementText = [
    '- 只基于提供的占卜信息与问题作答。',
    '- 先给判断，再讲依据和建议。',
    '- 依据必须尽量落到卦象、盘局、牌面或签文信息。',
    '- 使用简体中文，不写空话，不重复抄写原始信息。',
    buildMethodRequirementText(method),
  ].join('\n');
  const outputRequirementText = [
    '先给核心结论，再展开最关键的 2 到 4 个重点；每个重点都要写明占卜依据与现实建议。',
    '如果信息不足或存在不确定性，需要明确说明，不要强行下绝对判断。',
    '最后补一条最值得执行的提醒。',
    buildMethodOutputRequirementText(method),
  ].join('\n');
  const liurenTemplateSection = method === 'liuren'
    ? buildSection('【断课模板】', buildLiurenTemplateText(liurenTemplate, data as LiurenData))
    : '';

  return [
    buildRoleText(method),
    buildSection('【要求】', requirementText),
    buildSection('【当前时间】', timeInfo),
    supplementarySection ? buildSection('【补充信息】', supplementarySection) : '',
    buildSection('【占卜信息】', infoText),
    buildSection('【问题】', question),
    buildSection('【任务】', buildTaskText(method)),
    liurenTemplateSection,
    buildSection('【输出要求】', outputRequirementText),
  ].filter(Boolean).join('\n\n');
}

function buildSupplementaryInfo(draft: DivinationDraft): SupplementaryInfo | undefined {
  const birthYear = draft.birthYear.trim() ? Number(draft.birthYear) : undefined;
  const hasBirthYear = typeof birthYear === 'number' && Number.isFinite(birthYear);

  const info: SupplementaryInfo = {};

  if (draft.gender) {
    info.gender = draft.gender;
  }
  if (hasBirthYear) {
    info.birthYear = birthYear;
  }
  if (draft.method === 'meihua') {
    info.meihuaSettings = {
      method: draft.meihuaMethod,
      ...(draft.meihuaMethod === 'number' && draft.meihuaNumber.trim()
        ? { number: Number(draft.meihuaNumber) }
        : {}),
    };
  }

  return Object.keys(info).length > 0 ? info : undefined;
}

function validateDraft(draft: DivinationDraft) {
  if (!draft.question.trim()) {
    throw new Error('请输入你想占卜的问题');
  }

  if (draft.method === 'meihua' && draft.meihuaMethod === 'number') {
    const number = Number(draft.meihuaNumber);
    if (!Number.isInteger(number) || number <= 0) {
      throw new Error('数字起卦需要填写正整数');
    }
  }
}

function resolveMethod(method: DivinationMethodId): Exclude<DivinationMethodId, 'random'> {
  if (method !== 'random') {
    return method;
  }

  const index = Math.floor(Math.random() * CONCRETE_DIVINATION_METHODS.length);
  return CONCRETE_DIVINATION_METHODS[index];
}

export async function generateDivinationSession(draft: DivinationDraft): Promise<DivinationSession> {
  validateDraft(draft);
  const method = resolveMethod(draft.method);
  const supplementaryInfo = buildSupplementaryInfo({
    ...draft,
    method,
  });
  const question = draft.question.trim();

  let data: DivinationData;
  switch (method) {
    case 'liuyao': {
      const module = await import('./algorithms/liuyao');
      data = module.generateLiuyao();
      break;
    }
    case 'meihua': {
      const module = await import('./algorithms/meihua');
      data = module.generateMeihua(undefined, supplementaryInfo?.meihuaSettings);
      break;
    }
    case 'qimen': {
      const module = await import('./algorithms/qimen');
      data = module.generateQimen();
      break;
    }
    case 'liuren': {
      const module = await import('./algorithms/liuren');
      data = module.generateLiuren();
      break;
    }
    case 'tarot': {
      const module = await import('../../utils/tarot');
      if (draft.tarotSpread === 'single') {
        const result = module.drawSingleCard();
        data = {
          spreadType: 'single',
          spreadName: '单牌指引',
          cards: [
            {
              id: result.card.number,
              name: result.card.name,
              position: result.position,
              reversed: result.isReversed,
              keywords: module.getCardKeywords(result.card.name).split(','),
            },
          ],
          timestamp: result.timestamp,
        };
      } else {
        const result = module.drawSpreadCards(draft.tarotSpread);
        data = {
          spreadType: draft.tarotSpread,
          spreadName: module.tarotSpreads[draft.tarotSpread].name,
          cards: result.cards.map((item) => ({
            id: item.card.number,
            name: item.card.name,
            position: item.position,
            reversed: item.isReversed,
            keywords: module.getCardKeywords(item.card.name).split(','),
          })),
          timestamp: result.timestamp,
        };
      }
      break;
    }
    case 'ssgw': {
      const module = await import('./algorithms/ssgw');
      data = module.drawRandomSign();
      break;
    }
    default:
      throw new Error('暂不支持当前占卜方式');
  }

  const prompt = buildDivinationPrompt(method, question, data, supplementaryInfo, draft.liurenTemplate);
  return {
    method,
    requestedMethod: draft.method,
    question,
    prompt,
    data,
  };
}
