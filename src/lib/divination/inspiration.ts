import type { DivinationDraft } from './engine';

type DivinationInspirationTabId =
  | 'spread'
  | 'ganqing'
  | 'shiye'
  | 'caifu'
  | 'renji'
  | 'rensheng';

export type DivinationInspirationTab = {
  id: Exclude<DivinationInspirationTabId, 'spread'>;
  label: string;
};

export type DivinationInspirationSection = {
  heading: string;
  questions: string[];
};

export const DIVINATION_INSPIRATION_TABS: DivinationInspirationTab[] = [
  { id: 'ganqing', label: '感情' },
  { id: 'shiye', label: '事业' },
  { id: 'caifu', label: '财富' },
  { id: 'renji', label: '人际' },
  { id: 'rensheng', label: '成长' },
];

export const DIVINATION_INSPIRATION_CONTENT: Record<
  DivinationInspirationTab['id'],
  DivinationInspirationSection[]
> = {
  ganqing: [
    {
      heading: '情感发展',
      questions: [
        '我近期的桃花运怎么样？',
        '我们目前的感情走向如何？',
        '他/她对我的真实情感是什么？',
        '我们之间有未来吗？',
        '如何改善我们目前的关系？',
        '这段感情对我的影响？',
      ],
    },
    {
      heading: '正缘婚姻',
      questions: [
        '我的正缘什么时候出现？',
        '我的另一半是什么样的人？',
        '我何时会结婚？',
        '我适合和现在的对象结婚吗？',
        '我的婚姻生活会幸福吗？',
        '如何吸引我的正缘桃花？',
      ],
    },
    {
      heading: '关系难题',
      questions: [
        '我们之间出了什么问题？',
        '如何解决现在的感情危机？',
        '我们有机会复合吗？',
        '我应该放弃这段感情吗？',
        '我和Ta的缘分有多深？',
        '我的灵魂伴侣有什么特征？',
      ],
    },
  ],
  shiye: [
    {
      heading: '事业发展',
      questions: [
        '我适合现在的工作/行业吗？',
        '我的事业什么时候能成功？',
        '我适合跳槽还是继续坚守？',
        '我事业上的贵人会是谁？',
        '我未来的事业走向怎么样？',
        '我什么时候能找到满意的工作？',
      ],
    },
    {
      heading: '职场机遇',
      questions: [
        '我今年有机会升职加薪吗？',
        '如何得到领导的赏识和重用？',
        '我在公司的发展前景如何？',
        '如何改善当前的工作状态？',
        '我最近的职场人际运如何？',
      ],
    },
    {
      heading: '创业之路',
      questions: [
        '我适合创业吗？',
        '我的创业最佳时机是什么时候？',
        '我该和什么样的人合伙？',
        '我的创业项目前景如何？',
        '创业过程中需要注意哪些风险？',
        '我的创业会成功吗？',
      ],
    },
  ],
  caifu: [
    {
      heading: '财运趋势',
      questions: [
        '我近期的财运怎么样？',
        '我这辈子财运的整体趋势？',
        '我什么时候能发财？',
        '我适合靠什么方式赚钱？',
        '如何有效提升我的财运？',
        '我近期会有意外之财吗？',
      ],
    },
    {
      heading: '投资理财',
      questions: [
        '我适合做投资吗？',
        '我应该选择什么样的投资方向？',
        '这个投资项目能赚钱吗？',
        '如何才能守住我的财富？',
        '我的投资风险大吗？',
        '如何更好地管理我的财富？',
      ],
    },
    {
      heading: '财务状况',
      questions: [
        '我为什么总是存不住钱？',
        '是什么原因导致我财务紧张？',
        '我最近会有破财风险吗？',
        '如何避免不必要的财务损失？',
        '我需要注意哪些年份的破财？',
        '我该如何处理我的债务问题？',
      ],
    },
  ],
  renji: [
    {
      heading: '社交模式',
      questions: [
        '我的人际交往模式有何优缺点？',
        '如何拓展我的高质量社交圈？',
        '我目前的人际关系状态如何？',
        '我会吸引哪些人进入我的生活？',
        '如何获得他人的信任与支持？',
        '如何处理与朋友的矛盾？',
      ],
    },
    {
      heading: '贵人善缘',
      questions: [
        '什么样的朋友是我的贵人？',
        '我应该远离什么样的朋友？',
        '如何结交更多志同道合的朋友？',
        '我该如何维系重要的友谊？',
        '我该信任我身边的朋友吗？',
        '如何获得领导或长辈的赏识？',
      ],
    },
    {
      heading: '家庭关系',
      questions: [
        '我和家人的关系怎么样？',
        '我的家庭对我有什么样的影响？',
        '如何改善我与家人的关系？',
        '我该如何处理家庭矛盾？',
        '我与家人的缘分有多深？',
        '如何更好地与家人沟通？',
      ],
    },
  ],
  rensheng: [
    {
      heading: '学业规划',
      questions: [
        '我的学业运势如何？',
        '我适合考研/考公吗？',
        '我适合继续深造还是工作？',
        '如何提升我的学习效率？',
        '我该选择哪个专业/学校？',
        '我这次考试能通过吗？',
      ],
    },
    {
      heading: '个人成长',
      questions: [
        '我的性格优势和劣势是什么？',
        '我的人生主要课题是什么？',
        '如何找到我的人生方向？',
        '如何克服我性格中的弱点？',
        '如何有效提升自己的能量状态？',
        '我的人生转折点在何时？',
      ],
    },
    {
      heading: '人生机遇',
      questions: [
        '我未来十年的人生大运怎么样？',
        '我该如何实现我的人生目标？',
        '我的人生会有什么重大机遇？',
        '我应该注意哪些健康问题？',
        '如何才能活出更精彩的人生？',
        '未来的人生之路走向如何？',
      ],
    },
  ],
};

