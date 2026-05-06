// 塔罗牌功能 - 与原项目完全一致

// 塔罗牌数据 - 与原项目完全一致，78张完整牌组
const tarotCards = [
  // 大阿卡纳 (22张)
  { name: '愚者', type: '大阿卡纳', number: 1 },
  { name: '魔术师', type: '大阿卡纳', number: 2 },
  { name: '女祭司', type: '大阿卡纳', number: 3 },
  { name: '女皇', type: '大阿卡纳', number: 4 },
  { name: '皇帝', type: '大阿卡纳', number: 5 },
  { name: '教皇', type: '大阿卡纳', number: 6 },
  { name: '恋人', type: '大阿卡纳', number: 7 },
  { name: '战车', type: '大阿卡纳', number: 8 },
  { name: '力量', type: '大阿卡纳', number: 9 },
  { name: '隐士', type: '大阿卡纳', number: 10 },
  { name: '命运之轮', type: '大阿卡纳', number: 11 },
  { name: '正义', type: '大阿卡纳', number: 12 },
  { name: '倒吊人', type: '大阿卡纳', number: 13 },
  { name: '死神', type: '大阿卡纳', number: 14 },
  { name: '节制', type: '大阿卡纳', number: 15 },
  { name: '恶魔', type: '大阿卡纳', number: 16 },
  { name: '塔', type: '大阿卡纳', number: 17 },
  { name: '星星', type: '大阿卡纳', number: 18 },
  { name: '月亮', type: '大阿卡纳', number: 19 },
  { name: '太阳', type: '大阿卡纳', number: 20 },
  { name: '审判', type: '大阿卡纳', number: 21 },
  { name: '世界', type: '大阿卡纳', number: 22 },

  // 权杖牌组 (14张)
  { name: '权杖王牌', type: '小阿卡纳', suit: '权杖', number: 23 },
  { name: '权杖二', type: '小阿卡纳', suit: '权杖', number: 24 },
  { name: '权杖三', type: '小阿卡纳', suit: '权杖', number: 25 },
  { name: '权杖四', type: '小阿卡纳', suit: '权杖', number: 26 },
  { name: '权杖五', type: '小阿卡纳', suit: '权杖', number: 27 },
  { name: '权杖六', type: '小阿卡纳', suit: '权杖', number: 28 },
  { name: '权杖七', type: '小阿卡纳', suit: '权杖', number: 29 },
  { name: '权杖八', type: '小阿卡纳', suit: '权杖', number: 30 },
  { name: '权杖九', type: '小阿卡纳', suit: '权杖', number: 31 },
  { name: '权杖十', type: '小阿卡纳', suit: '权杖', number: 32 },
  { name: '权杖侍者', type: '小阿卡纳', suit: '权杖', number: 33 },
  { name: '权杖骑士', type: '小阿卡纳', suit: '权杖', number: 34 },
  { name: '权杖王后', type: '小阿卡纳', suit: '权杖', number: 35 },
  { name: '权杖国王', type: '小阿卡纳', suit: '权杖', number: 36 },

  // 圣杯牌组 (14张)
  { name: '圣杯王牌', type: '小阿卡纳', suit: '圣杯', number: 37 },
  { name: '圣杯二', type: '小阿卡纳', suit: '圣杯', number: 38 },
  { name: '圣杯三', type: '小阿卡纳', suit: '圣杯', number: 39 },
  { name: '圣杯四', type: '小阿卡纳', suit: '圣杯', number: 40 },
  { name: '圣杯五', type: '小阿卡纳', suit: '圣杯', number: 41 },
  { name: '圣杯六', type: '小阿卡纳', suit: '圣杯', number: 42 },
  { name: '圣杯七', type: '小阿卡纳', suit: '圣杯', number: 43 },
  { name: '圣杯八', type: '小阿卡纳', suit: '圣杯', number: 44 },
  { name: '圣杯九', type: '小阿卡纳', suit: '圣杯', number: 45 },
  { name: '圣杯十', type: '小阿卡纳', suit: '圣杯', number: 46 },
  { name: '圣杯侍者', type: '小阿卡纳', suit: '圣杯', number: 47 },
  { name: '圣杯骑士', type: '小阿卡纳', suit: '圣杯', number: 48 },
  { name: '圣杯王后', type: '小阿卡纳', suit: '圣杯', number: 49 },
  { name: '圣杯国王', type: '小阿卡纳', suit: '圣杯', number: 50 },

  // 宝剑牌组 (14张)
  { name: '宝剑王牌', type: '小阿卡纳', suit: '宝剑', number: 51 },
  { name: '宝剑二', type: '小阿卡纳', suit: '宝剑', number: 52 },
  { name: '宝剑三', type: '小阿卡纳', suit: '宝剑', number: 53 },
  { name: '宝剑四', type: '小阿卡纳', suit: '宝剑', number: 54 },
  { name: '宝剑五', type: '小阿卡纳', suit: '宝剑', number: 55 },
  { name: '宝剑六', type: '小阿卡纳', suit: '宝剑', number: 56 },
  { name: '宝剑七', type: '小阿卡纳', suit: '宝剑', number: 57 },
  { name: '宝剑八', type: '小阿卡纳', suit: '宝剑', number: 58 },
  { name: '宝剑九', type: '小阿卡纳', suit: '宝剑', number: 59 },
  { name: '宝剑十', type: '小阿卡纳', suit: '宝剑', number: 60 },
  { name: '宝剑侍者', type: '小阿卡纳', suit: '宝剑', number: 61 },
  { name: '宝剑骑士', type: '小阿卡纳', suit: '宝剑', number: 62 },
  { name: '宝剑王后', type: '小阿卡纳', suit: '宝剑', number: 63 },
  { name: '宝剑国王', type: '小阿卡纳', suit: '宝剑', number: 64 },

  // 钱币牌组 (14张) - 与原项目保持一致，使用"钱币"而不是"星币"
  { name: '钱币王牌', type: '小阿卡纳', suit: '钱币', number: 65 },
  { name: '钱币二', type: '小阿卡纳', suit: '钱币', number: 66 },
  { name: '钱币三', type: '小阿卡纳', suit: '钱币', number: 67 },
  { name: '钱币四', type: '小阿卡纳', suit: '钱币', number: 68 },
  { name: '钱币五', type: '小阿卡纳', suit: '钱币', number: 69 },
  { name: '钱币六', type: '小阿卡纳', suit: '钱币', number: 70 },
  { name: '钱币七', type: '小阿卡纳', suit: '钱币', number: 71 },
  { name: '钱币八', type: '小阿卡纳', suit: '钱币', number: 72 },
  { name: '钱币九', type: '小阿卡纳', suit: '钱币', number: 73 },
  { name: '钱币十', type: '小阿卡纳', suit: '钱币', number: 74 },
  { name: '钱币侍者', type: '小阿卡纳', suit: '钱币', number: 75 },
  { name: '钱币骑士', type: '小阿卡纳', suit: '钱币', number: 76 },
  { name: '钱币王后', type: '小阿卡纳', suit: '钱币', number: 77 },
  { name: '钱币国王', type: '小阿卡纳', suit: '钱币', number: 78 },
];

// 洗牌函数 - 与原项目完全一致
function shuffleCards() {
  const shuffled = [...tarotCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 单牌抽取 - 与原项目dp.js完全一致
export function drawSingleCard() {
  const shuffled = shuffleCards();
  const card = shuffled[0];
  const isReversed = Math.random() < 0.5; // 50% 概率逆位，符合正常逻辑

  return {
    card: card,
    isReversed: isReversed,
    position: '当前指引',
    timestamp: Date.now(),
  };
}

// 塔罗牌阵定义
export const tarotSpreads = {
  single: {
    name: '单牌指引',
    description:
      '在处理复杂问题或需要考虑多方面因素时，单牌布局可以提供更单纯的细节和更全面的视角，过去现在和未来',
    positions: ['当前指引'],
    cardCount: 1,
    defaultQuestions: [
      '今天我需要关注什么？',
      '我现在最需要的指引是什么？',
      '宇宙想要告诉我什么？',
      '我应该如何面对当前的困惑？',
      '今日的能量指引',
    ],
  },
  three: {
    name: '时间流牌阵',
    description:
      '在处理复杂问题或需要考虑多方面因素时，三牌布局可以提供更丰富的细节和更全面的视角，过去现在和未来',
    positions: ['过去', '现在', '未来'],
    cardCount: 3,
    defaultQuestions: [
      '我的人生发展趋势如何？',
      '这个问题的来龙去脉是什么？',
      '我的过去如何影响现在和未来？',
      '我应该如何规划接下来的发展？',
      '时间会如何改变我的处境？',
    ],
  },
  love: {
    name: '爱情牌阵',
    description:
      '专门为感情问题设计的牌阵，深入分析你和对方的内心世界，了解关系现状，获得发展建议，预见未来走向',
    positions: ['你的内心', '对方的内心', '关系现状', '发展建议', '未来走向'],
    cardCount: 5,
    defaultQuestions: [
      '我和TA的感情会如何发展？',
      'TA对我的真实想法是什么？',
      '我们的关系现在处于什么状态？',
      '如何改善我们之间的关系？',
      '我的感情生活会有什么变化？',
      '我应该如何表达我的感情？',
      '这段关系值得我继续投入吗？',
      '我们之间的问题如何解决？',
    ],
  },
  career: {
    name: '事业牌阵',
    description:
      '全面分析事业发展和职场问题，了解当前状况，发现自身优势，识别挑战，把握机会，获得行动建议，预见结果',
    positions: ['当前状况', '优势', '挑战', '机会', '行动建议', '结果'],
    cardCount: 6,
    defaultQuestions: [
      '我的事业发展前景如何？',
      '我应该换工作吗？',
      '如何在职场中获得更好的发展？',
      '我的职业规划应该如何调整？',
      '这个工作机会适合我吗？',
      '如何提升我的职场竞争力？',
      '我的事业瓶颈如何突破？',
      '什么时候是跳槽的最佳时机？',
    ],
  },
  decision: {
    name: '选择牌阵',
    description:
      '面临重要决定时的最佳助手，分析现状，比较不同选择的结果，获得最佳建议，帮助你做出明智的决定',
    positions: ['现状', '选择A', '选择A结果', '选择B', '选择B结果', '最佳建议'],
    cardCount: 6,
    defaultQuestions: [
      '我应该选择A还是B？',
      '这两个选择哪个更适合我？',
      '我应该接受这个offer吗？',
      '搬家还是留在原地？',
      '继续这段关系还是分手？',
      '创业还是继续打工？',
      '出国还是留在国内发展？',
      '现在投资还是继续观望？',
    ],
  },
  celtic: {
    name: '凯尔特十字',
    description:
      '塔罗占卜中最经典和最全面的牌阵，适合深度分析复杂问题，从多个角度全面了解情况，获得深刻洞察',
    positions: [
      '当前状况',
      '挑战/阻碍',
      '遥远过去',
      '近期过去',
      '可能未来',
      '近期未来',
      '你的态度',
      '外界影响',
      '内心恐惧',
      '最终结果',
    ],
    cardCount: 10,
    defaultQuestions: [
      '我人生的整体状况如何？',
      '这个复杂问题的全面分析',
      '我的人生方向是否正确？',
      '如何解决我面临的复杂困境？',
      '我的人生会有什么重大转变？',
      '深度分析我的人际关系',
      '我的内心世界和外在环境如何平衡？',
    ],
  },
  chakra: {
    name: '七脉轮牌阵',
    description:
      '基于古老的脉轮理论，分析身心灵各个层面的状态，帮助你了解能量流动，找到平衡点，实现整体和谐',
    positions: [
      '海底轮(生存)',
      '脐轮(情感)',
      '太阳轮(意志)',
      '心轮(爱)',
      '喉轮(表达)',
      '眉心轮(直觉)',
      '顶轮(灵性)',
    ],
    cardCount: 7,
    defaultQuestions: [
      '我的身心灵状态如何？',
      '如何平衡我的各个脉轮能量？',
      '我的能量阻塞在哪里？',
      '如何提升我的整体能量状态？',
      '我的灵性成长方向是什么？',
      '如何实现内在的和谐统一？',
      '我需要在哪个层面加强修炼？',
    ],
  },
  year: {
    name: '年运牌阵',
    description:
      '专为年度运势分析设计的综合牌阵，全面预测一整年的发展趋势，涵盖爱情、事业、财运、健康等各个方面',
    positions: [
      '整体运势',
      '1-3月',
      '4-6月',
      '7-9月',
      '10-12月',
      '爱情',
      '事业',
      '财运',
      '健康',
      '建议',
      '挑战',
      '机遇',
    ],
    cardCount: 12,
    defaultQuestions: [
      '我今年的整体运势如何？',
      '新的一年我应该关注什么？',
      '今年我的爱情和事业会如何发展？',
      '今年我会遇到什么机遇和挑战？',
      '如何让今年过得更加顺利？',
      '今年我的财运状况如何？',
      '今年我需要特别注意什么？',
    ],
  },
  mindBodySpirit: {
    name: '身心灵牌阵',
    description: '检视个人在思想、情感和精神层面的状态，找到内在平衡与和谐。',
    positions: ['心灵/思想', '身体/行动', '精神/灵性'],
    cardCount: 3,
    defaultQuestions: [
      '我当前的身心灵状态如何？',
      '我需要在哪个层面进行调整？',
      '如何获得内在的平衡？',
      '我的思想、行动和灵性是否一致？',
    ],
  },
  horseshoe: {
    name: '马蹄铁牌阵',
    description: '对特定问题提供一个全面的概述，涵盖过去、现在、未来、建议和最终结果等七个方面。',
    positions: [
      '过去的影响',
      '现在的状况',
      '未来的发展',
      '给你的建议',
      '环境的影响',
      '你的希望与恐惧',
      '最终的结果',
    ],
    cardCount: 7,
    defaultQuestions: [
      '关于[某件事]，我需要知道些什么？',
      '这个状况的全面分析是怎样的？',
      '我应该如何应对当前的挑战？',
      '这个决定的最终结果会是什么？',
    ],
  },
};

// 三牌抽取 - 与原项目sp.js完全一致
function drawThreeCards() {
  const shuffled = shuffleCards();
  const cards = [];
  const positions = ['过去', '现在', '未来'];

  for (let i = 0; i < 3; i++) {
    const card = shuffled[i];
    const isReversed = Math.random() < 0.5; // 50% 概率逆位，符合正常逻辑

    cards.push({
      card: card,
      isReversed: isReversed,
      position: positions[i],
    });
  }

  return {
    cards: cards,
    timestamp: Date.now(),
  };
}

// 通用牌阵抽取函数
export function drawSpreadCards(spreadType: keyof typeof tarotSpreads) {
  const spread = tarotSpreads[spreadType];
  if (!spread) {
    throw new Error(`未知的牌阵类型: ${spreadType}`);
  }

  const shuffled = shuffleCards();
  const cards = [];

  for (let i = 0; i < spread.cardCount; i++) {
    const card = shuffled[i];
    const isReversed = Math.random() < 0.5; // 50% 概率逆位

    cards.push({
      card: card,
      isReversed: isReversed,
      position: spread.positions[i],
    });
  }

  return {
    spreadType,
    spreadName: spread.name,
    cards: cards,
    timestamp: Date.now(),
  };
}

// 获取塔罗牌名称（包含正逆位）
function getCardDisplayName(card: { name: string }, isReversed: boolean) {
  return isReversed ? `${card.name}（逆位）` : card.name;
}

// 获取牌阵的默认问题
function getSpreadDefaultQuestions(spreadType: keyof typeof tarotSpreads): string[] {
  const spread = tarotSpreads[spreadType];
  return spread?.defaultQuestions || [];
}

// 随机获取一个默认问题
function getRandomDefaultQuestion(spreadType: keyof typeof tarotSpreads): string {
  const questions = getSpreadDefaultQuestions(spreadType);
  if (questions.length === 0) return '';
  return questions[Math.floor(Math.random() * questions.length)];
}

// 获取塔罗牌关键词
export function getCardKeywords(cardName: string): string {
  const keywordsMap: Record<string, string> = {
    // 大阿卡纳关键词
    愚者: '新开始,冒险,纯真',
    魔术师: '意志力,创造,技能',
    女祭司: '直觉,神秘,内在智慧',
    女皇: '丰饶,母性,创造力',
    皇帝: '权威,稳定,父性',
    教皇: '传统,精神指导,宗教',
    恋人: '爱情,选择,和谐',
    战车: '胜利,意志力,控制',
    力量: '勇气,耐心,内在力量',
    隐士: '内省,寻找,智慧',
    命运之轮: '命运,变化,循环',
    正义: '公正,平衡,真理',
    倒吊人: '牺牲,等待,新视角',
    死神: '转变,结束,重生',
    节制: '平衡,耐心,调和',
    恶魔: '诱惑,束缚,物质',
    塔: '突变,破坏,启示',
    星星: '希望,灵感,指引',
    月亮: '幻象,恐惧,潜意识',
    太阳: '成功,喜悦,活力',
    审判: '重生,觉醒,宽恕',
    世界: '完成,成就,圆满',

    // 小阿卡纳关键词（简化版）
    权杖王牌: '新机会,创造力,灵感',
    权杖二: '计划,未来,个人力量',
    权杖三: '扩张,远见,领导力',
    权杖四: '庆祝,和谐,家庭',
    权杖五: '冲突,竞争,分歧',
    权杖六: '胜利,公众认可,进步',
    权杖七: '挑战,坚持,防御',
    权杖八: '快速行动,急速,消息',
    权杖九: '坚韧,毅力,最后防线',
    权杖十: '负担,责任,努力',
    权杖侍者: '热情,探索,信使',
    权杖骑士: '能量,激情,行动',
    权杖王后: '自信,魅力,独立',
    权杖国王: '领导力,远见,权威',

    // 圣杯牌组
    圣杯王牌: '新感情,爱,创造力',
    圣杯二: '结合,伙伴,吸引',
    圣杯三: '庆祝,友谊,社群',
    圣杯四: '冷漠,沉思,重评',
    圣杯五: '失落,悲伤,失望',
    圣杯六: '怀旧,童年,重逢',
    圣杯七: '幻想,选择,白日梦',
    圣杯八: '放弃,前行,寻找',
    圣杯九: '满足,愿望成真,舒适',
    圣杯十: '和谐,家庭,幸福',
    圣杯侍者: '创意,直觉,信使',
    圣杯骑士: '浪漫,魅力,想象',
    圣杯王后: '同情,平静,直觉',
    圣杯国王: '情绪成熟,控制,慈悲',

    // 宝剑牌组
    宝剑王牌: '清晰,真理,新想法',
    宝剑二: '僵局,逃避,艰难选择',
    宝剑三: '心碎,悲伤,真相',
    宝剑四: '休息,休战,沉思',
    宝剑五: '冲突,失败,不光彩的胜利',
    宝剑六: '过渡,前行,解脱',
    宝剑七: '欺骗,策略,不诚实',
    宝剑八: '限制,孤立,自我束缚',
    宝剑九: '焦虑,噩梦,恐惧',
    宝剑十: '终结,背叛,谷底',
    宝剑侍者: '好奇,警惕,信使',
    宝剑骑士: '野心,仓促,行动',
    宝剑王后: '独立,清晰,智慧',
    宝剑国王: '权威,真理,智力',

    // 钱币牌组
    钱币王牌: '机会,繁荣,新事业',
    钱币二: '平衡,适应,变化',
    钱币三: '团队合作,技艺,品质',
    钱币四: '占有,控制,稳定',
    钱币五: '贫困,逆境,孤立',
    钱币六: '慷慨,慈善,分享',
    钱币七: '耐心,投资,回报',
    钱币八: '技能,勤奋,精通',
    钱币九: '富足,独立,享受',
    钱币十: '财富,传承,家庭',
    钱币侍者: '新机会,学习,梦想',
    钱币骑士: '勤奋,可靠,责任',
    钱币王后: '务实,母性,滋养',
    钱币国王: '富裕,成功,安全',
  };

  return keywordsMap[cardName] || '神秘,指引,启示';
}

// 保持ES模块导出，移除全局window导出
// 在现代Vue.js应用中，应通过模块导入方式使用这些函数