export const TAROT_SPREAD_INSPIRATION_QUESTIONS: Record<
  DivinationDraft['tarotSpread'],
  string[]
> = {
  single: [
    '今天我需要关注什么？',
    '我现在最需要的指引是什么？',
    '宇宙想要告诉我什么？',
    '我应该如何面对当前的困惑？',
    '今日的能量指引',
  ],
  three: [
    '我的人生发展趋势如何？',
    '这个问题的来龙去脉是什么？',
    '我的过去如何影响现在和未来？',
    '我应该如何规划接下来的发展？',
    '时间会如何改变我的处境？',
  ],
  love: [
    '我和TA的感情会如何发展？',
    'TA对我的真实想法是什么？',
    '我们的关系现在处于什么状态？',
    '如何改善我们之间的关系？',
    '我的感情生活会有什么变化？',
    '我应该如何表达我的感情？',
    '这段关系值得我继续投入吗？',
    '我们之间的问题如何解决？',
  ],
  career: [
    '我的事业发展前景如何？',
    '我应该换工作吗？',
    '如何在职场中获得更好的发展？',
    '我的职业规划应该如何调整？',
    '这个工作机会适合我吗？',
    '如何提升我的职场竞争力？',
    '我的事业瓶颈如何突破？',
    '什么时候是跳槽的最佳时机？',
  ],
  decision: [
    '我应该选择A还是B？',
    '这两个选择哪个更适合我？',
    '我应该接受这个 offer 吗？',
    '搬家还是留在原地？',
    '继续这段关系还是分手？',
    '创业还是继续打工？',
    '出国还是留在国内发展？',
    '现在投资还是继续观望？',
  ],
};

export function getDefaultDivinationInspirationTab(
  method: DivinationDraft['method'],
): DivinationInspirationTabId {
  return method === 'tarot' ? 'spread' : 'ganqing';
}

export function isDivinationInspirationTabVisible(
  tabId: DivinationInspirationTabId,
  draft: DivinationDraft,
) {
  if (tabId === 'spread') {
    return draft.method === 'tarot';
  }

  return true;
}
