export interface ClimateRule {
  id: string;
  label: string;
  description: string;
  priority?: number;
  yearStems?: string[];
  months: string[];
  hourBranches?: string[];
  dayMasters: string[];
  dayStems?: string[];
  currentJieqi?: string[];
  requiredVisibleStems?: string[];
  optionalVisibleStems?: string[];
  forbiddenVisibleStems?: string[];
  requiredVisibleStemPillarPairs?: Array<{
    stem: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  optionalVisibleStemPillarPairs?: Array<{
    stem: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  forbiddenVisibleStemPillarPairs?: Array<{
    stem: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  requiredVisibleStemBranchPairs?: Array<{
    stem: string;
    branch: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  optionalVisibleStemBranchPairs?: Array<{
    stem: string;
    branch: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  forbiddenVisibleStemBranchPairs?: Array<{
    stem: string;
    branch: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  requiredVisibleStemDistancePairs?: Array<{
    stems: [string, string];
    minDistance?: number;
    maxDistance?: number;
    leftPillars?: Array<'year' | 'month' | 'day' | 'hour'>;
    rightPillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  forbiddenVisibleStemDistancePairs?: Array<{
    stems: [string, string];
    minDistance?: number;
    maxDistance?: number;
    leftPillars?: Array<'year' | 'month' | 'day' | 'hour'>;
    rightPillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  minVisibleStemCounts?: Record<string, number>;
  maxVisibleStemCounts?: Record<string, number>;
  requiredHiddenStems?: string[];
  optionalHiddenStems?: string[];
  forbiddenHiddenStems?: string[];
  requiredBranchPillarPairs?: Array<{
    branch: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  optionalBranchPillarPairs?: Array<{
    branch: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  forbiddenBranchPillarPairs?: Array<{
    branch: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  requiredHiddenStemBranchPairs?: Array<{
    branch: string;
    stem: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  optionalHiddenStemBranchPairs?: Array<{
    branch: string;
    stem: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  forbiddenHiddenStemBranchPairs?: Array<{
    branch: string;
    stem: string;
    pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  }>;
  minHiddenStemCounts?: Record<string, number>;
  maxHiddenStemCounts?: Record<string, number>;
  minStemTotalCounts?: Record<string, number>;
  maxStemTotalCounts?: Record<string, number>;
  distinctStemGroupCounts?: Array<{
    stems: string[];
    minDistinctCount?: number;
    maxDistinctCount?: number;
    scope?: 'visible' | 'hidden' | 'total';
  }>;
  requiredFormationWuxings?: string[];
  requiredFormationTenGodCategories?: string[];
  optionalFormationTenGodCategories?: string[];
  forbiddenFormationTenGodCategories?: string[];
  minCompanionVisibleCount?: number;
  maxCompanionVisibleCount?: number;
  minWuxingCounts?: Record<string, number>;
  maxWuxingCounts?: Record<string, number>;
  minTenGodCategoryVisibleCounts?: Record<string, number>;
  maxTenGodCategoryVisibleCounts?: Record<string, number>;
  minTenGodCategoryHiddenCounts?: Record<string, number>;
  maxTenGodCategoryHiddenCounts?: Record<string, number>;
  minTenGodCategoryTotalCounts?: Record<string, number>;
  maxTenGodCategoryTotalCounts?: Record<string, number>;
  minTenGodCategoryVisibleDistinctCounts?: Record<string, number>;
  maxTenGodCategoryVisibleDistinctCounts?: Record<string, number>;
  minTenGodCategoryTotalDistinctCounts?: Record<string, number>;
  maxTenGodCategoryTotalDistinctCounts?: Record<string, number>;
  usefulWuxing: string;
  favorableOrder?: string[];
  traceHints?: string[];
  hint: string;
}

export interface StrengthHintRule {
  id: string;
  label: string;
  description: string;
  priority?: number;
  strengths: string[];
  hint: string;
}

export interface TherapeuticPriorityRule {
  id: string;
  label: string;
  description: string;
  priority?: number;
  months: string[];
  strengths: string[];
  dayMasters?: string[];
  dayStems?: string[];
  useGeneratedElement: boolean;
}

export const CLIMATE_RULES: ClimateRule[] = [
  {
    id: 'chou-month-gui-gui-ji-party-night-ding',
    label: '癸日丑月癸己会党夜丁规则',
    description: '癸水生丑月，若癸己成党而年干透丁，且夜生得雪后灯光之象，传统多主贵显，不应仍按普通冬水调候一概论之。',
    priority: 128,
    yearStems: ['丁'],
    months: ['丑'],
    hourBranches: ['酉', '戌', '亥', '子', '丑', '寅'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    minStemTotalCounts: { '癸': 2, '己': 1 },
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['取用层次:癸己会党，年透丁火', '成格层次:雪后灯光，夜生可贵'],
    hint: '癸水丑月癸己会党而年透丁火，夜生可取雪后灯光之贵'
  },
  {
    id: 'chou-month-gui-gui-ji-party-no-ding',
    label: '癸日丑月癸己会党无丁孤贫规则',
    description: '癸水生丑月，若癸己成党而局中不见丁火，传统多断孤贫，不宜仍按雪后灯光格抬高层次。',
    priority: 127,
    months: ['丑'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    minStemTotalCounts: { '癸': 2, '己': 1 },
    forbiddenVisibleStems: ['丁'],
    forbiddenHiddenStems: ['丁'],
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:癸己会党无丁', '成格层次:无丁火，多主孤贫'],
    hint: '癸水丑月癸己会党而无丁火，多主孤贫'
  },
  {
    id: 'chou-month-gui-water-formation-no-bing',
    label: '癸日丑月支成水局无丙漂泊规则',
    description: '癸水生丑月，若地支会成水局而局中又无丙火解冻，传统多断四海为家、一生劳苦，不宜仍按普通冬水得火即吉概论。',
    priority: 126,
    months: ['丑'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredFormationTenGodCategories: ['比劫'],
    forbiddenVisibleStems: ['丙'],
    forbiddenHiddenStems: ['丙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:支成水局无丙', '成格层次:四海为家，一生劳苦'],
    hint: '癸水丑月支成水局而无丙火，多主四海漂泊，劳苦奔波'
  },
  {
    id: 'chou-month-gui-fire-formation-metal-support',
    label: '癸日丑月支成火局见金规则',
    description: '癸水生丑月，若地支会成火局，火旺耗水；此时庚辛金透，方能生扶癸水，传统多主衣食充足，不应仍按单纯冬水喜火论。',
    priority: 125,
    months: ['丑'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredFormationTenGodCategories: ['财星'],
    minTenGodCategoryVisibleCounts: { '印星': 1 },
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    traceHints: ['取用层次:支成火局，金透辅救', '成格层次:衣食充足'],
    hint: '癸水丑月支成火局而庚辛透干，可得衣食充足'
  },
  {
    id: 'chou-month-gui-fire-formation-no-metal',
    label: '癸日丑月支成火局无金孤苦规则',
    description: '癸水生丑月，若地支会成火局而庚辛不透，则火旺水竭，传统多断孤苦零丁，不宜误提到见金可救的层次。',
    priority: 124,
    months: ['丑'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredFormationTenGodCategories: ['财星'],
    maxTenGodCategoryVisibleCounts: { '印星': 0 },
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    traceHints: ['破格因素:支成火局无金透', '成格层次:孤苦零丁'],
    hint: '癸水丑月支成火局而无金透，多主孤苦零丁'
  },
  {
    id: 'wu-wei-month-gui-metal-water-summer-rich',
    label: '癸日午未月金水会夏天规则',
    description: '癸水生午未月，本弱而畏火，若庚辛透干又见壬癸相扶，正合传统"金水会夏天"之论，多主富贵，不应仍按普通夏水身弱泛断。',
    priority: 123,
    months: ['午', '未'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    minTenGodCategoryVisibleCounts: { '印星': 1, '比劫': 1 },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:金水会夏天', '成格层次:富贵永无边'],
    hint: '癸水午未月庚辛透而又见壬癸，可按金水会夏天论富贵'
  },
  {
    id: 'wu-month-gui-metal-no-visible-water-single-water-rich',
    label: '癸日午月无水透而支只一水规则',
    description: '癸水生午月，若庚辛透干而天干不见壬癸，局中总水气又只一分，传统多断"一富之造"，富重贵轻，不应仍与金水会夏天的钟鼎名家同层并论。',
    priority: 124,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    forbiddenFormationTenGodCategories: ['财星'],
    minTenGodCategoryVisibleCounts: { '印星': 1 },
    maxTenGodCategoryVisibleCounts: { '比劫': 0 },
    minWuxingCounts: { '水': 1 },
    maxWuxingCounts: { '水': 1 },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:庚辛透干，支只一水', '成格层次:一富之造，富重贵轻'],
    hint: '癸水午月无水透而支只一水，虽有庚辛，多主富重贵轻'
  },
  {
    id: 'wu-month-gui-fire-formation-no-ren-monastic',
    label: '癸日午月炎局无壬僧道规则',
    description: '癸水生午月，若地支火局已成而天干不见壬水，传统多断僧道之流；此为炎局伤水之象，不应仍按普通夏水金水并用泛论。',
    priority: 123,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredFormationTenGodCategories: ['财星'],
    forbiddenVisibleStems: ['壬'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:支成炎局，无壬出干', '成格层次:定主僧道'],
    hint: '癸水午月支成炎局而无壬出干，多主僧道之流'
  },
  {
    id: 'wu-month-gui-fire-formation-two-ren-one-geng',
    label: '癸日午月炎局二壬一庚规则',
    description: '癸水生午月，若地支火局已成，但天干二壬一庚同透，则金水足以反制炎势，传统多主衣锦腰金，不应仍按炎局无壬的僧道层次处理。',
    priority: 125,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredFormationTenGodCategories: ['财星'],
    minVisibleStemCounts: { '壬': 2, '庚': 1 },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:炎局中二壬一庚同透', '成格层次:衣锦腰金'],
    hint: '癸水午月虽支成炎局，但二壬一庚同透，仍可衣锦腰金'
  },
  {
    id: 'wu-month-gui-ji-pure-follow-kill',
    label: '癸日午月一派己土从杀规则',
    description: '癸水生午月，若局中己土成势而不混戊土，又无印比扶身，亦无甲木出制，传统多作从杀而论，反主大贵。此类须纯而不杂，稍见破格之神，便不可仍按从杀高断。',
    priority: 126,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    minStemTotalCounts: { '己': 3 },
    distinctStemGroupCounts: [
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'total'
      }
    ],
    forbiddenVisibleStems: ['甲'],
    maxTenGodCategoryTotalCounts: { '比劫': 0, '印星': 0, '食伤': 0 },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['取用层次:一派己土，无甲出制', '成格层次:作从杀而论，又主大贵'],
    hint: '癸水午月一派己土而无甲出制，可作从杀格看'
  },
  {
    id: 'wei-month-gui-xiaoshu-metal-water-rich',
    label: '癸日未月小暑后庚辛比劫同扶规则',
    description: '癸水生未月上半月，小暑后庚辛休囚，传统谓必须庚辛透干，又得比劫扶身，方可言富贵；不应仍与下半月庚辛有气同断。',
    priority: 126,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    currentJieqi: ['小暑'],
    minTenGodCategoryVisibleCounts: { '印星': 1 },
    minTenGodCategoryTotalCounts: { '比劫': 1 },
    maxStemTotalCounts: { '丁': 0 },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:小暑后庚辛休囚，须比劫助身', '成格层次:可云富贵'],
    hint: '癸水未月小暑后庚辛透干且比劫扶身，可作富贵看'
  },
  {
    id: 'wei-month-gui-dashu-metal-rich',
    label: '癸日未月大暑后庚辛有气规则',
    description: '癸水生未月下半月，大暑后庚辛有气，传统谓即无比劫亦可；只要庚辛得用而无丁火破局，便不应仍拘于上半月必须比劫同扶的条件。',
    priority: 125,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    currentJieqi: ['大暑'],
    minTenGodCategoryVisibleCounts: { '印星': 1 },
    maxStemTotalCounts: { '丁': 0 },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:大暑后庚辛有气，即无比劫亦可', '成格层次:可云富贵'],
    hint: '癸水未月大暑后庚辛有气，即无比劫亦可论富贵'
  },
  {
    id: 'wei-month-gui-ding-break-metal',
    label: '癸日未月丁火破金不吉规则',
    description: '癸水生未月，无论上半月或下半月，传统都忌丁火透出；即便丁火藏支亦不吉。若庚辛本可为用而又见丁，则不应仍按金水会夏天或庚辛有气上断。',
    priority: 127,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    minTenGodCategoryVisibleCounts: { '印星': 1 },
    minStemTotalCounts: { '丁': 1 },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['破格因素:丁火出现，破伤庚辛', '成格层次:丁在干支，均属不吉'],
    hint: '癸水未月庚辛为用而见丁火，多主破局不吉'
  },
  {
    id: 'wu-month-gui-metal-stem-water-formation',
    label: '癸日午月金透水局挂名规则',
    description: '癸水生午月，若庚辛透而地支又成申子辰水局，传统多主金榜挂名；此类是印比得势，不应退回普通夏水扶抑。',
    priority: 122,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    minTenGodCategoryVisibleCounts: { '印星': 1 },
    requiredFormationTenGodCategories: ['比劫'],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:金透水局', '成格层次:金榜挂名'],
    hint: '癸水午月金透而支成水局，可主金榜挂名'
  },
  {
    id: 'mao-month-ji-follow-kill-no-resource',
    label: '己日卯月无比印从杀贵规则',
    description: '己土生卯月，木势偏盛而比劫印星明暗皆不见时，传统有"无比印，从杀者贵"之论，不宜仍按普通春土调候一概处理。',
    priority: 124,
    months: ['卯'],
    dayMasters: ['土'],
    dayStems: ['己'],
    minWuxingCounts: { '木': 4 },
    maxTenGodCategoryVisibleCounts: { '比劫': 0, '印星': 0 },
    maxTenGodCategoryHiddenCounts: { '比劫': 0, '印星': 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:木旺成势，明暗无比印', '成格层次:无比印，从杀者贵'],
    hint: '己土卯月木势偏盛而明暗无比印，可作从杀贵论'
  },
  {
    id: 'chen-month-wu-officer-party-geng',
    label: '戊日辰月官杀会党得庚规则',
    description: '戊土生辰月，若地支木局已成，天干又甲乙并透，属于官杀会党；此时得庚金出干扫除官杀，传统多主富贵，不应仍按普通春土或从杀泛断。',
    priority: 126,
    months: ['辰'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredFormationWuxings: ['木'],
    requiredFormationTenGodCategories: ['官杀'],
    requiredVisibleStems: ['庚'],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '乙'],
        minDistinctCount: 2,
        scope: 'total'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    traceHints: ['取用层次:官杀会党，庚金扫杀', '成格层次:得庚透，亦主富贵'],
    hint: '戊土辰月支成木局且甲乙并透，得庚可扫官杀而主富贵'
  },
  {
    id: 'chen-month-wu-officer-party-no-geng',
    label: '戊日辰月官杀会党无庚浅薄规则',
    description: '戊土生辰月，若地支木局已成且甲乙并透，而庚金不出，则官杀会党无去留之义，传统多断浅薄之人，不宜仍按得庚扫杀之富贵格看待。',
    priority: 125,
    months: ['辰'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredFormationWuxings: ['木'],
    requiredFormationTenGodCategories: ['官杀'],
    forbiddenVisibleStems: ['庚'],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '乙'],
        minDistinctCount: 2,
        scope: 'total'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    traceHints: ['破格因素:官杀会党无庚', '成格层次:无庚乃浅薄之人'],
    hint: '戊土辰月支成木局而甲乙并透，若无庚多主浅薄'
  },
  {
    id: 'zi-month-ding-follow-kill-broken-by-companion',
    label: '丁日子月从杀见比破格规则',
    description: '丁火生子月，若水多癸旺而本金无比印可从杀，但再见丁火比肩出干，传统即谓难合格局，只作常人，不可仍按弃命从杀高断。',
    priority: 127,
    months: ['子'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['癸', '庚'],
    minWuxingCounts: { '水': 5, '金': 2 },
    minVisibleStemCounts: { '丁': 2 },
    maxTenGodCategoryTotalCounts: { '印星': 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    traceHints: ['破格因素:丁比出干', '成格层次:难合格局，常人'],
    hint: '丁火子月水旺癸强而见丁比出干，多难合从杀格'
  },
  {
    id: 'zi-month-ding-follow-kill-water-prosper',
    label: '丁日子月水旺从杀规则',
    description: '丁火生子月，若水多癸旺而金神相随，明暗又无比劫印星牵绊，传统多按弃命从杀看，亦主异途功名，不应仍停留在普通冬丁甲庚调候。',
    priority: 126,
    months: ['子'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['癸', '庚'],
    minWuxingCounts: { '水': 5, '金': 2 },
    maxTenGodCategoryTotalCounts: { '比劫': 0, '印星': 0 },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:水旺癸强，金神相随', '成格层次:弃命从杀，异途功名'],
    hint: '丁火子月水多癸旺而金无比印，可按弃命从杀看'
  },
  {
    id: 'spring-wood-fire-warm',
    label: '春木丙丁温扶规则',
    description: '寅卯辰月木旺而湿寒时，宜先取火温扶，使其发生条达。',
    priority: 101,
    months: ['寅', '卯', '辰'],
    dayMasters: ['木'],
    usefulWuxing: '火',
    hint: '春木湿寒，宜火暖扶发生机'
  },
  {
    id: 'yin-mao-month-wu-no-geng-no-resource-follow-kill-fail',
    label: '戊日寅卯月无庚无比印难从杀规则',
    description: '戊土生寅卯月，木势偏盛时常以庚金为先；若木多而庚金不透，且天干又无比劫、印星扶身，传统多断难作从杀，主遭凶困顿，不宜仍按可从之局泛论。',
    priority: 123,
    months: ['寅', '卯'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    forbiddenVisibleStems: ['庚'],
    minWuxingCounts: { '木': 4 },
    minTenGodCategoryVisibleCounts: { '官杀': 2 },
    maxTenGodCategoryVisibleCounts: { '比劫': 0, '印星': 0 },
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    traceHints: ['破格因素:无庚且无比印', '成格层次:难作从杀，定主遭凶'],
    hint: '戊土寅卯月木多而无庚且无比印，难作从杀'
  },
  {
    id: 'chen-month-wu-follow-kill',
    label: '戊日辰月木多无比印从杀规则',
    description: '戊土生辰月，若官杀木气成势，天干又无比劫、印星透出牵制，传统多可按从杀论，层次反主富贵，不应仍拘于春土暖燥之常法。',
    priority: 124,
    months: ['辰'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    forbiddenVisibleStems: ['庚'],
    minWuxingCounts: { '木': 4 },
    minTenGodCategoryVisibleCounts: { '官杀': 2 },
    maxTenGodCategoryVisibleCounts: { '比劫': 0, '印星': 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:官杀成势，无比印透', '成格层次:作从杀而论，亦主富贵'],
    hint: '戊土辰月木多而无比印透，可按从杀格看'
  },
  {
    id: 'spring-earth-fire-dry',
    label: '春土丙丁燥湿规则',
    description: '寅卯辰月土湿泥重时，宜先取火暖土燥湿以培基。',
    priority: 100,
    months: ['寅', '卯', '辰'],
    dayMasters: ['土'],
    usefulWuxing: '火',
    hint: '春土湿滞，宜火暖燥湿培土'
  },
  {
    id: 'summer-wood-fire-cool',
    label: '夏月清润调候规则',
    description: '巳午未月木火偏燥时，先取水以润燥降温。',
    priority: 100,
    months: ['巳', '午', '未'],
    dayMasters: ['火', '木'],
    usefulWuxing: '水',
    hint: '燥热偏盛，宜先润燥降温'
  },
  {
    id: 'winter-water-wood-warm',
    label: '冬月温养调候规则',
    description: '亥子丑月水木偏寒时，先取火以温暖扶阳。',
    priority: 100,
    months: ['亥', '子', '丑'],
    dayMasters: ['水', '木'],
    usefulWuxing: '火',
    hint: '寒湿偏盛，宜先温暖扶阳'
  },
  {
    id: 'winter-fire-wood-rescue',
    label: '冬火扶木救应规则',
    description: '亥子丑月火体衰绝，宜先取木生扶以救应火源。',
    priority: 110,
    months: ['亥', '子', '丑'],
    dayMasters: ['火'],
    usefulWuxing: '木',
    hint: '冬火体绝，宜木生扶救应'
  },
  {
    id: 'winter-metal-fire-temper',
    label: '冬金丙丁锻炼规则',
    description: '亥子丑月金寒水冷，宜先取火温养锻炼。',
    priority: 105,
    months: ['亥', '子', '丑'],
    dayMasters: ['金'],
    usefulWuxing: '火',
    hint: '金寒水冷，宜火温养锻炼'
  },
  {
    id: 'summer-metal-water-wash',
    label: '夏金壬癸洗淘规则',
    description: '巳午未月金逢火烈，宜先取水洗淘降温。',
    priority: 102,
    months: ['巳', '午', '未'],
    dayMasters: ['金'],
    usefulWuxing: '水',
    hint: '火烈金燥，宜水洗淘降温'
  },
  {
    id: 'winter-earth-fire-thaw',
    label: '冬土丙丁暖局规则',
    description: '亥子丑月土寒湿冻，宜先取火暖土解冻。',
    priority: 101,
    months: ['亥', '子', '丑'],
    dayMasters: ['土'],
    usefulWuxing: '火',
    hint: '土寒湿冻，宜火暖土解冻'
  },
  {
    id: 'autumn-wood-water-moisten',
    label: '秋木壬癸润燥规则',
    description: '申酉戌月木气枯燥时，宜先取水润木滋养。',
    priority: 103,
    months: ['申', '酉', '戌'],
    dayMasters: ['木'],
    usefulWuxing: '水',
    hint: '秋木燥枯，宜水润滋养'
  },
  {
    id: 'you-month-jia-fire-forge',
    label: '甲日酉月丁火为先规则',
    description: '甲木生酉月，木囚金旺，常以丁火为先，次取丙火，先求制金暖木，不宜泛以润木之水概论。',
    priority: 120,
    months: ['酉'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    hint: '甲木酉月，先取丁火制金暖木'
  },
  {
    id: 'yin-month-jia-bing-gui',
    label: '甲日寅月丙癸并用规则',
    description: '甲木生寅月，初春余寒未尽，传统多取丙火为先、癸水次之，先暖后润，较泛化春木先火更细。',
    priority: 118,
    months: ['寅'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '甲木寅月，先丙后癸，温扶兼滋养'
  },
  {
    id: 'you-month-ren-jia-drain-soil',
    label: '壬日酉月甲木为先规则',
    description: '壬水生酉月，正金白水清，忌戊土浊塞，常先取甲木制土清源，再酌庚金相辅。',
    priority: 118,
    months: ['酉'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    hint: '壬水酉月，先取甲木制土清源'
  },
  {
    id: 'chen-month-jia-geng-first',
    label: '甲日辰月先庚后壬规则',
    description: '甲木生辰月，木气渐竭，传统多先取庚金裁木成器，次取壬水滋养，不宜仍按春木一概先火。',
    priority: 119,
    months: ['辰'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    hint: '甲木辰月，先取庚金裁木成器'
  },
  {
    id: 'chen-month-gui-qingming-bing-only',
    label: '癸日辰月清明后专丙规则',
    description: '癸水生辰月，清明后火气未炽，传统多专用丙火调和阴阳，不宜提前把辛甲并列为先。',
    priority: 122,
    months: ['辰'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    currentJieqi: ['清明'],
    usefulWuxing: '火',
    favorableOrder: ['火'],
    hint: '癸水辰月清明后，专用丙火调和'
  },
  {
    id: 'chen-month-gui-guyu-bing-xin-jia',
    label: '癸日辰月谷雨后丙辛甲并参规则',
    description: '癸水生辰月，谷雨后土气转重，传统仍以丙火为主，但需辛金、甲木参用，不宜仍按清明后单取丙火。',
    priority: 123,
    months: ['辰'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    currentJieqi: ['谷雨'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金', '木'],
    hint: '癸水辰月谷雨后，丙火为主，辛甲佐之'
  },
  {
    id: 'si-month-jia-gui-ding-geng',
    label: '甲日巳月先癸后丁规则',
    description: '甲木生巳月，丙火司权，传统以癸水为先，丁火次之，并借庚金佐助成材，不宜仍停留在单一润燥判断。',
    priority: 121,
    months: ['巳'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '金'],
    hint: '甲木巳月，先癸后丁，庚金佐助'
  },
  {
    id: 'wu-month-jia-gui-ding-geng',
    label: '甲日午月先癸后丁规则',
    description: '甲木生午月，木性虚焦，传统多先取癸水，次取丁火，庚金再辅，较夏木一概润燥更符合原法先后。',
    priority: 120,
    months: ['午'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '金'],
    hint: '甲木午月，先癸后丁，庚金次辅'
  },
  {
    id: 'wu-month-jia-no-gui-use-ding',
    label: '甲日午月无癸用丁规则',
    description: '甲木生午月，若原局不见癸水透干，传统许以丁火权代为先，不应仍机械固守先癸。',
    priority: 124,
    months: ['午'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    forbiddenVisibleStems: ['癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金', '水'],
    hint: '甲木午月无癸透，可先用丁火，再酌庚金'
  },
  {
    id: 'wei-month-jia-ding-geng',
    label: '甲日未月先丁后庚规则',
    description: '甲木生未月，丁火退气而木仍需裁成，传统多先丁火，次庚金，无癸亦可，不宜仍按午月同断。',
    priority: 119,
    months: ['未'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金', '水'],
    hint: '甲木未月，先丁后庚，癸水酌用'
  },
  {
    id: 'si-month-ren-water-self-support',
    label: '壬日巳月比肩为先规则',
    description: '壬水生巳月，火旺水弱，传统常先取壬水比肩扶助，再取辛庚发源，不宜直接泛化为金印为先。',
    priority: 117,
    months: ['巳'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    hint: '壬水巳月，先取比肩扶助元神'
  },
  {
    id: 'yin-month-yi-bing-gui',
    label: '乙日寅月先丙后癸规则',
    description: '乙木生寅月，初春仍寒，传统以丙火为先、癸水次之，使柔木得暖而不枯。',
    priority: 117,
    months: ['寅'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木寅月，先丙后癸'
  },
  {
    id: 'mao-month-yi-bing-gui',
    label: '乙日卯月丙癸君臣规则',
    description: '乙木生卯月，传统取丙为君、癸为臣，先泄秀后滋养，不宜只按春木泛论。',
    priority: 118,
    months: ['卯'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木卯月，丙为君，癸为臣'
  },
  {
    id: 'chen-month-yi-gui-bing',
    label: '乙日辰月先癸后丙规则',
    description: '乙木生辰月，阳气渐炽，传统以癸水为先、丙火次之，先滋后发，不宜仍按春木一律先火。',
    priority: 118,
    months: ['辰'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '乙木辰月，先癸后丙'
  },
  {
    id: 'zi-month-ding-jia-geng',
    label: '丁日子月甲庚并用规则',
    description: '丁火生子月，火体衰微，传统多以甲木为尊、庚金佐之，较"冬火只取木"更贴近原法。',
    priority: 116,
    months: ['子'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    hint: '丁火子月，甲木为尊，庚金佐之'
  },
  {
    id: 'you-month-ji-gui-bing',
    label: '己日酉月先癸后丙规则',
    description: '己土生酉月，秋燥渐寒，传统以癸水为先、丙火后之，兼有润燥制金之意。',
    priority: 116,
    months: ['酉'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '己土酉月，先癸后丙'
  },
  {
    id: 'yin-month-ren-geng-bing-wu',
    label: '壬日寅月庚丙戊次第规则',
    description: '壬水生寅月，失令而寒，传统多先取庚金发源，次取丙火除寒，再取戊土止流，较单用金水更完整。',
    priority: 121,
    months: ['寅'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '火', '土'],
    hint: '壬水寅月，先庚次丙，再酌戊土'
  },
  {
    id: 'wu-month-ren-gui-geng',
    label: '壬日午月癸庚并用规则',
    description: '壬水生午月，丁火当令，传统以癸水为用、庚金为佐，不宜仅按夏水泛化为比劫或印星。',
    priority: 118,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    hint: '壬水午月，取癸为用，庚金为佐'
  },
  {
    id: 'wu-month-yi-mangzhong-metal-water-fire-first',
    label: '乙日午月上半月金水重丙先规则',
    description: '乙木生午月上半月，本宜癸润；若原局金水偏多，则传统改以丙火为先，免金寒水冷困木。',
    priority: 124,
    months: ['午'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    currentJieqi: ['芒种'],
    minWuxingCounts: { '金': 2, '水': 2 },
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木午月上半月而金水偏多，丙火为先'
  },
  {
    id: 'wu-month-yi-xiazhi-bing-gui',
    label: '乙日午月下半月丙癸齐用规则',
    description: '乙木生午月下半月，传统以丙癸齐用，不应仍停留在单取癸水。',
    priority: 123,
    months: ['午'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    currentJieqi: ['夏至'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木午月下半月，丙癸齐用'
  },
  {
    id: 'si-wu-wei-month-ji-no-gui-ren-allowed',
    label: '己日夏月无癸有壬权代规则',
    description: '己土生夏月，最喜癸润；若无癸而壬透，传统亦可暂取壬水权代，不应退回普通扶抑。',
    priority: 121,
    months: ['巳', '午', '未'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['壬'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['取用层次:壬水权代', '成格层次:可用但不大发'],
    hint: '己土夏月无癸而壬透，可暂取壬水权代'
  },
  {
    id: 'si-month-bing-no-ren-use-gui',
    label: '丙日巳月无壬用癸规则',
    description: '丙火生巳月，原法专用壬水；若壬水不透而癸水透，亦可权代，但层次逊于壬水正用。',
    priority: 121,
    months: ['巳'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['癸'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:癸水权代', '成格层次:不富必贵但逊于壬水正用'],
    hint: '丙火巳月无壬透而癸透，可先取癸水权代'
  },
  {
    id: 'si-month-bing-no-ren-gui-geng',
    label: '丙日巳月无壬见庚透癸规则',
    description: '丙火生巳月，无壬而癸透已属权代；若再得庚金发源，传统多断不富必贵，层次高于单见癸水。',
    priority: 122,
    months: ['巳'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['癸', '庚'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:癸水权代', '成格层次:见庚透癸，不富必贵'],
    hint: '丙火巳月无壬而庚癸同透，层次可至不富必贵'
  },
  {
    id: 'wu-month-bing-no-ren-use-gui',
    label: '丙日午月无壬用癸规则',
    description: '丙火生午月，原法先壬；若壬水不透而癸水透，癸亦可用，但层次较低，不宜与壬水同论。',
    priority: 121,
    months: ['午'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['癸'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['取用层次:癸水权代', '成格层次:略富贵或功名不久'],
    hint: '丙火午月无壬透而癸透，可先取癸水权代'
  },
  {
    id: 'yin-month-bing-no-ren-use-gui',
    label: '丙日寅月无壬用癸规则',
    description: '丙火生寅月，以壬水为尊；若壬水不透而癸透，亦可权代，但层次仅略富贵，不能与壬水同论。',
    priority: 120,
    months: ['寅'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['癸'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:癸水权代', '成格层次:略富贵'],
    hint: '丙火寅月无壬而癸透，可先取癸水权代'
  },
  {
    id: 'yin-month-bing-double-geng-no-xin',
    label: '丙日寅月双庚无辛清贵规则',
    description: '丙火生寅月，若庚金双透而不杂辛，传统多断清贵，不宜仍与庚辛混杂同论。',
    priority: 123,
    months: ['寅'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    minVisibleStemCounts: { '庚': 2 },
    maxVisibleStemCounts: { '庚': 2 },
    distinctStemGroupCounts: [
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬水为尊，庚金并透', '成格层次:双庚无辛，定主清贵'],
    hint: '丙火寅月双庚无辛，可上清贵'
  },
  {
    id: 'yin-month-bing-geng-xin-mixed',
    label: '丙日寅月庚辛混杂常人规则',
    description: '丙火生寅月，若庚辛并透而相混，传统多断常人，不宜仍与双庚无辛之清贵格同论。',
    priority: 122,
    months: ['寅'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    distinctStemGroupCounts: [
      {
        stems: ['庚', '辛'],
        minDistinctCount: 2,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:庚辛混杂', '成格层次:常人'],
    hint: '丙火寅月庚辛并透，多主常人'
  },
  {
    id: 'mao-month-bing-no-ren-ji-temporary',
    label: '丙日卯月无壬己土姑用规则',
    description: '丙火生卯月，原法端用壬水；若壬水不透而己土透，可姑取己土调剂，但仅主才学衣食，难言成名。',
    priority: 120,
    months: ['卯'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['己'],
    forbiddenVisibleStems: ['壬'],
    usefulWuxing: '土',
    favorableOrder: ['土', '水'],
    traceHints: ['取用层次:己土姑用', '成格层次:有才学但难成名'],
    hint: '丙火卯月无壬透，可姑用己土'
  },
  {
    id: 'chen-month-bing-jia-no-ren',
    label: '丙日辰月有甲无壬浊富规则',
    description: '丙火生辰月，传统以壬水为本、甲木为辅；若有甲而无壬，仅主劳碌浊富，不宜误判为富贵格。',
    priority: 121,
    months: ['辰'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['甲'],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '壬'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:甲木独辅', '成格层次:劳碌浊富'],
    hint: '丙火辰月有甲无壬，多主劳碌浊富'
  },
  {
    id: 'wu-month-bing-ren-no-geng',
    label: '丙日午月独壬无庚页监规则',
    description: '丙火生午月，若仅壬透而无庚发源，传统多主衣衿页监，层次不及壬庚并透。',
    priority: 120,
    months: ['午'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬'],
    maxVisibleStemCounts: { '壬': 1 },
    forbiddenVisibleStems: ['庚'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬水正用', '成格层次:独壬无庚，主衣衿页监'],
    hint: '丙火午月独壬无庚，多主页监'
  },
  {
    id: 'wu-month-bing-ren-geng-tu-misc',
    label: '丙日午月壬庚见戊己杂乱规则',
    description: '丙火生午月，本以壬庚高透为上；若再见戊己出干杂乱，传统多降为异路功名，不宜仍按上命直断。',
    priority: 122,
    months: ['午'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬', '庚'],
    distinctStemGroupCounts: [
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:戊己杂乱', '成格层次:异路功名'],
    hint: '丙火午月壬庚高透而见戊己杂乱，多主异路功名'
  },
  {
    id: 'wu-month-bing-ding-ren-he',
    label: '丙日午月丁壬化合平人规则',
    description: '丙火生午月，若丁壬同透而化合，传统多降为平人，不应仍按壬水正用上断。',
    priority: 124,
    months: ['午'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['丁', '壬'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:丁壬化合', '成格层次:平人'],
    hint: '丙火午月丁壬同透，多因化合降层'
  },
  {
    id: 'mao-month-ding-geng-yi-greedy-combine',
    label: '丁日卯月庚乙俱透贪合规则',
    description: '丁火生卯月，若庚乙俱透，庚必输情于乙，传统多断贪合而贫，不宜仍与庚透乙藏之富贵路数同论。',
    priority: 122,
    months: ['卯'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '乙'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木'],
    traceHints: ['破格因素:庚乙贪合', '成格层次:一贫彻骨'],
    hint: '丁火卯月庚乙俱透，多主贪合贫困'
  },
  {
    id: 'wu-month-ding-gui-unique-kill',
    label: '丁日午月癸透独杀当权规则',
    description: '丁火生午月，得一癸透，传统谓独杀当权，可至出人头地；若壬癸并透，则不属独杀一路。',
    priority: 121,
    months: ['午'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['癸'],
    maxVisibleStemCounts: { '癸': 1 },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:癸水独透', '成格层次:独杀当权，出人头地'],
    hint: '丁火午月癸水独透，可作独杀当权'
  },
  {
    id: 'wu-month-ding-geng-ren-tu-ordinary',
    label: '丁日午月庚壬两透见土常人规则',
    description: '丁火生午月，庚壬两透本可取贵；但若土透制壬，传统即降为常人，不宜仍按科甲上断。',
    priority: 123,
    months: ['午'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '壬'],
    distinctStemGroupCounts: [
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:土透制壬', '成格层次:常人'],
    hint: '丁火午月庚壬两透而土透制壬，多主常人'
  },
  {
    id: 'wu-month-ding-geng-ren-kejia',
    label: '丁日午月庚壬两透科甲规则',
    description: '丁火生午月，若庚壬两透而不见土透制壬，传统多断科甲定然，层次显著高于寻常衣衿。',
    priority: 122,
    months: ['午'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '壬'],
    forbiddenVisibleStems: ['戊', '己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬水为用，庚金发源', '成格层次:庚壬两透，科甲定然'],
    hint: '丁火午月庚壬两透而无土制，多主科甲'
  },
  {
    id: 'wei-month-bing-geng-ren-kejia',
    label: '丙日未月庚壬两透名宦规则',
    description: '丙火生未月，若庚壬两透而不见戊己混杂，传统多断贴身相生，可云科甲名宦，不宜与无庚单壬同论。',
    priority: 123,
    months: ['未'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['庚', '壬'],
    forbiddenVisibleStems: ['戊', '己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬水为用，庚金辅佐', '成格层次:庚壬两透，科甲名宦'],
    hint: '丙火未月庚壬两透而不杂戊己，可至科甲名宦'
  },
  {
    id: 'wei-month-bing-ren-no-geng-no-wu',
    label: '丙日未月无庚有壬小贵规则',
    description: '丙火生未月，无庚而有壬，且不见戊土制壬时，传统多主小富小贵，不宜拔高到庚壬两透层次。',
    priority: 120,
    months: ['未'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬'],
    forbiddenVisibleStems: ['庚', '戊', '己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬水可用', '成格层次:小富小贵'],
    hint: '丙火未月无庚而有壬且不见戊己，多主小富小贵'
  },
  {
    id: 'wei-month-bing-ren-wu-no-geng',
    label: '丙日未月无庚有壬见戊规则',
    description: '丙火生未月，无庚而有壬，若再见戊土制壬，传统多断为贤而已，层次低于庚壬贴身相生。',
    priority: 120,
    months: ['未'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬', '戊'],
    forbiddenVisibleStems: ['庚', '己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['破格因素:戊土制壬', '成格层次:为贤而已'],
    hint: '丙火未月无庚而有壬见戊，多主为贤而已'
  },
  {
    id: 'wei-month-bing-ji-mixed-vulgar',
    label: '丙日未月己土混杂庸俗规则',
    description: '丙火生未月，原以壬水为用；若己土出干混杂，传统多断庸夫俗子，不宜仍按壬庚贴身相生上断。',
    priority: 121,
    months: ['未'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:己土混杂', '成格层次:庸夫俗子'],
    hint: '丙火未月己土出干混杂，多主庸夫俗子'
  },
  {
    id: 'you-month-bing-metal-formation-no-xin',
    label: '丙日酉月金局无辛饿莩规则',
    description: '丙火生酉月，若地支已成金局而辛金不透，传统多断朱门饿莩，不应误作从才富贵。',
    priority: 127,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredFormationWuxings: ['金'],
    forbiddenVisibleStems: ['辛', '丁'],
    maxVisibleStemCounts: { '丙': 1 },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:金局无辛出干', '成格层次:朱门饿莩'],
    hint: '丙火酉月支成金局而无辛出干，多主朱门饿莩'
  },
  {
    id: 'you-month-ding-xin-follow-wealth',
    label: '丁日酉月辛金从才规则',
    description: '丁火生酉月，若金气成势而辛金透出，不见庚金，又无比劫透干，传统多按弃命从才论，富而且贵，虽不科甲亦有异途。',
    priority: 127,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredFormationWuxings: ['金'],
    requiredVisibleStems: ['辛'],
    maxCompanionVisibleCount: 0,
    minWuxingCounts: { '金': 4 },
    distinctStemGroupCounts: [
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '土'],
    traceHints: ['取用层次:金气成势，辛金透干', '成格层次:弃命从才，富而且贵'],
    hint: '丁火酉月金势成局而辛透、不见庚且无比劫，可按从才格看'
  },
  {
    id: 'you-month-bing-metal-formation-xin-follow-wealth',
    label: '丙日酉月金局辛透从才规则',
    description: '丙火生酉月，若地支成金局且辛金透干，天干又不见比劫助身，传统多按从才格看，反主富贵。',
    priority: 127,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredFormationWuxings: ['金'],
    requiredVisibleStems: ['辛'],
    maxCompanionVisibleCount: 0,
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '土'],
    traceHints: ['取用层次:支成金局，辛金透干', '成格层次:从才格，反主富贵'],
    hint: '丙火酉月支成金局而辛透且不见比劫，可按从才格看'
  },
  {
    id: 'you-month-bing-wu-heavy-false-scholar',
    label: '丙日酉月戊多困水假斯文规则',
    description: '丙火生酉月，若壬水已透而戊土偏多困水，传统多断假作斯文，不宜仍按一壬高透富贵上断。',
    priority: 126,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬', '戊'],
    minWuxingCounts: { '土': 3 },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:戊多困水', '成格层次:假作斯文'],
    hint: '丙火酉月壬透而戊土偏多，多主假作斯文'
  },
  {
    id: 'you-month-bing-one-ren-rich',
    label: '丙日酉月一壬高透富贵规则',
    description: '丙火生酉月，若局中多丙而一壬高透，传统多断登科及第、富贵双全，不应仍按普通秋火衰退收束。',
    priority: 125,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬'],
    minVisibleStemCounts: { '丙': 2, '壬': 1 },
    maxVisibleStemCounts: { '壬': 1 },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬水高透', '成格层次:登科及第，富贵双全'],
    hint: '丙火酉月多丙而一壬高透，可主富贵双全'
  },
  {
    id: 'you-month-bing-hidden-ren-xiucai',
    label: '丙日酉月壬藏支秀才规则',
    description: '丙火生酉月，若壬水不透而仅藏支，传统多断秀才，不宜与一壬高透或癸水权代同论。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    forbiddenVisibleStems: ['辛'],
    requiredHiddenStems: ['壬'],
    maxHiddenStemCounts: { '壬': 1 },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬水藏支', '成格层次:秀才'],
    hint: '丙火酉月壬水藏支不透，多主秀才'
  },
  {
    id: 'you-month-bing-ding-xin-cunning',
    label: '丙日酉月丁制辛奸诈规则',
    description: '丙火生酉月，若辛透而再见一丁制辛，传统多断为人奸诈，不识高低，层次又低于单纯辛透贫困。',
    priority: 123,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['丁', '辛'],
    maxVisibleStemCounts: { '丁': 1 },
    distinctStemGroupCounts: [
      {
        stems: ['丁', '辛'],
        minDistinctCount: 2,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:丁火制辛', '成格层次:奸诈，不识高低'],
    hint: '丙火酉月丁辛同透，多主奸诈不识高低'
  },
  {
    id: 'you-month-bing-xin-poor',
    label: '丙日酉月辛透贫苦规则',
    description: '丙火生酉月，若辛金透干而不能从化，传统多断贫苦到老，不应仍退回普通扶抑或泛化秋火衰退。',
    priority: 122,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['辛'],
    distinctStemGroupCounts: [
      {
        stems: ['丁', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:辛金透干', '成格层次:贫苦到老'],
    hint: '丙火酉月辛金透干，多主贫苦到老'
  },
  {
    id: 'you-month-bing-no-ren-use-gui',
    label: '丙日酉月无壬用癸规则',
    description: '丙火生酉月，仍以壬水辅映为先；若无壬而癸透，传统亦可权代，但多主功名不久，不宜与壬水正用同断。',
    priority: 121,
    months: ['酉'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['癸'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:癸水权代', '成格层次:功名不久'],
    hint: '丙火酉月无壬而癸透，可先取癸水权代，但功名不久'
  },
  {
    id: 'xu-month-bing-hidden-ren-gui-page',
    label: '丙日戌月壬癸藏支页监规则',
    description: '丙火生戌月，若壬癸仅藏支而不透，传统多断页监而已，不宜误判为甲壬富贵或甲壬癸俱无下格。',
    priority: 122,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬癸藏支', '成格层次:页监而已'],
    hint: '丙火戌月壬癸藏支不透，多主页监而已'
  },
  {
    id: 'xu-month-bing-geng-wu-trap-jia-ren',
    label: '丙日戌月庚戊困木水庸才规则',
    description: '丙火生戌月，若甲木壬癸本可为用，却又见庚戊同透困其水木，传统多断庸才，不宜仍按甲壬并透上格直断。',
    priority: 124,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['庚', '戊', '甲'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:庚戊困木水', '成格层次:庸才'],
    hint: '丙火戌月庚戊困住木水，多主庸才'
  },
  {
    id: 'xu-month-bing-hidden-jia-ren-no-geng',
    label: '丙日戌月甲藏壬透秀才规则',
    description: '丙火生戌月，若甲木藏支、壬水透干，且不见庚金破甲，传统多许秀才，不宜与甲壬两透之富贵层次混同。',
    priority: 123,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬'],
    requiredHiddenStems: ['甲'],
    forbiddenVisibleStems: ['庚'],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '壬'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:甲木藏支，壬水透干', '成格层次:可许秀才'],
    hint: '丙火戌月甲藏壬透而无庚破甲，可许秀才'
  },
  {
    id: 'xu-month-bing-jia-ren-all',
    label: '丙日戌月甲壬两透富贵规则',
    description: '丙火生戌月，传统必须先用甲木，次取壬水；若甲壬两透，多断富贵非凡，不宜仍按普通衰火泛论。',
    priority: 123,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '壬'],
        minDistinctCount: 2,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:甲木为先，壬水继之', '成格层次:甲壬两透，富贵非凡'],
    hint: '丙火戌月甲壬两透，多主富贵非凡'
  },
  {
    id: 'xu-month-bing-jia-gui-no-ren',
    label: '丙日戌月有甲无壬得癸规则',
    description: '丙火生戌月，若甲木已透而壬水不见，得癸透干亦可权代，传统多断异路功名，不宜误提到甲壬两透之层次。',
    priority: 122,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['甲', '癸'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:甲木为先，癸水权代', '成格层次:异路功名'],
    hint: '丙火戌月有甲无壬而癸透，可作异路功名'
  },
  {
    id: 'xu-month-bing-no-jia-no-ren-no-gui',
    label: '丙日戌月无甲壬癸下格规则',
    description: '丙火生戌月，若甲壬癸俱无，传统直断下格，不应仍退回普通病药提示收束。',
    priority: 124,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['甲', '壬', '癸'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:甲壬癸俱无', '成格层次:下格'],
    hint: '丙火戌月无甲壬癸，可直断下格'
  },
  {
    id: 'chou-month-ren-xiaohan-bing-only',
    label: '壬日丑月小寒后专丙规则',
    description: '壬水生丑月，上半月癸辛主事，传统多专用丙火解寒扶阳，不宜提前并提甲木。',
    priority: 122,
    months: ['丑'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    currentJieqi: ['小寒'],
    usefulWuxing: '火',
    favorableOrder: ['火'],
    hint: '壬水丑月小寒后，专用丙火'
  },
  {
    id: 'chou-month-ren-dahan-bing-jia',
    label: '壬日丑月大寒后丙甲并用规则',
    description: '壬水生丑月，下半月己土主事，传统仍以丙火为主，并取甲木佐助，不宜仍与上半月同断。',
    priority: 123,
    months: ['丑'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    currentJieqi: ['大寒'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '壬水丑月大寒后，丙火为先，甲木为佐'
  },
  {
    id: 'wei-month-ren-xin-jia-gui',
    label: '壬日未月先辛后甲规则',
    description: '壬水生未月，土旺水衰，传统多先辛金发源，次甲木劈土，再酌癸水扶助，较简单扶抑更合原法。',
    priority: 120,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木', '水'],
    hint: '壬水未月，先辛后甲，癸水次辅'
  },
  {
    id: 'shen-month-ren-wu-ding',
    label: '壬日申月戊丁为用规则',
    description: '壬水生申月，源远转强，传统专取戊土制水，丁火为佐，不宜仍按秋水清润一概论。',
    priority: 119,
    months: ['申'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    hint: '壬水申月，专用戊土，丁火为佐'
  },
  {
    id: 'mao-month-gui-geng-first',
    label: '癸日卯月庚辛为先规则',
    description: '癸水生卯月，木旺泄水，传统常先取庚金发源，辛金次之，不宜只按一般身弱扶抑或泛取火土。',
    priority: 116,
    months: ['卯'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    hint: '癸水卯月，先取庚辛发源护身'
  },
  {
    id: 'yin-month-gui-xin-bing',
    label: '癸日寅月辛丙并用规则',
    description: '癸水生寅月，雨露之精逢春木泄气，传统多以辛金为主、丙火次之，兼顾发源与温养。',
    priority: 117,
    months: ['寅'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    hint: '癸水寅月，辛金为主，丙火次之'
  },
  {
    id: 'you-month-gui-xin-bing',
    label: '癸日酉月辛丙并用规则',
    description: '癸水生酉月，正金白水清，传统多取辛金为用、丙火佐之，较简单秋水喜金更完整。',
    priority: 117,
    months: ['酉'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    hint: '癸水酉月，辛金为用，丙火佐之'
  },
  {
    id: 'you-month-yi-qiufen-bing-no-gui',
    label: '乙日酉月秋分后有丙无癸规则',
    description: '乙木生酉月秋分后，若丙透而癸不透，传统亦可取丙火向阳，不应仍拘泥于秋木必先取水。',
    priority: 122,
    months: ['酉'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    currentJieqi: ['秋分'],
    requiredVisibleStems: ['丙'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:丙火向阳', '成格层次:略富贵'],
    hint: '乙木酉月秋分后，有丙无癸，可先取丙火向阳'
  },
  {
    id: 'you-month-yi-qiufen-gui-no-bing',
    label: '乙日酉月秋分后有癸无丙规则',
    description: '乙木生酉月秋分后，若癸透而丙不透，传统谓名利虚花，不应与丙癸并透或有丙无癸同论。',
    priority: 121,
    months: ['酉'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    currentJieqi: ['秋分'],
    requiredVisibleStems: ['癸'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['取用层次:癸水独用', '成格层次:名利虚花'],
    hint: '乙木酉月秋分后，有癸无丙，多主名利虚花'
  },
  {
    id: 'you-month-yi-bailu-ren-temporary',
    label: '乙日酉月白露后无癸姑用壬规则',
    description: '乙木生酉月上半月，若癸水不透，则传统多姑用壬水润木，属权代之法，不及癸水正用。',
    priority: 120,
    months: ['酉'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    currentJieqi: ['白露'],
    requiredVisibleStems: ['壬'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['取用层次:壬水权代', '成格层次:姑用，不及癸水正用'],
    hint: '乙木酉月白露后无癸透，可姑用壬水'
  },
  {
    id: 'wei-month-wu-gui-bing-jia',
    label: '戊日未月先癸后丙甲规则',
    description: '戊土生未月，夏燥土厚，传统先看癸水，次用丙火、甲木，不宜仍只按土旺扶抑泛论。',
    priority: 119,
    months: ['未'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '木'],
    hint: '戊土未月，先看癸水，次用丙火甲木'
  },
  {
    id: 'wei-month-wu-gui-jia-no-bing',
    label: '戊日未月有癸无丙见甲规则',
    description: '戊土生未月，有癸无丙时，若再见甲木，传统多断可许秀才，层次高于无甲者。',
    priority: 121,
    months: ['未'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['癸', '甲'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木', '火'],
    traceHints: ['取用层次:癸水为主，甲木辅佐', '成格层次:见甲可许秀才'],
    hint: '戊土未月有癸无丙而见甲，可许秀才'
  },
  {
    id: 'wei-month-wu-gui-no-bing-no-jia',
    label: '戊日未月有癸无丙无甲规则',
    description: '戊土生未月，有癸无丙且不见甲木时，传统仅言略富，不应与见甲者同断。',
    priority: 120,
    months: ['未'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['癸'],
    forbiddenVisibleStems: ['甲'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '木'],
    traceHints: ['取用层次:癸水独用', '成格层次:无甲略富'],
    hint: '戊土未月有癸无丙且无甲，仅主略富'
  },
  {
    id: 'shen-month-wu-bing-gui-jia-all',
    label: '戊日申月丙癸甲全透极品规则',
    description: '戊土生申月，若丙癸甲齐透，传统多断富贵极品，不宜与单透或缺透同论。',
    priority: 124,
    months: ['申'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['丙', '癸', '甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '木'],
    traceHints: ['取用层次:丙癸甲并用', '成格层次:富贵极品'],
    hint: '戊土申月丙癸甲全透，可至富贵极品'
  },
  {
    id: 'shen-month-wu-gui-jia-no-bing',
    label: '戊日申月无丙得癸甲规则',
    description: '戊土生申月，无丙而得癸甲并透，传统多断清雅家富，层次仍高于常人。',
    priority: 123,
    months: ['申'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['癸', '甲'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木', '火'],
    traceHints: ['取用层次:癸甲并用', '成格层次:清雅家富千金'],
    hint: '戊土申月无丙得癸甲，可主清雅家富'
  },
  {
    id: 'shen-month-wu-no-gui-no-jia',
    label: '戊日申月无癸无甲常人规则',
    description: '戊土生申月，若癸甲俱无，传统多断常人；丙甲癸三者俱无则更下。',
    priority: 121,
    months: ['申'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    distinctStemGroupCounts: [
      {
        stems: ['癸', '甲'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '木'],
    traceHints: ['破格因素:癸甲俱无', '成格层次:常人'],
    hint: '戊土申月无癸无甲，多主常人'
  },
  {
    id: 'shen-month-wu-no-bing-no-gui-no-jia',
    label: '戊日申月丙甲癸俱无下流规则',
    description: '戊土生申月，若丙甲癸三者俱无，传统直断下流之命，不应仍按常人格局收束。',
    priority: 125,
    months: ['申'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸', '甲'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '木'],
    traceHints: ['破格因素:丙甲癸俱无', '成格层次:下流之命'],
    hint: '戊土申月丙甲癸俱无，下流可断'
  },
  {
    id: 'you-month-wu-bing-gui-all',
    label: '戊日酉月丙癸两透科甲规则',
    description: '戊土生酉月，丙癸两透时传统多断科甲，不宜与单透或全无同论。',
    priority: 123,
    months: ['酉'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['丙', '癸'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸'],
        minDistinctCount: 2,
        scope: 'visible'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:丙癸并用', '成格层次:科甲中人'],
    hint: '戊土酉月丙癸两透，可至科甲'
  },
  {
    id: 'you-month-wu-no-bing-no-gui',
    label: '戊日酉月癸丙全无奔流规则',
    description: '戊土生酉月，若癸丙全无，传统多断奔流之客，不应仍按普通常人收束。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    distinctStemGroupCounts: [
      {
        stems: ['丙', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['破格因素:癸丙全无', '成格层次:奔流之客'],
    hint: '戊土酉月癸丙全无，多主奔流'
  },
  {
    id: 'zi-month-gui-bing-xin',
    label: '癸日子月丙辛解冻规则',
    description: '癸水生子月，冰冻太过，传统多以丙火解冻为先，辛金滋扶随后，不宜仍只按冬水取火。',
    priority: 119,
    months: ['子'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    hint: '癸水子月，先丙解冻，再取辛金滋扶'
  },
  {
    id: 'chen-month-xin-ren-jia-all',
    label: '辛日辰月壬甲两透富贵规则',
    description: '辛金生辰月，土旺金相，传统先壬后甲；若壬甲两透，最合洗金疏土之法，多主富贵，不应仍按普通春金泛断。',
    priority: 123,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '甲'],
        minDistinctCount: 2,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:先壬后甲', '成格层次:壬甲两透，富贵必然'],
    hint: '辛金辰月壬甲两透，多主富贵'
  },
  {
    id: 'chen-month-xin-ren-visible-jia-hidden',
    label: '辛日辰月壬透甲藏廪贡规则',
    description: '辛金生辰月，若壬水透干、甲木藏支，亦合先壬后甲之序，但层次低于壬甲并透，传统多主廪贡不失。',
    priority: 122,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    requiredHiddenStems: ['甲'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '甲'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬水透干，甲木藏支', '成格层次:廪贡不失'],
    hint: '辛金辰月壬透甲藏，可许廪贡'
  },
  {
    id: 'chen-month-xin-jia-visible-ren-hidden',
    label: '辛日辰月甲透壬藏富贵可云规则',
    description: '辛金生辰月，若甲木透干、壬水藏支，虽不及壬甲并透得力，传统仍许富贵可云，不宜误落到平常格。',
    priority: 121,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['甲'],
    requiredHiddenStems: ['壬'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '甲'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:甲木透干，壬水藏支', '成格层次:富贵可云'],
    hint: '辛金辰月甲透壬藏，亦可云富贵'
  },
  {
    id: 'chen-month-xin-no-ren-no-jia',
    label: '辛日辰月壬甲皆无平常规则',
    description: '辛金生辰月，若壬甲皆无，则洗金疏土之药两失，传统只作平常之格，不宜抬高到壬甲得用层次。',
    priority: 120,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '甲'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '甲'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:壬甲皆无', '成格层次:平常之格'],
    hint: '辛金辰月壬甲皆无，只作平常之格'
  },
  {
    id: 'chen-month-xin-double-bing-with-gui-scholarly',
    label: '辛日辰月月时皆丙得癸制丙采芹规则',
    description: '辛金生辰月，若月时两透丙火，本属争合；但若癸水出干制丙，较合原文"若癸出干制丙，可许采芹"，层次高于单纯争合风流。',
    priority: 126,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStemPillarPairs: [
      {
        stem: '丙',
        pillars: ['month']
      },
      {
        stem: '丙',
        pillars: ['hour']
      }
    ],
    requiredVisibleStems: ['癸'],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:月时皆丙，而得癸水制丙', '成格层次:可许采芹'],
    hint: '辛金辰月月时皆丙，若得癸水出干制丙，可许采芹'
  },
  {
    id: 'chen-month-xin-double-bing-argue-combine',
    label: '辛日辰月月时皆丙争合风流规则',
    description: '辛金生辰月，若月时皆透丙火，较合原文"如月时皆丙，名为争合，主慷慨风流，交四海"；此类不应误作壬甲得用之贵格。',
    priority: 125,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStemPillarPairs: [
      {
        stem: '丙',
        pillars: ['month']
      },
      {
        stem: '丙',
        pillars: ['hour']
      }
    ],
    forbiddenVisibleStems: ['癸'],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:月时皆丙，争合辛金', '成格层次:慷慨风流，交四海'],
    hint: '辛金辰月月时皆丙，多主争合风流'
  },
  {
    id: 'chen-month-xin-hai-zi-land-with-shen-rank',
    label: '辛日辰月支坐亥子之乡又见申高禄规则',
    description: '辛金生辰月，若地支得亥子水乡，又见申金发源，较合原文"支坐亥子之乡，支又见申，即非玉堂，亦必高增禄位"；此类不应退回平常格。',
    priority: 124,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredBranchPillarPairs: [
      {
        branch: '申'
      }
    ],
    optionalBranchPillarPairs: [
      {
        branch: '亥'
      },
      {
        branch: '子'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:支坐亥子之乡，支又见申', '成格层次:高增禄位'],
    hint: '辛金辰月若支得亥子之乡而又见申，多主高增禄位'
  },
  {
    id: 'chen-month-xin-wu-control-water-no-jia-yi-leisure',
    label: '辛日辰月戊出制水不见甲乙清闲规则',
    description: '辛金生辰月，若戊土出干制水，而甲乙不出疏土，较合原文"若戊出干制水，不见甲乙，清闲之人"；此类不应误抬到富贵层次。',
    priority: 124,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['戊'],
    forbiddenVisibleStems: ['甲', '乙'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        scope: 'total'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:戊土出干制水，不见甲乙', '成格层次:清闲之人'],
    hint: '辛金辰月戊土出而制水，若不见甲乙，多作清闲之人'
  },
  {
    id: 'chen-month-xin-four-storage-no-jia-dull',
    label: '辛日辰月支见四库无甲愚顽规则',
    description: '辛金生辰月，若四支皆见辰戌丑未四库，而甲木不出制土，较合原文"支见四库，名土厚埋金，不见甲制，愚顽之辈"；此类应高于普通辰月平常格。',
    priority: 125,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredBranchPillarPairs: [
      {
        branch: '辰'
      },
      {
        branch: '戌'
      },
      {
        branch: '丑'
      },
      {
        branch: '未'
      }
    ],
    forbiddenVisibleStems: ['甲'],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:支见四库，土厚埋金', '成格层次:愚顽之辈'],
    hint: '辛金辰月若四支见四库而不见甲，多主愚顽'
  },
  {
    id: 'chen-month-xin-fire-many-with-gui-relief',
    label: '辛日辰月火多得癸可解规则',
    description: '辛金生辰月，若四柱火多，本属火土杂乱；但若癸水出干，较合原文"见癸可解"，不应仍按缁衣之格直断。',
    priority: 126,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minWuxingCounts: {
      火: 3
    },
    requiredVisibleStems: ['癸'],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:四柱火多，而得癸水制火', '成格关键:见癸可解'],
    hint: '辛金辰月火多而得癸水出干，可作有救之局'
  },
  {
    id: 'chen-month-xin-fire-many-no-water-monastic',
    label: '辛日辰月火多无水缁衣规则',
    description: '辛金生辰月，若四柱火多而无壬癸透制，较合原文"火土杂乱，主作缁衣"；此类不应仍按一般春金取水收束。',
    priority: 125,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minWuxingCounts: {
      火: 3
    },
    forbiddenVisibleStems: ['壬', '癸'],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:四柱火多，无水制伏', '成格层次:主作缁衣'],
    hint: '辛金辰月火多而无壬癸制伏，多主缁衣'
  },
  {
    id: 'chen-month-xin-companions-heavy-water-weak-jia-noble',
    label: '辛日辰月比劫重重甲出无庚贵规则',
    description: '辛金生辰月，若比劫重重、壬癸浅弱，本有夭折之忧；但甲木透干而不见庚制，较合原文"有甲出干，则贵，然无庚制方妙"，应高于主夭之断。',
    priority: 126,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minCompanionVisibleCount: 2,
    requiredVisibleStems: ['甲'],
    forbiddenVisibleStems: ['庚'],
    maxWuxingCounts: {
      水: 2
    },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:比劫重重，而甲木出干', '成格关键:无庚制甲方妙', '成格层次:则贵'],
    hint: '辛金辰月比劫重重而得甲出、不见庚，多可言贵'
  },
  {
    id: 'chen-month-xin-companions-heavy-water-weak-early-loss',
    label: '辛日辰月比劫重重壬癸浅弱主夭规则',
    description: '辛金生辰月，若比劫重重而壬癸浅弱，较合原文"主夭"；此类应与一般辰月平常格分开，不可因日主有根而轻忽。',
    priority: 125,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minCompanionVisibleCount: 2,
    forbiddenVisibleStems: ['甲'],
    maxWuxingCounts: {
      水: 2
    },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:比劫重重，壬癸浅弱', '成格层次:主夭'],
    hint: '辛金辰月比劫重重而壬癸浅弱，多主夭折之忧'
  },
  {
    id: 'xu-month-xin-ren-jia-all',
    label: '辛日戌月壬甲两透桃洞规则',
    description: '辛金生戌月，土厚金埋，传统先壬后甲；若壬甲两透，正合洗金疏土之法，多主清贵上达，不应仍按普通秋金论。',
    priority: 123,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '甲'],
        minDistinctCount: 2,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:先壬后甲', '成格层次:壬甲两透，桃洞之仙'],
    hint: '辛金戌月壬甲两透，多主清贵上达'
  },
  {
    id: 'xu-month-xin-jia-visible-ren-hidden',
    label: '辛日戌月甲透壬藏异途规则',
    description: '辛金生戌月，若甲木透干、壬水藏支，传统多许异途之仕；此仍属壬甲有情，不应误作壬甲两无。',
    priority: 122,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['甲'],
    requiredHiddenStems: ['壬'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '甲'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:甲木透干，壬水藏支', '成格层次:异途之仕'],
    hint: '辛金戌月甲透壬藏，可作异途之仕'
  },
  {
    id: 'xu-month-xin-ren-visible-jia-hidden-with-wu',
    label: '辛日戌月壬透甲藏又见戊平人规则',
    description: '辛金生戌月，若壬水透干、甲木只藏支内，而戊土又出天干，较合核校后原文"壬透甲藏，又见戊者，平人"；此时壬虽能洗金，终被戊土壅塞，不能仍按桃洞或异途之仕高断。',
    priority: 121,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '戊'],
    requiredHiddenStems: ['甲'],
    forbiddenVisibleStems: ['甲'],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:壬透甲藏而又见戊', '成格层次:只作平人'],
    hint: '辛金戌月壬透甲藏而又见戊，只作平人'
  },
  {
    id: 'xu-month-xin-heavy-earth-ren-visible-jia-hidden-rich',
    label: '辛日戌月土厚甲不透壬出富可求规则',
    description: '辛金生戌月，若土势偏厚，甲木不出而只藏支内，壬水一透洗土助甲，较合原文"土太多，甲不出干，一壬出，虽不发达，富而可求"；此类不应误混入桃洞或平人之断。',
    priority: 120,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    requiredHiddenStems: ['甲'],
    forbiddenVisibleStems: ['甲'],
    minWuxingCounts: {
      土: 4
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:土厚而甲不出干，得壬洗土助甲', '成格层次:虽不发达，富而可求'],
    hint: '辛金戌月土厚而甲不透，若壬水出干，多主富而可求'
  },
  {
    id: 'xu-month-xin-wood-many-earth-thick-no-water-ordinary',
    label: '辛日戌月木多土厚无水常人规则',
    description: '辛金生戌月，若木多而土亦厚，却全无壬癸润洗，较合原文"木多土厚，无水者常人"；此类不应仍按木土两旺便许富贵。',
    priority: 123,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minWuxingCounts: {
      木: 3,
      土: 3
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:木多土厚，而全无壬癸', '成格层次:常人'],
    hint: '辛金戌月木多土厚而无壬癸，多作常人'
  },
  {
    id: 'xu-month-xin-wood-earth-double-gui-rich-hardship',
    label: '辛日戌月木土厚重癸重见富而辛苦规则',
    description: '辛金生戌月，若木多土厚，本非上格；但天干重见癸水，虽无壬水淘洗之功，仍有清金之用，较合原文"干上重见癸水，此命主富，辛苦"，不应仍按无水常人处理。',
    priority: 124,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minWuxingCounts: {
      木: 3,
      土: 3
    },
    minVisibleStemCounts: {
      癸: 2
    },
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:木多土厚，而干上重见癸水', '成格层次:主富，辛苦'],
    hint: '辛金戌月木土厚重而癸水重见，多主富而辛苦'
  },
  {
    id: 'xu-month-xin-ji-visible-gui-no-ren-scholarly',
    label: '辛日戌月己透无壬有癸衣衿规则',
    description: '辛金生戌月，若己土透干而无壬、有癸，较合原文"己透无壬有癸，亦能滋生金力，衣衿之贵"；此类属于癸水权代，不应仍按无水常人论。',
    priority: 123,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['己', '癸'],
    forbiddenVisibleStems: ['壬'],
    maxStemTotalCounts: {
      己: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['取用层次:己土透干，无壬而有癸', '成格层次:衣衿之贵'],
    hint: '辛金戌月己透而无壬有癸，可许衣衿之贵'
  },
  {
    id: 'xu-month-xin-many-ji-gui-no-ren-cloudy-rich',
    label: '辛日戌月己多无壬有癸浊富规则',
    description: '辛金生戌月，若己土偏多而壬水不见，仅赖癸水权代，较合原文"但恐己多，不免浊富"；此类应低于衣衿之贵，高于无水常人。',
    priority: 124,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸'],
    forbiddenVisibleStems: ['壬'],
    minStemTotalCounts: {
      己: 2
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['破格因素:己土偏多，而无壬仅赖癸水', '成格层次:不免浊富'],
    hint: '辛金戌月己多无壬而有癸，多主浊富'
  },
  {
    id: 'xu-month-xin-no-ren-jia-bing-xin-slight-noble',
    label: '辛日戌月土多无壬甲丙辛略贵规则',
    description: '辛金生戌月，若土势偏厚而壬甲全无，但月时又多透丙辛，较合原文"土多无壬甲，时月多透丙辛者，略贵"；此类虽非上格，却高于纯粹土厚埋金之常局。',
    priority: 122,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStemPillarPairs: [
      {
        stem: '丙',
        pillars: ['month', 'hour']
      },
      {
        stem: '辛',
        pillars: ['month', 'hour']
      }
    ],
    maxStemTotalCounts: {
      壬: 0,
      甲: 0
    },
    minWuxingCounts: {
      土: 3
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '木'],
    traceHints: ['取用层次:土多无壬甲，而时月多透丙辛', '成格层次:略贵'],
    hint: '辛金戌月土多而壬甲俱无，若时月多透丙辛，亦可略贵'
  },
  {
    id: 'xu-month-xin-no-ren-jia-bing-xin-with-chen-glory',
    label: '辛日戌月土多无壬甲丙辛见辰荣显规则',
    description: '辛金生戌月，承上式若再见辰字在支，较合原文"加以辰字在支，则荣显莫及"；此条应高于仅作略贵之断，不可仍与前式并论。',
    priority: 123,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStemPillarPairs: [
      {
        stem: '丙',
        pillars: ['month', 'hour']
      },
      {
        stem: '辛',
        pillars: ['month', 'hour']
      }
    ],
    requiredBranchPillarPairs: [
      {
        branch: '辰'
      }
    ],
    maxStemTotalCounts: {
      壬: 0,
      甲: 0
    },
    minWuxingCounts: {
      土: 3
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '木'],
    traceHints: ['取用层次:土多无壬甲，而时月多透丙辛', '成格关键:支再见辰', '成格层次:荣显莫及'],
    hint: '辛金戌月土多无壬甲，若时月多透丙辛而支见辰，多主荣显'
  },
  {
    id: 'hai-month-xin-ren-bing-all',
    label: '辛日亥月壬丙两透金榜规则',
    description: '辛金生亥月，渐寒而未极，传统明言先用壬水、次取丙火；若壬丙两透，最合"金白水清"之象，多主金榜题名，不应仍按普通冬金泛论。',
    priority: 124,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '丙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['取用层次:先壬后丙', '成格层次:壬丙两透，金榜题名'],
    hint: '辛金亥月壬丙两透，多主金榜题名'
  },
  {
    id: 'hai-month-xin-bing-visible-ren-hidden',
    label: '辛日亥月丙透壬藏采芹规则',
    description: '辛金生亥月，若丙火透干而壬水只藏支内，仍得暖金润金之机；较合原文"丙透壬藏，采芹之造"，层次低于壬丙并透，但不应退回常格。',
    priority: 123,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丙'],
    requiredHiddenStems: ['壬'],
    forbiddenVisibleStems: ['壬'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['取用层次:丙火透干，壬水藏支', '成格层次:采芹之造'],
    hint: '辛金亥月丙透壬藏，可作采芹之造'
  },
  {
    id: 'hai-month-xin-ren-visible-bing-hidden',
    label: '辛日亥月壬透丙藏千金规则',
    description: '辛金生亥月，若壬水透干而丙火只藏支内，寒金得洗而暗有温气，较合原文"丙藏壬透，富有千金"；此类重在壬为主用，不应误降到普通积蓄之人。',
    priority: 123,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    requiredHiddenStems: ['丙'],
    forbiddenVisibleStems: ['丙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['取用层次:壬水透干，丙火藏支', '成格层次:富有千金'],
    hint: '辛金亥月壬透丙藏，多主富有千金'
  },
  {
    id: 'hai-month-xin-ren-bing-hidden',
    label: '辛日亥月壬丙在支聪明规则',
    description: '辛金生亥月，若壬丙二神皆不透而同在支内，仍有内藏润暖之机；较合原文"壬丙在支，聪明之士"，虽不及透干显达，亦不应混入寒湿偏枯之局。',
    priority: 122,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredHiddenStems: ['壬', '丙'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '丙'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '丙'],
        minDistinctCount: 2,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['取用层次:壬丙皆在支内', '成格层次:聪明之士'],
    hint: '辛金亥月壬丙在支，亦主聪明'
  },
  {
    id: 'hai-month-xin-ren-many-no-wu',
    label: '辛日亥月壬多无戊汪洋贫贱规则',
    description: '辛金生亥月，若壬水偏多而全局不见戊土为岸，较合原文"壬多无戊，名辛水汪洋，反成贫贱"；此时水势漫流，不应仍按壬水为尊简单上断。',
    priority: 121,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      壬: 2
    },
    maxStemTotalCounts: {
      戊: 0
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['破格因素:壬水偏多而无戊为岸', '成格层次:辛水汪洋，反成贫贱'],
    hint: '辛金亥月壬多无戊，多主汪洋贫贱'
  },
  {
    id: 'hai-month-xin-wu-ren-storage',
    label: '辛日亥月戊壬并存积蓄规则',
    description: '辛金生亥月，若戊壬二神并存于柱，既得壬水洗淘，又有戊土节制，较合原文"戊壬存柱，积蓄之人"；此类重在财蓄成局，不应仍按壬多汪洋或两透科名混断。',
    priority: 122,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      戊: 1,
      壬: 1
    },
    forbiddenVisibleStems: ['丙'],
    usefulWuxing: '土',
    favorableOrder: ['土', '水'],
    traceHints: ['取用层次:戊壬并存于柱', '成格层次:积蓄之人'],
    hint: '辛金亥月戊壬并存，多主积蓄丰厚'
  },
  {
    id: 'hai-month-xin-wu-many-ren-few-fame',
    label: '辛日亥月戊多壬少成名规则',
    description: '辛金生亥月，若戊土偏多而壬水偏少，较合原文"戊多壬少，又主成名"；此时堤岸有力而秀气不绝，层次高于单纯戊壬并存的积蓄之人。',
    priority: 123,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      戊: 2,
      壬: 1
    },
    maxStemTotalCounts: {
      丙: 0,
      壬: 1
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '水'],
    traceHints: ['取用层次:戊多壬少', '成格层次:又主成名'],
    hint: '辛金亥月戊多壬少，多主成名'
  },
  {
    id: 'hai-month-xin-jia-many-wu-few-art',
    label: '辛日亥月甲多戊少艺术蓄金规则',
    description: '辛金生亥月，若甲木偏多而戊土偏少，较合原文"甲多戊少，因艺术而蓄金"；此类重在木气灵动、土不壅塞，多以技艺营财，不应仍混入积蓄或成名格。',
    priority: 122,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minVisibleStemCounts: {
      甲: 2
    },
    maxStemTotalCounts: {
      戊: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:甲多而戊少', '成格层次:因艺术而蓄金'],
    hint: '辛金亥月甲多戊少，多因艺术技艺而蓄财'
  },
  {
    id: 'hai-month-xin-ji-many-with-wu-honest',
    label: '辛日亥月己多有戊诚实规则',
    description: '辛金生亥月，若己土偏多而又见戊土，且壬水尚存，较合原文"己多有戊，壬水被困，金被埋，不过诚实之人"；此类土重埋金，层次不高，不应误抬到成名或积蓄格。',
    priority: 123,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      己: 2,
      戊: 1,
      壬: 1
    },
    maxStemTotalCounts: {
      丙: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    traceHints: ['破格因素:己多有戊，壬水被困，金被埋', '成格层次:不过诚实之人'],
    hint: '辛金亥月己多而又见戊，多主诚实平常'
  },
  {
    id: 'hai-month-xin-water-many-no-wu-bing',
    label: '辛日亥月壬癸多无戊丙劳碌规则',
    description: '辛金生亥月，若壬癸偏多而戊丙全无，寒湿泛滥无制无暖，较合原文"壬癸多无戊丙者，劳碌辛苦"；不应仍把见壬见癸简单上提为金白水清。',
    priority: 122,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      壬: 1,
      癸: 1
    },
    minWuxingCounts: {
      水: 4
    },
    maxStemTotalCounts: {
      戊: 0,
      丙: 0
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:壬癸偏多而无戊丙', '成格层次:劳碌辛苦'],
    hint: '辛金亥月壬癸偏多而无戊丙，多主劳碌辛苦'
  },
  {
    id: 'zi-month-xin-ren-bing-all-no-wu-gui',
    label: '辛日子月壬丙两透不见戊癸衣锦规则',
    description: '辛金生子月，寒冬雨露，传统强调须丙温暖；若壬丙两透，而天干不杂戊癸，较合原文"壬丙两透，不见戊癸，衣锦腰金"，不应仍按普通冬辛喜火喜水泛断。',
    priority: 124,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '丙'],
    forbiddenVisibleStems: ['戊', '癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:壬丙两透，不见戊癸', '成格层次:衣锦腰金'],
    hint: '辛金子月壬丙两透而不见戊癸，多主衣锦腰金'
  },
  {
    id: 'zi-month-xin-ren-hidden-bing-visible',
    label: '辛日子月壬藏丙透一榜规则',
    description: '辛金生子月，若壬水不透只藏支内，而丙火明透解寒，较合原文"即壬藏丙透，一榜堪图"；此类虽不及壬丙并透，仍不应退回常格。',
    priority: 123,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丙'],
    requiredHiddenStems: ['壬'],
    forbiddenVisibleStems: ['壬', '戊', '癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:壬藏而丙透', '成格层次:一榜堪图'],
    hint: '辛金子月壬藏丙透，亦可一榜堪图'
  },
  {
    id: 'zi-month-xin-gui-visible-bing-visible-no-ren',
    label: '辛日子月癸出困丙规则',
    description: '辛金生子月，若癸水透出而丙火亦透、却无壬水统摄，较合原文"切忌癸出冻金，而困丙火"；此类寒湿上凌，丙火受困，不应仍按壬丙并透或壬藏丙透高断。',
    priority: 122,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸', '丙'],
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:癸水出干，冻金困丙', '成格关键:丙火受困，不宜高断'],
    hint: '辛金子月癸出而丙透、却无壬统摄，多主冻金困火'
  },
  {
    id: 'zi-month-xin-ren-many-with-wu-bing-jia',
    label: '辛日子月壬多有戊丙甲出干青云规则',
    description: '辛金生子月，若壬水偏多而有戊土为堤，天干又见丙甲并透，既得温暖又得疏导，较合原文"壬多有戊，丙甲出干者，青云之客"；不应仍按壬多寒儒一概下断。',
    priority: 123,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丙', '甲'],
    minStemTotalCounts: {
      壬: 2,
      戊: 1
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '土'],
    traceHints: ['取用层次:壬多有戊，丙甲出干', '成格层次:青云之客'],
    hint: '辛金子月壬多有戊而丙甲出干，多主青云直上'
  },
  {
    id: 'zi-month-xin-ren-many-no-wu-bing',
    label: '辛日子月壬多无戊丙寒儒规则',
    description: '辛金生子月，若壬水偏多而戊丙皆无，寒湿太过，较合原文"壬多无戊丙者，泄金太过，定主寒儒"；此时不应仍把多壬简单当成有源有用。',
    priority: 121,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      壬: 2
    },
    maxStemTotalCounts: {
      戊: 0,
      丙: 0
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:壬多而无戊丙', '成格层次:泄金太过，定主寒儒'],
    hint: '辛金子月壬多而无戊丙，多主寒儒'
  },
  {
    id: 'zi-month-xin-ren-many-jia-yi-heavy-no-bing',
    label: '辛日子月壬多甲乙重无丙贫寒规则',
    description: '辛金生子月，若壬水偏多，甲乙并重而又无丙火温暖，较合原文"壬多，甲乙重重，无丙火者，贫寒"；此类较寒儒更带木泄之病，不应仍与青云或润下同断。',
    priority: 122,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['甲', '乙'],
    minStemTotalCounts: {
      壬: 2
    },
    minWuxingCounts: {
      木: 3
    },
    forbiddenBranchPillarPairs: [
      {
        branch: '丑'
      }
    ],
    maxStemTotalCounts: {
      丙: 0
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:壬多而甲乙重重，无丙火温暖', '成格层次:多主贫寒'],
    hint: '辛金子月壬多而甲乙重重、又无丙火，多主贫寒'
  },
  {
    id: 'zi-month-xin-water-formation-gui-two-wu',
    label: '辛日子月水局癸透二戊制富贵规则',
    description: '辛金生子月，若地支水局已成而癸水透干，再得二戊制水，较合原文"支成水局，癸水出干，有二戊制者，富贵恩荣"；此类不应仍按一般冬水过旺轻断。',
    priority: 123,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['水'],
    requiredVisibleStems: ['癸'],
    minStemTotalCounts: {
      戊: 2
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['取用层次:支成水局，癸水出干，二戊制之', '成格层次:富贵恩荣'],
    hint: '辛金子月水局成势而癸透，若再得二戊制水，多主富贵恩荣'
  },
  {
    id: 'zi-month-xin-water-formation-gui-no-wu',
    label: '辛日子月水局癸透无戊常人规则',
    description: '辛金生子月，若地支水局成势而癸水透干，却不见戊土制流，较合原文"无戊者常人"；此类虽有水势，却非高格，不应误抬到恩荣层次。',
    priority: 122,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['水'],
    requiredVisibleStems: ['癸'],
    maxStemTotalCounts: {
      戊: 0
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['破格因素:支成水局而无戊制水', '成格层次:只作常人'],
    hint: '辛金子月水局成势而癸透，若无戊制水，只作常人'
  },
  {
    id: 'zi-month-xin-run-down-prosper',
    label: '辛日子月亥子丑全比劫透润下规则',
    description: '辛金生子月，若地支全见亥子丑，天干又有庚辛比劫透出，且不见丙火，较合原文"名润下格，富贵双全"；此类是从水趋势，不应仍按普通寒儒或水局癸透处理。',
    priority: 123,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredBranchPillarPairs: [
      {
        branch: '亥'
      },
      {
        branch: '丑'
      }
    ],
    minCompanionVisibleCount: 1,
    maxStemTotalCounts: {
      丙: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:支见亥子丑，干出比劫，无丙', '成格层次:润下格，富贵双全', '运势警语:运喜西北'],
    hint: '辛金子月亥子丑全而比劫透出、又无丙火，可按润下格论'
  },
  {
    id: 'zi-month-xin-run-down-no-metal-monastic',
    label: '辛日子月亥子丑全无庚辛见甲乙僧道规则',
    description: '辛金生子月，若地支全见亥子丑，而天干不见庚辛比劫，反见甲乙，又无戊丙挽救，较合原文"若无庚辛，又出甲乙，无戊丙者，必主僧道"；此类不应误按润下格富贵处理。',
    priority: 122,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredBranchPillarPairs: [
      {
        branch: '亥'
      },
      {
        branch: '丑'
      }
    ],
    distinctStemGroupCounts: [
      {
        stems: ['甲', '乙'],
        minDistinctCount: 1,
        scope: 'visible'
      }
    ],
    maxCompanionVisibleCount: 0,
    maxStemTotalCounts: {
      庚: 0,
      戊: 0,
      丙: 0
    },
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    traceHints: ['破格因素:亥子丑全而无庚辛，反见甲乙', '成格层次:必主僧道'],
    hint: '辛金子月亥子丑全而无庚辛、又见甲乙且无戊丙，多主僧道'
  },
  {
    id: 'zi-month-xin-wood-formation-ding-wu-merit',
    label: '辛日子月木局丁戊同见功名规则',
    description: '辛金生子月，若地支成木局，而丁火透干并见戊土，既得温金又得培根，较合原文"支成木局，有丁出干，又见戊者，功名特达"；不应仍按冬金木旺受克下断。',
    priority: 122,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['木'],
    requiredVisibleStems: ['丁', '戊'],
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['取用层次:支成木局，丁火出干，又见戊土', '成格层次:功名特达'],
    hint: '辛金子月木局成势而丁戊并见，多主功名特达'
  },
  {
    id: 'chou-month-xin-bing-ren-all',
    label: '辛日丑月丙壬两透金马玉堂规则',
    description: '辛金生丑月，寒冻之极，传统明言先丙后壬；若丙壬两透，既能解冻又能洗淘，最合"金马玉堂之客"层次，不应仍按普通冬辛扶抑粗断。',
    priority: 124,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丙', '壬'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:先丙后壬', '成格层次:丙壬两透，金马玉堂'],
    hint: '辛金丑月丙壬两透，可作金马玉堂之客'
  },
  {
    id: 'chou-month-xin-bing-ren-hidden',
    label: '辛日丑月壬丙俱藏游庠规则',
    description: '辛金生丑月，若丙壬皆不透而俱藏支内，虽不及两透显发，仍较合原文"壬丙俱藏，游庠食廪之人"；此类不应误作纯寒无药之局。',
    priority: 123,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredHiddenStems: ['壬', '丙'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '丙'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '丙'],
        minDistinctCount: 2,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:壬丙俱藏', '成格层次:游庠食廪'],
    hint: '辛金丑月壬丙俱藏，亦主游庠食廪'
  },
  {
    id: 'chou-month-xin-bing-only-no-ren',
    label: '辛日丑月有丙无壬富真贵假规则',
    description: '辛金生丑月，若丙火透干而壬水全无，虽能解冻却不能洗淘，较合原文"有丙无壬，富真贵假"；此类只可许富，不应误提到金马玉堂。',
    priority: 122,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丙'],
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:有丙无壬', '成格层次:富真贵假'],
    hint: '辛金丑月有丙无壬，多主富真贵假'
  },
  {
    id: 'chou-month-xin-ren-only-no-bing',
    label: '辛日丑月有壬乏丙贫贱规则',
    description: '辛金生丑月，若壬水透出而丙火全无，寒金愈洗愈冷，较合原文"有壬乏丙，贱而且贫"；此时不能仍把见壬当作得用。',
    priority: 122,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    maxStemTotalCounts: {
      丙: 0
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['破格因素:有壬而乏丙火', '成格层次:贱而且贫'],
    hint: '辛金丑月有壬而无丙，多主贫贱'
  },
  {
    id: 'chou-month-xin-many-bing-no-ren-gui-trade',
    label: '辛日丑月丙多无壬有癸贸易规则',
    description: '辛金生丑月，若丙火偏多而壬水不见，另有癸水点缀，较合原文"丙多，无壬，有癸，市中贸易之流"；此类多主商贸营生，不应误抬到富真贵假或金马玉堂层次。',
    priority: 123,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      丙: 2,
      癸: 1
    },
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:丙多无壬而有癸', '成格层次:市中贸易之流'],
    hint: '辛金丑月丙多而无壬、有癸，多主市中贸易'
  },
  {
    id: 'chou-month-xin-water-many-earth-fire-peace',
    label: '辛日丑月水多见戊己丙丁安乐规则',
    description: '辛金生丑月，若水势偏多，而戊己出干、丙丁亦见，既能制水培金，又能温暖解冻，较合原文"水多，有戊己出干，又有丙丁，必主衣食充盈，一生安乐"；不应仍按寒湿偏枯下断。',
    priority: 122,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minWuxingCounts: {
      水: 3
    },
    distinctStemGroupCounts: [
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['丙', '丁'],
        minDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['取用层次:水多而戊己出干，又见丙丁', '成格层次:衣食充盈，一生安乐'],
    hint: '辛金丑月水多而戊己、丙丁并见，多主衣食充盈、一生安乐'
  },
  {
    id: 'yin-month-xin-ji-ren-visible-geng-hidden-jia-control',
    label: '辛日寅月己壬两透支见庚制甲科甲规则',
    description: '辛金生寅月，寒未尽退，传统以己为君、壬为臣；若己壬两透，而地支又见庚金制甲，较合原文"己壬两透，支见庚制甲，科甲定然"，不应仍停留在一般春金调候层。',
    priority: 124,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['己', '壬'],
    requiredHiddenStems: ['庚'],
    usefulWuxing: '土',
    favorableOrder: ['土', '水', '金'],
    traceHints: ['取用层次:己壬两透，支见庚制甲', '成格层次:科甲定然'],
    hint: '辛金寅月己壬两透而支见庚制甲，多主科甲'
  },
  {
    id: 'yin-month-xin-ji-visible-jia-hidden-alt-grace',
    label: '辛日寅月己透支有甲异路恩荣规则',
    description: '辛金生寅月，若己土透干，而甲木只在地支暗见，较合原文"己土透干，支中有甲，异路恩荣"；此类层次低于己壬两透科甲，但不应误落到贫贱或富贵难全。',
    priority: 123,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['己'],
    requiredHiddenStems: ['甲'],
    forbiddenVisibleStems: ['甲'],
    usefulWuxing: '土',
    favorableOrder: ['土', '水'],
    traceHints: ['取用层次:己土透干，支中有甲', '成格层次:异路恩荣'],
    hint: '辛金寅月己土透而支中有甲，可作异路恩荣'
  },
  {
    id: 'yin-month-xin-ren-visible-no-ji-geng-poor',
    label: '辛日寅月见壬无己庚贫贱规则',
    description: '辛金生寅月，若只见壬水而全无己土、庚金为辅，较合原文"或见壬，无己庚者，贫贱之徒"；此时臣有而君佐俱失，不应误按壬水得用上断。',
    priority: 122,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    maxStemTotalCounts: {
      己: 0,
      庚: 0
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '金'],
    traceHints: ['破格因素:见壬而无己庚', '成格层次:贫贱之徒'],
    hint: '辛金寅月见壬而无己庚，多主贫贱'
  },
  {
    id: 'yin-month-xin-ren-visible-geng-no-ji-incomplete',
    label: '辛日寅月壬透庚存己不全难全规则',
    description: '辛金生寅月，原文于己壬两透与无己庚贫贱之间，另有"己土不全，号曰君臣失势，富贵难全"一层。依上下文推断，若壬水已透、庚金尚存，而己土不透，则较合此象：较贫贱为高，却不足以入科甲恩荣。',
    priority: 122.5,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    forbiddenVisibleStems: ['己'],
    minStemTotalCounts: {
      庚: 1
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '金', '水'],
    traceHints: ['破格因素:己土不全，君臣失势', '成格层次:富贵难全'],
    hint: '辛金寅月壬透而己不全、庚尚存，多主富贵难全'
  },
  {
    id: 'yin-month-xin-bing-visible-martial',
    label: '辛日寅月丙透武学规则',
    description: '辛金生寅月，原文明言"或有丙火出干，亦主武学"。此条不宜与己壬两透科甲或见壬无己庚贫贱混断，应单列为偏武职、偏技艺进身的一层。',
    priority: 121.5,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丙'],
    forbiddenVisibleStems: ['壬'],
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['取用层次:丙火出干', '成格层次:亦主武学'],
    hint: '辛金寅月丙火出干，多主武学之途'
  },
  {
    id: 'yin-month-xin-fire-formation-ren-only-ordinary',
    label: '辛日寅月火局壬透不克己常人规则',
    description: '辛金生寅月，若地支火局已成，即便壬水出干，仍不能克制己土燥势，较合原文"支成火局，即壬水出干，不克己土，亦寻常之人"；不应误把见壬当作足以破局。',
    priority: 125,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    requiredVisibleStems: ['壬'],
    minStemTotalCounts: {
      己: 1
    },
    forbiddenVisibleStems: ['庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['破格因素:支成火局，壬透仍不能克己', '成格层次:寻常之人'],
    hint: '辛金寅月火局成势而仅壬透，多作寻常之人'
  },
  {
    id: 'yin-month-xin-fire-formation-geng-ren-all-distinguished',
    label: '辛日寅月火局庚壬两透显达规则',
    description: '辛金生寅月，若地支火局成势，而庚壬两透协力破局制火，较合原文"庚壬两透，破局制火，必为显达之人"；此类明显高于火局见壬常人。',
    priority: 125,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    requiredVisibleStems: ['庚', '壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:支成火局，庚壬两透破局制火', '成格层次:必为显达之人'],
    hint: '辛金寅月火局成势而庚壬两透，多主显达'
  },
  {
    id: 'yin-month-xin-water-formation-no-bing-ordinary',
    label: '辛日寅月水局无丙沉寒平常规则',
    description: '辛金生寅月，若地支成水局而不见丙火透出，较合原文"金弱沉寒，平常之士"；此类寒气到底，不应仍按水局有情上断。',
    priority: 125,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['水'],
    forbiddenVisibleStems: ['丙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:支成水局而不见丙火', '成格层次:金弱沉寒，平常之士'],
    hint: '辛金寅月水局成势而无丙，多作平常之士'
  },
  {
    id: 'yin-month-xin-water-formation-bing-visible-rich',
    label: '辛日寅月水局得丙照暖富贵规则',
    description: '辛金生寅月，若地支成水局而丙火透干照暖，较合原文"得丙透照暖，反主富贵"；此类不应仍按沉寒平常处理。',
    priority: 125,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['水'],
    requiredVisibleStems: ['丙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '土', '水'],
    traceHints: ['取用层次:支成水局，得丙透照暖', '成格层次:反主富贵'],
    hint: '辛金寅月水局成势而丙透照暖，反主富贵'
  },
  {
    id: 'yin-month-xin-mao-day-zi-hour-chaoyang',
    label: '辛日寅月卯日子时朝阳规则',
    description: '辛金生寅月，原文明言"辛逢卯日，子时，名曰朝阳"。此条属于直接点名的日时格象，应以日支卯、时支子为核心判据；因条文未另明示病药次序，这里只将其作为高优先级格象提示，不把它泛化成普通寅月辛金的通用取用逻辑。',
    priority: 126,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    hourBranches: ['子'],
    requiredBranchPillarPairs: [
      {
        branch: '卯',
        pillars: ['day']
      }
    ],
    usefulWuxing: '土',
    favorableOrder: ['土', '水', '金'],
    traceHints: ['特殊格象:辛逢卯日，子时', '成格名目:名曰朝阳'],
    hint: '辛金寅月而日坐卯、时逢子，多成朝阳之象'
  },
  {
    id: 'mao-month-xin-ren-jia-all-noble',
    label: '辛日卯月壬甲两透贵显规则',
    description: '辛金生卯月，壬水为尊，甲木佐之；若壬甲两透，较合原文"有壬甲透者贵显"，不应仍停留在泛化春金先壬后甲层面。',
    priority: 124,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '甲'],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬甲两透', '成格层次:贵显'],
    hint: '辛金卯月壬甲两透，多主贵显'
  },
  {
    id: 'mao-month-xin-ren-sits-hai-no-earth-well-off',
    label: '辛日卯月壬坐亥支不见土出小康规则',
    description: '辛金生卯月，若壬水明透且坐亥支，而天干不见戊己之土混浊，较合原文"壬坐亥支，不见土出，家亦小康"；此类应与一般有壬、无壬或病药未配之局分开。',
    priority: 123,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStemBranchPairs: [
      {
        stem: '壬',
        branch: '亥'
      }
    ],
    forbiddenVisibleStems: ['戊', '己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬坐亥支，不见土出', '成格层次:家亦小康'],
    hint: '辛金卯月壬坐亥支而不见戊己透，多主家亦小康'
  },
  {
    id: 'mao-month-xin-shen-hidden-ren-alt-fame',
    label: '辛日卯月得申中壬异途名望规则',
    description: '辛金生卯月，若壬水不透，而申中暗得壬源，较合原文"得申中之壬者，异途名望"；此类不应被无壬常人或泛化春金规则吞没。',
    priority: 123,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredHiddenStemBranchPairs: [
      {
        branch: '申',
        stem: '壬'
      }
    ],
    maxVisibleStemCounts: {
      壬: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:得申中之壬', '成格层次:异途名望'],
    hint: '辛金卯月壬不透而得申中暗壬，多作异途名望'
  },
  {
    id: 'mao-month-xin-ren-wu-visible-no-jia-ordinary',
    label: '辛日卯月壬戊透甲不出平常规则',
    description: '辛金生卯月，若壬戊并透而甲木不出，较合原文"壬戊透，甲不出干，此为病不遇药，平常之人"；此类病药不配，不应误抬到贵显层次。',
    priority: 123,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '戊'],
    forbiddenVisibleStems: ['甲'],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:壬戊并透而甲不出干', '成格层次:病不遇药，平常之人'],
    hint: '辛金卯月壬戊并透而甲不出，多作平常'
  },
  {
    id: 'mao-month-xin-ren-wu-with-yi-scholarly-false',
    label: '辛日卯月乙破戊衣衿假利规则',
    description: '辛金生卯月，若壬戊并透而乙木再出破戊，较合原文"得乙破戊，颇有衣衿，但假名假利，刻薄乖张"；此类不应仍按平常或贵显两端粗断。',
    priority: 124,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '戊', '乙'],
    forbiddenVisibleStems: ['甲'],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:乙木破戊', '成格层次:颇有衣衿，但假名假利'],
    hint: '辛金卯月壬戊并透而得乙破戊，虽有衣衿，多是假利'
  },
  {
    id: 'mao-month-xin-ren-flood-with-wu-auspicious',
    label: '辛日卯月壬水重重得戊反吉规则',
    description: '辛金生卯月，若壬水重重，本有淘洗太过之患；但一得戊土培堤中和，较合原文"壬水重重，得戊反吉"，应高于泛泛的壬水汪洋无作为之断。',
    priority: 126,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      壬: 3,
      戊: 1
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '木', '火'],
    traceHints: ['取用层次:壬水重重而得戊土', '成格层次:得戊反吉'],
    hint: '辛金卯月壬水重重而得戊，多主反吉'
  },
  {
    id: 'mao-month-xin-ren-flood-no-wu-meager',
    label: '辛日卯月壬水汪洋无戊无为规则',
    description: '辛金生卯月，若壬水重重而无戊土堤防，较合原文"一派壬水汪洋，金水淘洗太过，不得中和，略有衣食，全无作为"；此类应高于一般有壬平断，但低于得戊反吉之局。',
    priority: 125,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      壬: 3
    },
    maxStemTotalCounts: {
      戊: 0
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '木'],
    traceHints: ['破格因素:一派壬水汪洋，不得中和', '成格层次:略有衣食，全无作为'],
    hint: '辛金卯月壬水重重而无戊，多主略有衣食、全无作为'
  },
  {
    id: 'mao-month-xin-no-ren-ordinary',
    label: '辛日卯月无壬常人规则',
    description: '辛金生卯月，壬水为尊；若全局并无壬水，较合原文"无壬者常人"，不应仍按壬甲得用或异途名望上断。',
    priority: 122,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:壬水全无', '成格层次:常人'],
    hint: '辛金卯月若全无壬水，多作常人'
  },
  {
    id: 'mao-month-xin-wood-formation-with-geng-rich',
    label: '辛日卯月木局见庚富贵规则',
    description: '辛金生卯月，若地支成木局，泄尽壬水，本属险局；但一见庚金，较合原文"有庚富贵"，不应仍按木局无庚平人处理。',
    priority: 125,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['木'],
    minStemTotalCounts: {
      庚: 1
    },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:支成木局而得庚金', '成格层次:富贵'],
    hint: '辛金卯月木局成势而见庚，多主富贵'
  },
  {
    id: 'mao-month-xin-wood-formation-no-geng-ordinary',
    label: '辛日卯月木局无庚平人规则',
    description: '辛金生卯月，若地支成木局而不见庚金，较合原文"无庚平人"；此类不应误抬到木局有庚的富贵层次。',
    priority: 125,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['木'],
    maxStemTotalCounts: {
      庚: 0
    },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['破格因素:支成木局而无庚金', '成格层次:平人'],
    hint: '辛金卯月木局成势而无庚，多作平人'
  },
  {
    id: 'mao-month-xin-fire-formation-double-ren-marvel',
    label: '辛日卯月火局二壬制火富贵反奇规则',
    description: '辛金生卯月，若地支成火局，官印相争、金水两伤，本属下流；但若两壬出干制火，较合原文"得二壬出制，富贵反奇"，不应仍按火局下流处理。',
    priority: 125,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    minVisibleStemCounts: {
      壬: 2
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:支成火局而二壬出制', '成格层次:富贵反奇'],
    hint: '辛金卯月火局成势而二壬出制，可作富贵反奇'
  },
  {
    id: 'mao-month-xin-fire-formation-base-low',
    label: '辛日卯月火局官印相争下流规则',
    description: '辛金生卯月，若地支成火局，原文先断"官印相争，金水两伤，下流之格"；只有二壬明透制火，方可翻成"富贵反奇"。故凡火局而未得两壬出制者，不应仍留在普通平常层次，更不应误抬到富贵反奇。',
    priority: 124.8,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    maxVisibleStemCounts: {
      壬: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:支成火局，官印相争', '破格因素:金水两伤', '成格层次:下流之格'],
    hint: '辛金卯月火局成势而未得二壬出制，多作下流之格'
  },
  {
    id: 'mao-month-xin-pure-ren-no-bing-prominent',
    label: '辛日卯月纯壬无丙显达规则',
    description: '辛金生卯月，原文有"辛金生于春季，一派壬水，而无丙水，即能显达，家无宿舂"之语。为避免与"壬水重重无戊全无作为"冲突，这里将"一派壬水"保守收束为壬水纯一而不过汪洋、并且不夹甲木戊己之病药支线；此类虽不及壬丙齐透的大富大贵，仍较一般平常层次为高。',
    priority: 124.5,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    maxStemTotalCounts: {
      壬: 2,
      丙: 0,
      甲: 0,
      戊: 0,
      己: 0
    },
    minStemTotalCounts: {
      壬: 2
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'total'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:一派壬水，不见丙火', '成格层次:即能显达，家无宿舂'],
    hint: '辛金卯月壬水纯一而不见丙甲戊己，多主显达而不贫'
  },
  {
    id: 'mao-month-xin-ren-bing-all-great-wealth',
    label: '辛日卯月壬丙齐透大富大贵规则',
    description: '辛金生卯月，原文明言"得壬丙齐透，方许大富大贵"。此条层级应高于单纯壬甲两透的贵显，不应仍停留在一般春辛先壬后甲的泛化判断。',
    priority: 126,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '丙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '木'],
    traceHints: ['取用层次:壬丙齐透', '成格层次:方许大富大贵'],
    hint: '辛金卯月壬丙齐透，多主大富大贵'
  },
  {
    id: 'si-month-xin-metal-formation-water-wood-clarity',
    label: '辛日巳月金局水透木制戊科甲规则',
    description: '辛金生巳月，若地支成金局，水气透干洗淘，又得木来制戊，较合原文"支成金局，水透出干，有木制戊，名一清澈底，科甲功名"；此类应高于一般夏辛喜水的泛化总纲。',
    priority: 125,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['金'],
    minStemTotalCounts: {
      戊: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['甲', '乙'],
        minDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:支成金局，水透出干，木来制戊', '成格层次:一清澈底，科甲功名'],
    hint: '辛金巳月支成金局而水透木制戊，多主科甲功名'
  },
  {
    id: 'si-month-xin-ren-hai-hidden-no-wu',
    label: '辛日巳月壬藏亥中无戊上达规则',
    description: '辛金生巳月，若壬水只藏亥支而不透，且戊土不出天干，仍得暗中淘洗之机，传统多许上达，不应混入壬癸全无之局。',
    priority: 124,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    forbiddenVisibleStems: ['甲'],
    requiredHiddenStemBranchPairs: [
      {
        branch: '亥',
        stem: '壬'
      }
    ],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'hidden'
      },
      {
        stems: ['戊'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬水藏亥，戊不出干', '成格层次:亦主上达'],
    hint: '辛金巳月壬水藏亥而戊不透，亦主上达'
  },
  {
    id: 'si-month-xin-gui-visible-ren-hidden',
    label: '辛日巳月癸透壬藏富真贵假规则',
    description: '辛金生巳月，畏火喜水；若癸水透干、壬水藏支，既得洗淘又未成澄澈，传统多断富真贵假，不应与壬水高透科甲同论。',
    priority: 123,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸'],
    requiredHiddenStems: ['壬'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:癸透壬藏', '成格层次:富真贵假'],
    hint: '辛金巳月癸透壬藏，多主富真贵假'
  },
  {
    id: 'si-month-xin-ren-hai-hidden-with-wu',
    label: '辛日巳月壬藏亥中见戊常人规则',
    description: '辛金生巳月，若壬水虽藏亥支而戊土透干，则暗水受遏，传统只作常人格局，不宜仍许上达。',
    priority: 123,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['戊'],
    forbiddenVisibleStems: ['甲'],
    requiredHiddenStemBranchPairs: [
      {
        branch: '亥',
        stem: '壬'
      }
    ],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:壬水藏亥而戊出', '成格层次:只作常人'],
    hint: '辛金巳月壬水藏亥而戊透，只作常人格局'
  },
  {
    id: 'si-month-xin-ren-hai-jia-visible',
    label: '辛日巳月壬藏亥中甲透衣禄规则',
    description: '辛金生巳月，若壬水藏亥而再得一甲透，能疏土护水，传统多许衣禄可求；此时不论戊是否透出，都不应仍混入上达或常人的宽泛写法。',
    priority: 124,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['甲'],
    requiredHiddenStemBranchPairs: [
      {
        branch: '亥',
        stem: '壬'
      }
    ],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:壬藏亥中，甲木透干', '成格层次:衣禄可求'],
    hint: '辛金巳月壬藏亥中而甲木透干，衣禄可求'
  },
  {
    id: 'si-month-xin-ren-gui-hidden-wu-ji-hidden',
    label: '辛日巳月壬癸戊己皆藏略富规则',
    description: '辛金生巳月，若壬癸皆藏而不透，戊己亦俱藏不出，既有暗水洗淘，又未遭燥土显遏，传统多许略富，不应混入壬癸全无或火透鳏独之局。',
    priority: 123,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    forbiddenVisibleStems: ['甲'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['戊', '己'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 2,
        scope: 'hidden'
      },
      {
        stems: ['戊', '己'],
        minDistinctCount: 2,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬癸皆藏，戊己亦藏', '成格层次:略富'],
    hint: '辛金巳月壬癸皆藏、戊己亦藏，多主略富'
  },
  {
    id: 'si-month-xin-fire-formation-water-control',
    label: '辛日巳月火局得水制吉规则',
    description: '辛金生巳月，若地支成火局而复得水制，火势虽炽而尚可节，传统谓有制者吉，不应仍混作纯火无制之凶局。',
    priority: 123,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        scope: 'total'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['取用层次:支成火局，得水制火', '成格层次:有制则吉'],
    hint: '辛金巳月支成火局而得水制，方可言吉'
  },
  {
    id: 'si-month-xin-fire-formation-no-water-earth',
    label: '辛日巳月火局无水取土规则',
    description: '辛金生巳月，若地支成火局而全无壬癸，火势无制，传统即谓凶；病药上则退而取土泄火，不应仍只按一般见火处理。',
    priority: 123,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '土',
    favorableOrder: ['土', '水'],
    traceHints: ['破格因素:支成火局而无水制火', '取用层次:火旺无水，取土泄之'],
    hint: '辛金巳月支成火局而无水，宜取土泄火'
  },
  {
    id: 'si-month-xin-no-ren-gui-fire-lonely',
    label: '辛日巳月壬癸俱无见火鳏独规则',
    description: '辛金生巳月，若壬癸俱无而反见火透，洗淘既失又遭火烈，传统多断鳏独，不宜仍按普通夏金扶抑轻轻带过。',
    priority: 122,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'hidden'
      },
      {
        stems: ['丙', '丁'],
        minDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:壬癸俱无而火出', '成格层次:必主鳏独'],
    hint: '辛金巳月壬癸俱无而火透，多主鳏独'
  },
  {
    id: 'si-month-xin-jia-no-ren-gui',
    label: '辛日巳月有甲无壬癸虚浮规则',
    description: '辛金生巳月，若甲木透干而壬癸全无，虽似有药，实则无水洗金，传统多断富贵虚浮，不应误提到真贵层次。',
    priority: 121,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['甲'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:有甲无壬癸', '成格层次:富贵虚浮'],
    hint: '辛金巳月有甲而无壬癸，多主富贵虚浮'
  },
  {
    id: 'si-month-xin-no-ren-gui-jia',
    label: '辛日巳月壬癸甲全无下品规则',
    description: '辛金生巳月，壬癸甲三者全无，则淘洗、润泽、疏通之药俱失；传统于普通格中多断下品，不应再抬到衣禄或富贵层次。',
    priority: 120,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸', '甲'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸', '甲'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:壬癸甲三者全无', '成格层次:下品之格'],
    hint: '辛金巳月壬癸甲三者全无，只作下品'
  },
  {
    id: 'wu-month-xin-ren-ji-visible-hidden-gui',
    label: '辛日午月壬己两透支见癸显达规则',
    description: '辛金生午月，若壬己两透，而癸水只在地支暗见且不落子支冲月，较合原文"壬己两透，支见癸水，不冲，定主显达"；此类既得湖海润沙，又有余润潜藏，不应仍按普通夏辛己壬并用泛断。',
    priority: 124,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '己'],
    requiredHiddenStems: ['癸'],
    forbiddenVisibleStems: ['癸'],
    forbiddenBranchPillarPairs: [
      {
        branch: '子'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['取用层次:壬己两透，支见癸水而不冲', '成格层次:定主显达'],
    hint: '辛金午月壬己两透而支见癸水不冲，多主显达'
  },
  {
    id: 'wu-month-xin-ren-visible-ji-hidden-gui-page',
    label: '辛日午月壬透己藏支见癸廪贡规则',
    description: '辛金生午月，若壬水透干，而己土不透只藏支内，地支又见癸水且不落子支冲月，层次虽低于壬己两透，仍较合原文"即己藏支，亦有廪贡"之意，不应退回普通午月辛金。',
    priority: 123,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    requiredHiddenStems: ['己', '癸'],
    forbiddenVisibleStems: ['己', '癸'],
    forbiddenBranchPillarPairs: [
      {
        branch: '子'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['取用层次:壬透而己藏支，兼见癸水不冲', '成格层次:亦有廪贡'],
    hint: '辛金午月壬透、己藏支而支见癸水不冲，亦主廪贡'
  },
  {
    id: 'wu-month-xin-gui-geng-no-ren-grace',
    label: '辛日午月癸出有庚衣锦规则',
    description: '辛金生午月，无壬而癸出，本已较壬力浅；但若再得庚金发源，较合原文"癸出有庚，必主衣锦，叨受恩荣"，不应仍与普通癸水权代或无壬异途同断。',
    priority: 123,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸', '庚'],
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:无壬而癸出有庚', '成格层次:衣锦恩荣'],
    hint: '辛金午月无壬而癸透又见庚，多主衣锦恩荣'
  },
  {
    id: 'wu-month-xin-no-ren-gui-wu-with-companion',
    label: '辛日午月无壬癸戊并见有辛不孤规则',
    description: '辛金生午月，若无壬而癸戊并见，本属燥泥埋金；但若天干再有一二重辛金比肩，较合原文"有一二重比肩，不致孤独"，仍主僧道之流，只是孤寒之象稍减，不应仍按全无比肩孤独论。',
    priority: 123,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸', '戊'],
    forbiddenVisibleStems: ['庚'],
    maxStemTotalCounts: {
      壬: 0
    },
    minVisibleStemCounts: {
      辛: 2
    },
    maxVisibleStemCounts: {
      辛: 3
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['破格因素:无壬而癸见戊', '成格层次:僧道之流', '成格转轻:一二比肩，不致孤独'],
    hint: '辛金午月无壬而癸戊并见，若再有一二重辛金，则僧道而不孤'
  },
  {
    id: 'wu-month-xin-no-ren-gui-wu-monastic',
    label: '辛日午月无壬癸戊并见僧道规则',
    description: '辛金生午月，若无壬而癸见戊，虽有午中己土亦成燥泥成灰，较合原文"癸见戊，虽有午宫己土，燥泥成灰，金必煆熔，反遭埋没，必为僧道"，不应仍误提到恩荣层次。',
    priority: 122,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸', '戊'],
    forbiddenVisibleStems: ['庚'],
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['破格因素:无壬而癸见戊', '成格层次:僧道之流'],
    hint: '辛金午月无壬而癸见戊，多主僧道'
  },
  {
    id: 'wu-month-xin-no-ren-ji-visible-alt-path',
    label: '辛日午月无壬有己异途规则',
    description: '辛金生午月，壬水为正用；若全局并无壬水而唯见己土透干，较合原文"无壬有己，须得异途"，只能在旁门别径中求取层次，不应仍按壬己并用显达论。',
    priority: 121,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['己'],
    forbiddenVisibleStems: ['癸'],
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '水'],
    traceHints: ['破格因素:无壬正用，仅见己土', '成格层次:须得异途'],
    hint: '辛金午月无壬而己透，多主异途进身'
  },
  {
    id: 'wu-month-xin-no-ren-gui-weak-substitute',
    label: '辛日午月无壬癸权代规则',
    description: '辛金生午月，壬水本为正用；若壬水不见而癸水透出，局中仍存己土承接，则可按原文"无壬，癸亦可用，但癸力小"作权代处理。此类可用而不及壬水正用，不应仍停留在泛化夏金先水的粗判断。',
    priority: 122,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸'],
    forbiddenVisibleStems: ['庚', '戊'],
    maxStemTotalCounts: {
      壬: 0
    },
    minStemTotalCounts: {
      己: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['取用层次:无壬而癸透，可权代为用', '成格层次:癸力小，不及壬水正用'],
    hint: '辛金午月无壬而癸透，若仍有己土承接，可作权代之用'
  },
  {
    id: 'wu-month-xin-fire-formation-ren-break-fire',
    label: '辛日午月火局壬透破火生员规则',
    description: '辛金生午月，若地支火局已成，即便癸水重见，亦难济烈火；必须壬水透干破火，方较合原文"得壬透破火方可，必主生员"之旨，不应仍把癸水权代误当足用。',
    priority: 124,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    requiredVisibleStems: ['壬'],
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['取用层次:支成火局，须壬透破火', '成格层次:必主生员'],
    hint: '辛金午月支成火局，得壬透破火，方可主生员'
  },
  {
    id: 'wu-month-xin-fire-formation-gui-heavy-no-ren',
    label: '辛日午月火局重癸无壬不济规则',
    description: '辛金生午月，若地支火局已成而壬水不透，即便癸水重见，仍较合原文"重见癸出，亦不济"之旨。此条应高于一般无壬癸可权代的宽规则，避免把火局烈势误作可用之水。',
    priority: 123,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['火'],
    minVisibleStemCounts: {
      癸: 2
    },
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['破格因素:支成火局，重见癸水亦难济火', '成格层次:癸水重见，亦不济火'],
    hint: '辛金午月火局既成而无壬透，即便癸水重见，亦不足济火'
  },
  {
    id: 'wu-month-xin-water-earth-heavy-see-jia',
    label: '辛日午月水土多见甲方妙规则',
    description: '辛金生午月，若全局水土并重，泥滞流壅，传统总以甲木疏土引流为妙；此条只是调剂转换，不应压过壬己两透、癸庚恩荣等更明确的偏式判断。',
    priority: 120,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['甲'],
    minWuxingCounts: {
      水: 3,
      土: 3
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        scope: 'total'
      },
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        scope: 'total'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水', '土'],
    traceHints: ['取用层次:水土并重', '取用调整:见甲疏土引流，方妙'],
    hint: '辛金午月水土多者，见甲木疏土引流方妙'
  },
  {
    id: 'wu-month-xin-wood-fire-heavy-no-metal-water-warning',
    label: '辛日午月木火过盛无金水运败规则',
    description: '辛金生午月，若木多火多而全局别无金水扶救，传统多作败象看待；原文并云"逢金水运必败"，此属从势失衡后的反向败应。该条重在补充传统警语依据，不另改前面更明确偏式的本命取用层级。',
    priority: 121,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minWuxingCounts: {
      木: 3,
      火: 3
    },
    maxWuxingCounts: {
      金: 1,
      水: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '土'],
    traceHints: ['破格因素:木火过盛，不见金水', '运势警语:逢金水运反败'],
    hint: '辛金午月木火过盛而不见金水，多成偏枯之象，行金水运反易败'
  },
  {
    id: 'wei-month-xin-ding-yi-with-ren-geng',
    label: '辛日未月丁乙出干兼见庚壬显贵规则',
    description: '辛金生未月，若丁乙透干而庚壬两字并见，既可制土护金，又能引水发源，传统多主显贵，不应只按普通未月辛金论。',
    priority: 124,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丁', '乙'],
    distinctStemGroupCounts: [
      {
        stems: ['庚', '壬'],
        minDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['庚', '壬'],
        minDistinctCount: 2,
        scope: 'total'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金', '木'],
    traceHints: ['取用层次:丁乙出干，庚壬并见', '成格层次:显贵'],
    hint: '辛金未月丁乙透干兼见庚壬，可主显贵'
  },
  {
    id: 'wei-month-xin-ding-yi-no-ren-fails',
    label: '辛日未月丁乙出干无壬不成规则',
    description: '辛金生未月，丁乙虽能制土通关，但原文紧接明言"无壬者，否"。若丁乙透干而全局无壬，则润泽之源终缺，不应仍按显贵或普通吉格宽论。',
    priority: 123,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['丁', '乙'],
    maxStemTotalCounts: {
      壬: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金', '木'],
    traceHints: ['破格因素:丁乙虽透，而无壬润泽', '成格层次:无壬者，否'],
    hint: '辛金未月丁乙虽透，但无壬润泽，终难成局'
  },
  {
    id: 'wei-month-xin-zi-ren-jia-ordinary',
    label: '辛日未月子壬湿泥见甲平人规则',
    description: '辛金生未月，若局中只有未中一己，而又见子支并有壬水，土随水湿，传统谓之湿泥，不可再见甲木；若甲出，则反损格局，只作平人，不应仍按壬庚两透或得甲制戊方吉论。',
    priority: 125,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '甲'],
    requiredBranchPillarPairs: [
      {
        branch: '子'
      }
    ],
    minStemTotalCounts: {
      己: 1,
      壬: 1
    },
    maxStemTotalCounts: {
      戊: 0,
      己: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:见子壬水，湿泥不能任甲', '成格层次:甲出反作平人'],
    hint: '辛金未月只有未中一己而见子壬水，若甲木再出，只作平人'
  },
  {
    id: 'wei-month-xin-single-ren-single-ji-geng-no-jia',
    label: '辛日未月一壬一己见庚无甲方妙规则',
    description: '辛金生未月，若壬水只一位，而己土只存未中一己，不再另透另藏，又见庚金发源且局中无甲牵制，最合原文"总以一壬一己，见庚无甲，方妙"之旨，不应仍停留在泛化壬庚两透层面。',
    priority: 124,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '庚'],
    forbiddenVisibleStems: ['甲', '戊', '己'],
    requiredHiddenStemBranchPairs: [
      {
        branch: '未',
        stem: '己',
        pillars: ['month']
      }
    ],
    minStemTotalCounts: {
      壬: 1,
      己: 1
    },
    maxStemTotalCounts: {
      戊: 0,
      壬: 1,
      己: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:一壬一己，见庚无甲', '成格层次:方妙'],
    hint: '辛金未月一壬一己而见庚无甲，最为方妙'
  },
  {
    id: 'wei-month-xin-ren-geng-no-wu',
    label: '辛日未月壬庚两透无戊科甲规则',
    description: '辛金生未月，己土当权，传统先壬后庚；若壬庚两透而戊不出干，较合原文科甲功名之象，不应仍与戊出破局同断。',
    priority: 123,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    forbiddenVisibleStems: ['戊'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '庚'],
        minDistinctCount: 2,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬庚两透', '成格层次:科甲功名'],
    hint: '辛金未月壬庚两透而无戊，可主科甲功名'
  },
  {
    id: 'wei-month-xin-wu-visible-no-jia-break',
    label: '辛日未月戊出无甲制破局规则',
    description: '辛金生未月，原文明言"忌戊出，得甲制之，方吉"。若戊土出干而甲木全无，即使局中尚存壬庚，也难去浊护水，不应仍按壬庚得用或方吉类规则抬断。',
    priority: 123,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['戊'],
    maxStemTotalCounts: {
      甲: 0
    },
    minStemTotalCounts: {
      壬: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:戊土出干而无甲制伏', '成格关键:土重掩金，壬水受壅'],
    hint: '辛金未月戊土出干而无甲木制伏，多作破局看待'
  },
  {
    id: 'wei-month-xin-wu-jia-geng-break',
    label: '辛日未月庚出制甲破局规则',
    description: '辛金生未月，戊土出干本赖甲木制之；若庚金再出反制甲木，则甲不得力，戊土无从节制，传统以此为忌，不应仍按甲隔位制戊方吉处理。',
    priority: 123,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['戊', '甲', '庚'],
    minStemTotalCounts: {
      壬: 1,
      己: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:庚金出干，反制甲木', '成格关键:甲木受伤，难制戊土'],
    hint: '辛金未月戊出虽有甲木，但庚又出干制甲，难成方吉'
  },
  {
    id: 'wei-month-xin-wu-jia-adjacent-ji',
    label: '辛日未月甲贴己贪合下贱规则',
    description: '辛金生未月，若戊土出干而局中又有壬水可用，本可借甲木制戊；但甲若与己相贴，反生贪合，难以去土护水，传统多作下贱之格，不应仍按得甲制戊方吉看待。',
    priority: 123,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['戊', '甲', '己'],
    forbiddenVisibleStems: ['庚'],
    minStemTotalCounts: {
      壬: 1
    },
    requiredVisibleStemDistancePairs: [
      {
        stems: ['甲', '己'],
        maxDistance: 1
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['破格因素:甲木贴己，反成贪合', '成格层次:下贱之格'],
    hint: '辛金未月戊出而甲己相贴，贪合反掩金光，多主下贱'
  },
  {
    id: 'wei-month-xin-wu-jia-separated',
    label: '辛日未月戊出甲隔位制土方吉规则',
    description: '辛金生未月，若戊土出干而局中又有壬水可用，得甲木制戊方吉；但甲须隔位，不可近己贪合，且不宜庚出制甲。此类重在甲木隔位护水制土，层次虽不及壬庚两透无戊，仍可作方吉看待。',
    priority: 122,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['戊', '甲', '己'],
    forbiddenVisibleStems: ['庚'],
    minStemTotalCounts: {
      壬: 1
    },
    requiredVisibleStemDistancePairs: [
      {
        stems: ['甲', '己'],
        minDistance: 2
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:戊出而得甲制', '成格关键:甲木隔位，不与己合', '成格层次:方吉'],
    hint: '辛金未月戊出而得甲隔位制土，方可言吉'
  },
  {
    id: 'wei-month-xin-ren-geng-hidden-glory',
    label: '辛日未月壬庚藏支得所荣华规则',
    description: '辛金生未月，壬庚即不出干而能同藏得所，传统亦许荣华；此层次虽不及两透科甲，但明显高于普通土厚金埋之局。',
    priority: 122,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    distinctStemGroupCounts: [
      {
        stems: ['壬', '庚'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '庚'],
        minDistinctCount: 2,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬庚不透，藏支得所', '成格层次:亦有荣华'],
    hint: '辛金未月壬庚虽不透而藏支得所，亦有荣华'
  },
  {
    id: 'wei-month-xin-wood-formation-ren-visible-geng-total',
    label: '辛日未月木局壬透见庚富贵规则',
    description: '辛金生未月，若地支成木局而壬水透干，又有庚金发源，最合原文富贵层次，不应仍按普通土厚金埋概论。',
    priority: 122,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['木'],
    requiredVisibleStems: ['壬'],
    minStemTotalCounts: {
      庚: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '金', '木'],
    traceHints: ['取用层次:木局成势，壬透庚发源', '成格层次:可云富贵'],
    hint: '辛金未月支成木局而壬透见庚，可云富贵'
  },
  {
    id: 'shen-month-xin-metal-rich-ren-jia-single-wu',
    label: '辛日申月金多壬透一戊见甲富贵规则',
    description: '辛金生申月，若四柱金多而得壬水透干泄秀，又止存一位戊土为卫，再有甲木制戊，则金水流通而不致壅滞，较合原文"若一金水，得一戊土，又宜甲制，自然富贵"之意。',
    priority: 125,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    minStemTotalCounts: {
      甲: 1,
      壬: 1,
      戊: 1
    },
    maxStemTotalCounts: {
      癸: 0,
      戊: 1
    },
    minWuxingCounts: {
      金: 4
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:金多得壬泄秀，一戊为卫', '成格关键:甲木制戊', '成格层次:自然富贵'],
    hint: '辛金申月金多而壬透、一戊得甲制，多主自然富贵'
  },
  {
    id: 'shen-month-xin-ren-in-shen-no-extra-wu',
    label: '辛日申月壬居申中无额外戊清正规则',
    description: '辛金生申月，庚令当权而壬水居申，若全局不再另见戊土，止存申中一戊为壬岸，最合原文"为官清正，但不富耳"之旨，不应混入土重有病之局。',
    priority: 124,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    forbiddenVisibleStems: ['癸'],
    requiredHiddenStemBranchPairs: [
      {
        branch: '申',
        stem: '壬',
        pillars: ['month']
      }
    ],
    maxStemTotalCounts: {
      戊: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬水居申，戊止申中为岸', '成格层次:为官清正，但不富耳'],
    hint: '辛金申月壬居申中而不另见戊土，多主官清而不富'
  },
  {
    id: 'shen-month-xin-water-rich-wu-supported-longevity',
    label: '辛日申月水多戊重得生福寿规则',
    description: '辛金生申月，若干支水多而戊土重见，再得火气生扶戊土，使堤岸有根，较合原文"干支水多，重见戊土，逢生得位，福寿之造"之意，不应与普通土重无甲混作常人格。',
    priority: 124,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      戊: 2
    },
    minWuxingCounts: {
      水: 4,
      火: 1
    },
    usefulWuxing: '土',
    favorableOrder: ['土', '水'],
    traceHints: ['取用层次:干支水多，重见戊土', '成格关键:戊土得火生扶', '成格层次:福寿之造'],
    hint: '辛金申月干支水多而戊土重见并得火生，多主福寿'
  },
  {
    id: 'shen-month-xin-earth-with-jia',
    label: '辛日申月有土见甲衣衿规则',
    description: '辛金生申月，若局中土气再增，便成有病之象；此时得甲木疏土，传统多许衣衿可望，不应仍与无甲常人并断。',
    priority: 123,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minStemTotalCounts: {
      甲: 1
    },
    minTenGodCategoryTotalCounts: {
      印星: 2
    },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:土重得甲疏通', '成格层次:衣衿可望'],
    hint: '辛金申月局中有土而得甲木疏之，可望衣衿'
  },
  {
    id: 'shen-month-xin-earth-no-jia',
    label: '辛日申月有土无甲常人规则',
    description: '辛金生申月，若局中土气再增而甲木不出，则成有病无药，传统只作常人，不应误抬到衣衿或富贵层次。',
    priority: 122,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    maxStemTotalCounts: {
      甲: 0
    },
    minTenGodCategoryTotalCounts: {
      印星: 2
    },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:土重而无甲疏土', '成格层次:有病无药，常人'],
    hint: '辛金申月局中有土而不见甲木，多作常人'
  },
  {
    id: 'shen-month-xin-gui-only-not-usable',
    label: '辛日申月独癸不可为用规则',
    description: '辛金生申月，总纲明言壬水为尊、甲戊酌用，而癸水不可为用。若天干只见癸而不见壬透，则不应仍按秋金喜水的泛化总纲直接先取水，而应退取甲戊。',
    priority: 121,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['癸'],
    forbiddenVisibleStems: ['壬'],
    usefulWuxing: '木',
    favorableOrder: ['木', '土', '水'],
    traceHints: ['取用总纲:壬水为尊，甲戊酌用', '破格因素:独见癸水，不可为用', '取用调整:退取甲木与戊土'],
    hint: '辛金申月若只见癸而不见壬，不宜仍先取水，当退取甲戊'
  },
  {
    id: 'shen-month-xin-metal-many-shallow-water-balance',
    label: '辛日申月水浅金多体全规则',
    description: '辛金生申月，原文总纲明言"壬不在多，水浅金多，号曰体全之象，壬水为尊，甲戊酌用可也"。因此当局中金气偏多、壬水已透而不过多时，应独立标出此条，不应仍只停留在泛化秋金喜水，亦不可把多壬之局混入此象。',
    priority: 120,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    minWuxingCounts: {
      金: 4
    },
    maxWuxingCounts: {
      水: 3
    },
    maxVisibleStemCounts: {
      壬: 1
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木', '土'],
    traceHints: ['取用总纲:水浅金多，号曰体全之象', '取用层次:壬水为尊，甲戊酌用'],
    hint: '辛金申月金多水浅而壬透不过多，可作体全之象，仍以壬为尊'
  },
  {
    id: 'you-month-xin-pure-xin-single-ren',
    label: '辛日酉月一派辛金一壬无庚富贵规则',
    description: '辛金生酉月，若天干纯见辛金而只得一位壬水，且不杂庚与他神，最合淘洗群金之法，传统多主富中取贵。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    minVisibleStemCounts: {
      辛: 3
    },
    maxVisibleStemCounts: {
      壬: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    maxTenGodCategoryVisibleDistinctCounts: {
      财星: 0,
      官杀: 0,
      印星: 0
    },
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:一派辛金，一位壬水', '成格层次:富中取贵'],
    hint: '辛金酉月一派辛金而只见一壬、无庚杂乱，多主富中取贵'
  },
  {
    id: 'you-month-xin-ren-jia-single-no-geng',
    label: '辛日酉月壬甲各一无庚恩荣规则',
    description: '辛金生酉月，若比肩一二、壬甲各一而庚不出干，传统亦许恩荣；此类重在壬甲适度而不杂庚，不应误作土厚埋金或壬水无力之格。',
    priority: 122,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '甲'],
    minVisibleStemCounts: { '辛': 2 },
    maxVisibleStemCounts: { '辛': 3, '壬': 1, '甲': 1 },
    distinctStemGroupCounts: [
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:壬甲皆一，比肩相随', '成格层次:亦有恩荣'],
    hint: '辛金酉月比肩一二而壬甲各一、无庚杂乱，亦有恩荣'
  },
  {
    id: 'you-month-xin-ren-many-jia-no-geng',
    label: '辛日酉月一壬甲多无庚奸诈规则',
    description: '辛金生酉月，若只一壬透而甲木偏多，水被群甲泄去，用神无力；又不见庚金制甲，传统多断奸诈之徒，不应仍按壬甲适度的恩荣层次看待。',
    priority: 123,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    maxVisibleStemCounts: {
      壬: 1
    },
    minStemTotalCounts: {
      甲: 2
    },
    maxStemTotalCounts: {
      庚: 0
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['破格因素:一壬被群甲泄气', '成格关键:无庚制甲', '成格层次:奸诈之徒'],
    hint: '辛金酉月一壬而甲多、又无庚制甲，多主奸诈'
  },
  {
    id: 'you-month-xin-ren-many-jia-with-geng',
    label: '辛日酉月一壬甲多得庚仁义规则',
    description: '辛金生酉月，若一壬透而甲木偏多，本有泄水之患；但再得庚金制甲，则可挽回用神无力之弊，传统多主仁义，不应仍按奸诈之徒下断。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    maxVisibleStemCounts: {
      壬: 1
    },
    minStemTotalCounts: {
      甲: 2,
      庚: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:一壬甲多而得庚制甲', '成格关键:庚金护壬', '成格层次:反主仁义'],
    hint: '辛金酉月一壬而甲多，若得庚制甲，反主仁义'
  },
  {
    id: 'you-month-xin-three-xin-single-ren-many-jia-geng-rich',
    label: '辛日酉月三辛一壬甲多庚透大富贵规则',
    description: '辛金生酉月，若辛金总见三重以上、一壬明透、甲木偏多而再得庚金透出制甲，较"得庚制甲反主仁义"更进一步，对应原文"三点辛金，一重壬水，多见甲木，有庚透者，主大富贵"；这里将"三点辛金"落为辛金总量三重以上，以免与"庚透"在四柱明干上发生结构冲突。',
    priority: 128,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '庚'],
    maxVisibleStemCounts: {
      壬: 1
    },
    minStemTotalCounts: {
      辛: 3,
      甲: 2
    },
    maxStemTotalCounts: {
      丁: 0
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:三辛一壬，甲多得庚', '成格关键:庚透制甲而护壬', '成格层次:主大富贵'],
    hint: '辛金酉月三辛一壬、甲多而庚透制甲，不见丁者，主大富贵'
  },
  {
    id: 'you-month-xin-three-xin-single-ren-many-jia-geng-ding-refined',
    label: '辛日酉月三辛一壬甲多庚透见丁降格规则',
    description: '辛金生酉月，若已成三辛一壬、甲多得庚之局，但再见一丁，则不复按"大富贵"取象，应依原文降为"风雅清高，衣食饶裕而已"；这里将"见丁"按总见丁火处理，不限于明透，以贴近传统"见"字口径。',
    priority: 129,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '庚'],
    maxVisibleStemCounts: {
      壬: 1
    },
    minStemTotalCounts: {
      辛: 3,
      甲: 2,
      丁: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:三辛一壬，甲多得庚', '破格因素:见丁火而减贵', '成格层次:风雅清高，衣食饶裕'],
    hint: '辛金酉月三辛一壬、甲多而庚透，若再见丁火，则多主风雅清高，衣食饶裕'
  },
  {
    id: 'you-month-xin-soil-bury-metal-no-jia',
    label: '辛日酉月土厚埋金愚懦规则',
    description: '辛金生酉月，若辛金根气已成、总见二重以上而只一壬水，复见戊土偏多，则成土厚埋金之象；若又不见甲木疏土，传统多主愚懦，不应仍按壬甲恩荣或富中取贵论。',
    priority: 123,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬'],
    maxStemTotalCounts: {
      壬: 1,
      甲: 0
    },
    minStemTotalCounts: {
      辛: 2,
      戊: 2
    },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:土厚埋金，一壬难润', '成格层次:此人愚懦'],
    hint: '辛金酉月比肩并见而一壬、戊土多见又无甲，多主愚懦'
  },
  {
    id: 'you-month-xin-soil-bury-metal-with-jia',
    label: '辛日酉月土厚埋金见甲创立规则',
    description: '辛金生酉月，若辛金根气已成、总见二重以上，一壬而戊土多见，本为土厚埋金；但若甲木透出疏土，则格局转活，传统多主创立有为，不应仍按愚懦层次处理。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['壬', '甲'],
    maxStemTotalCounts: {
      壬: 1
    },
    minStemTotalCounts: {
      辛: 2,
      戊: 2
    },
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['取用层次:土厚埋金而甲木透出', '成格关键:甲木疏土', '成格层次:必为创立之人'],
    hint: '辛金酉月土厚埋金，若得甲木透出疏土，多主创立有为'
  },
  {
    id: 'you-month-xin-metal-formation-no-ren-with-ding',
    label: '辛日酉月金局无壬见丁锻炼规则',
    description: '辛金生酉月，若支成金局而无壬淘洗，传统总纲先改以丁火为先；若柱中又已见丁火锻炼，则局不至落入凶顽无赖，此时重在得丁为药，不应再与无丁同断。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['金'],
    minVisibleStemCounts: {
      辛: 2
    },
    minStemTotalCounts: {
      丁: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:支成金局，无壬淘洗', '用神转换:此宜用丁', '成格关键:得丁锻炼'],
    hint: '辛金酉月支成金局而无壬淘洗，已见丁火锻炼'
  },
  {
    id: 'you-month-xin-metal-formation-no-ren-no-ding',
    label: '辛日酉月金局无壬无丁凶顽规则',
    description: '辛金生酉月，若支成金局、干见比肩而壬水不透不藏，传统总纲先改以丁火为先；若又无丁火锻炼，则直断凶顽无赖，不应只停留在抽象宜丁层面。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['金'],
    minVisibleStemCounts: {
      辛: 2
    },
    forbiddenVisibleStems: ['丁'],
    forbiddenHiddenStems: ['丁'],
    distinctStemGroupCounts: [
      {
        stems: ['壬'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬'],
        maxDistinctCount: 0,
        scope: 'hidden'
      }
    ],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    traceHints: ['取用层次:支成金局，无壬淘洗', '用神转换:此宜用丁', '破格因素:金局无壬且无丁', '成格层次:凶顽无赖'],
    hint: '辛金酉月支成金局而无壬无丁，多主凶顽无赖'
  },
  {
    id: 'you-month-xin-metal-formation-ren-high',
    label: '辛日酉月金局壬高透一清到底规则',
    description: '辛金生酉月，若地支成金局而壬水高透，可泄群金成一清到底之象，传统多主清贵，不应仍按无壬金局用丁论。',
    priority: 126,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['金'],
    requiredVisibleStems: ['壬'],
    minVisibleStemCounts: {
      辛: 2
    },
    maxVisibleStemCounts: {
      辛: 4,
      壬: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '木'],
    traceHints: ['取用层次:支成金局，壬水高透', '成格层次:一清到底'],
    hint: '辛金酉月支成金局而壬水高透，可成一清到底之象'
  },
  {
    id: 'you-month-xin-white-tiger',
    label: '辛日酉月金局土透壬透无火白虎规则',
    description: '辛金生酉月，若地支成金局，戊己透干而壬亦透、又无丙丁火破局，传统称白虎格，多主西北发显，不应与平常土重同断。',
    priority: 125,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['金'],
    requiredVisibleStems: ['壬'],
    forbiddenVisibleStems: ['丙', '丁'],
    distinctStemGroupCounts: [
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:金局土透，壬透无火', '成格层次:白虎格'],
    hint: '辛金酉月支成金局而戊己透、壬透无火，可作白虎格'
  },
  {
    id: 'you-month-xin-white-tiger-with-fire-ordinary',
    label: '辛日酉月白虎格见丙火平庸规则',
    description: '辛金生酉月，白虎格最忌丙火破局；若金局土透而壬透，又见丙火，传统即降为平庸，不应仍按白虎格高断。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredFormationWuxings: ['金'],
    requiredVisibleStems: ['壬', '丙'],
    distinctStemGroupCounts: [
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['破格因素:白虎格见丙火', '成格层次:亦属平庸'],
    hint: '辛金酉月白虎格若透丙火，虽有壬出，亦属平庸'
  },
  {
    id: 'you-month-xin-pure-ji-monastic',
    label: '辛日酉月一派己土僧道规则',
    description: '辛金生酉月，若天干只见一二辛金而余皆己土，不杂庚戊与木火水神，正合原文"一二辛金，一派己土"，传统多断僧道，不应仍退回秋金泛取壬水。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minVisibleStemCounts: {
      辛: 1,
      己: 2
    },
    maxVisibleStemCounts: {
      辛: 2
    },
    distinctStemGroupCounts: [
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['甲', '乙'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['丙', '丁'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    traceHints: ['破格因素:一派己土，壅金埋光', '成格层次:定为僧道'],
    hint: '辛金酉月一二辛金而一派己土，多主僧道'
  },
  {
    id: 'you-month-xin-ji-with-geng-jia-hidden-leisure',
    label: '辛日酉月己透支见庚甲安闲规则',
    description: '辛金生酉月，若己土透干而地支又见庚甲，较前式纯土壅金之局稍有转机，传统多主一生安闲，不应仍按僧道或普通秋金泛论。',
    priority: 125,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['己'],
    requiredHiddenStems: ['庚', '甲'],
    distinctStemGroupCounts: [
      {
        stems: ['戊', '己'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      }
    ],
    usefulWuxing: '木',
    favorableOrder: ['木', '金', '水'],
    traceHints: ['取用层次:己土透干，支见庚甲', '成格层次:一生安闲'],
    hint: '辛金酉月己土透干而地支又见庚甲，多主一生安闲'
  },
  {
    id: 'you-month-xin-water-flood-no-wu',
    label: '辛日酉月壬水成派无戊奔波规则',
    description: '辛金生酉月，若天干一派壬水泄金而无戊土出制或藏支止流，正合原文"沙水同流"之象，传统多主奔波贫苦，不应仍按秋金泛取水上断。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minVisibleStemCounts: {
      辛: 1,
      壬: 3
    },
    maxVisibleStemCounts: {
      辛: 1
    },
    maxStemTotalCounts: {
      戊: 0
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['甲', '乙', '丙', '丁', '戊', '己'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '土',
    favorableOrder: ['土', '金'],
    traceHints: ['破格因素:壬水成派，无戊止流', '成格层次:沙水同流，奔波贫苦'],
    hint: '辛金酉月一派壬水泄金而无戊止流，多主奔波贫苦'
  },
  {
    id: 'you-month-xin-water-flood-hidden-wu-artistry',
    label: '辛日酉月壬水成派支见一戊才略规则',
    description: '辛金生酉月，若天干壬水成派泄金，本有沙水同流之患；但若地支独见一戊止流，则较合原文"支见一戊止流"，传统多主才略与艺术，不应仍按奔波贫苦处理。',
    priority: 125,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minVisibleStemCounts: {
      辛: 1,
      壬: 3
    },
    maxVisibleStemCounts: {
      辛: 1,
      戊: 0
    },
    requiredHiddenStems: ['戊'],
    maxStemTotalCounts: {
      戊: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['壬', '癸'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['甲', '乙', '丙', '丁', '己'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '土',
    favorableOrder: ['土', '金', '水'],
    traceHints: ['取用层次:壬水成派，支见一戊止流', '成格层次:颇有才略，艺术过人'],
    hint: '辛金酉月一派壬水而地支独见一戊止流，多主才略与艺术'
  },
  {
    id: 'you-month-xin-yi-wood-no-geng-ren',
    label: '辛日酉月一派乙木无庚壬才多身弱规则',
    description: '辛金生酉月，若天干乙木成派而不见庚壬，正合原文"一派乙木，不见庚壬"，传统多断才多身弱，不应仍按秋金泛取壬水或误提到富贵层次。',
    priority: 124,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    minVisibleStemCounts: {
      辛: 1,
      乙: 3
    },
    maxVisibleStemCounts: {
      辛: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['甲', '乙'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['庚', '辛'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['丙', '丁', '戊', '己'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['破格因素:一派乙木，不见庚壬', '成格层次:才多身弱'],
    hint: '辛金酉月一派乙木而不见庚壬，多主才多身弱'
  },
  {
    id: 'you-month-xin-yi-wood-with-geng',
    label: '辛日酉月一派乙木见庚富贵规则',
    description: '辛金生酉月，若乙木成派，本有财多身弱之患；但一见庚金制乙，则较合原文"一见庚制，富贵可期"，不应仍按才多身弱处理。',
    priority: 125,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    requiredVisibleStems: ['庚'],
    minVisibleStemCounts: {
      辛: 1,
      乙: 2
    },
    maxVisibleStemCounts: {
      辛: 1
    },
    distinctStemGroupCounts: [
      {
        stems: ['甲', '乙'],
        minDistinctCount: 1,
        maxDistinctCount: 1,
        scope: 'visible'
      },
      {
        stems: ['壬', '癸'],
        maxDistinctCount: 0,
        scope: 'visible'
      },
      {
        stems: ['丙', '丁', '戊', '己'],
        maxDistinctCount: 0,
        scope: 'visible'
      }
    ],
    usefulWuxing: '金',
    favorableOrder: ['金', '水'],
    traceHints: ['取用层次:一派乙木，得庚金裁制', '成格层次:富贵可期'],
    hint: '辛金酉月乙木成派而得庚金裁制，富贵可期'
  },
  {
    id: 'you-month-xin-wuzi-chaoyang-authority',
    label: '辛日酉月戊子时巳酉丑全位重权高规则',
    description: '辛金生酉月，若辛日而时上戊子成六阴朝阳，又见巳酉丑金局全、庚辛并见，则较单纯朝阳更进一层，对应原文"庚辛局全巳酉丑，位重权高"；这里将"局全"落为支见巳酉丑全备，并保留庚辛同见作为成局标志。',
    priority: 131,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    hourBranches: ['子'],
    requiredVisibleStemPillarPairs: [
      {
        stem: '戊',
        pillars: ['hour']
      }
    ],
    requiredBranchPillarPairs: [
      {
        branch: '巳'
      },
      {
        branch: '丑'
      }
    ],
    forbiddenVisibleStems: ['丙', '丁'],
    distinctStemGroupCounts: [
      {
        stems: ['庚', '辛'],
        minDistinctCount: 2,
        scope: 'total'
      }
    ],
    usefulWuxing: '土',
    favorableOrder: ['土', '金', '水'],
    traceHints: ['取象依据:六阴朝阳', '成格关键:庚辛并见，巳酉丑全', '成格层次:位重权高'],
    hint: '辛金酉月戊子时而巳酉丑金局全、庚辛并见，多主位重权高'
  },
  {
    id: 'you-month-xin-wuzi-chaoyang',
    label: '辛日酉月戊子时六阴朝阳规则',
    description: '辛金生酉月，若辛日时上戊子而不见丙丁离位，合乎原文"六辛日透戊子时，运喜西方，阴若朝阳"；该条属于更窄的时柱格象，应高于一般酉月辛金常规格局。',
    priority: 130,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['辛'],
    hourBranches: ['子'],
    requiredVisibleStemPillarPairs: [
      {
        stem: '戊',
        pillars: ['hour']
      }
    ],
    forbiddenVisibleStems: ['丙', '丁'],
    usefulWuxing: '土',
    favorableOrder: ['土', '金', '水'],
    traceHints: ['取象依据:六阴朝阳', '成格关键:时上戊子而不见丙丁', '成格层次:阴若朝阳'],
    hint: '辛金酉月辛日得戊子时而不见丙丁离位，多成六阴朝阳'
  },
  {
    id: 'autumn-metal-water-polish',
    label: '秋金壬癸清润规则',
    description: '申酉戌月金气刚燥时，宜先取水清润洗炼。',
    priority: 102,
    months: ['申', '酉', '戌'],
    dayMasters: ['金'],
    usefulWuxing: '水',
    hint: '秋金刚燥，宜水洗清润'
  },
  // 庚日穷通宝鉴规则
  {
    id: 'yin-month-geng-jia-bing-xin',
    label: '庚日寅月甲丙丁并用规则',
    description: '庚金生寅月，春初犹寒，传统多以丁火为君、甲木为臣、丙火为佐，较一般春金扶抑更细。',
    priority: 120,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['丁', '甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金寅月，丁火为君，甲木为臣，丙火为佐'
  },
  {
    id: 'yin-month-geng-jia-first',
    label: '庚日寅月先甲次丁规则',
    description: '庚金生寅月，木令初春，传统多先甲木裁抑，次取丁火温炼，顺序不可倒置。',
    priority: 119,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    hint: '庚金寅月，先甲次丁'
  },
  {
    id: 'yin-month-geng-wu-xin-ji',
    label: '庚日寅月戊壬丁透贵显规则',
    description: '庚金生寅月，若戊壬丁三者并透，较合原文"庚金生寅月，身强才旺有根，戊壬丁三者并透，定主云程路达"。',
    priority: 123,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['戊', '壬', '丁'],
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['取用层次:戊壬丁三者并透', '成格层次:云程路达'],
    hint: '庚金寅月戊壬丁三者并透，多主云程路达'
  },
  {
    id: 'yin-month-geng-wood-fire-both',
    label: '庚日寅月木火两旺规则',
    description: '庚金生寅月，木火并旺时，庚金身强可任财官，传统多主富贵可期。',
    priority: 121,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    minWuxingCounts: { '木': 3, '火': 2 },
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金寅月木火两旺，可任财官'
  },
  {
    id: 'si-month-geng-jia-bing-first',
    label: '庚日巳月先丙后甲规则',
    description: '庚金生巳月，火旺金熔，传统多以丙火为君、甲木为佐，壬水为使，较一般夏金扶抑更合原法。',
    priority: 122,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '水'],
    hint: '庚金巳月，先丙后甲'
  },
  {
    id: 'si-month-geng-bing-ren-jia-all',
    label: '庚日巳月丙壬甲全透极品规则',
    description: '庚金生巳月，丙壬甲三者全透，较合原文"庚金生巳月，丙壬甲三者全透，鼎甲可期"。',
    priority: 126,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['丙', '壬', '甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '木'],
    traceHints: ['取用层次:丙壬甲三者全透', '成格层次:鼎甲可期'],
    hint: '庚金巳月丙壬甲三者全透，鼎甲可期'
  },
  {
    id: 'si-month-geng-bing-first-jia-assist',
    label: '庚日巳月丙火为先甲木佐之规则',
    description: '庚金生巳月，丙火当权司令，传统以丙火为先、甲木为佐，方能锻链成器。',
    priority: 121,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金巳月，丙火为先，甲木佐之'
  },
  {
    id: 'wu-month-geng-bing-ren-jia-all',
    label: '庚日午月丙壬甲全透富贵规则',
    description: '庚金生午月，丙火当令，壬水为佐，甲木为使；若三者全透，多主富贵双全。',
    priority: 125,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['丙', '壬', '甲'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '木'],
    traceHints: ['取用层次:丙壬甲三者全透', '成格层次:富贵双全'],
    hint: '庚金午月丙壬甲三者全透，富贵双全'
  },
  {
    id: 'wu-month-geng-bing-jia-first',
    label: '庚日午月先丙后甲壬规则',
    description: '庚金生午月，火烈金熔，传统多先取丙火制刃，次甲木裁抑，壬水洗涤，方可成器。',
    priority: 122,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '水'],
    hint: '庚金午月，先丙后甲壬'
  },
  {
    id: 'wei-month-geng-jia-gui-all',
    label: '庚日未月甲丙癸全透极品规则',
    description: '庚金生未月，若甲丙癸三者全透，较合原文"庚金生未月，三者全透，鼎甲可期"。',
    priority: 125,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['甲', '丙', '癸'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '木'],
    traceHints: ['取用层次:甲丙癸三者全透', '成格层次:鼎甲可期'],
    hint: '庚金未月甲丙癸三者全透，鼎甲可期'
  },
  {
    id: 'wei-month-geng-bing-jia-first',
    label: '庚日未月先丙后甲规则',
    description: '庚金生未月，夏土司权，金得火炼，传统以丙火为先、甲木次之，癸水佐之。',
    priority: 121,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '水'],
    hint: '庚金未月，先丙后甲癸'
  },
  {
    id: 'shen-month-geng-jia-bing-first',
    label: '庚日申月丁甲丙先庚规则',
    description: '庚金生申月，秋金得令，传统多先丁火锻炼，次甲木裁抑，丙火为佐，较一般秋金喜水更合原法。',
    priority: 120,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金申月，先丁次甲，丙火为佐'
  },
  {
    id: 'shen-month-geng-jia-ding-all',
    label: '庚日申月甲丁两透富贵规则',
    description: '庚金生申月，若甲丁两透而身强，较合原文"身强才旺有根，甲丁两透，定主雁塔有名"。',
    priority: 123,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['甲', '丁'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    traceHints: ['取用层次:甲丁两透', '成格层次:雁塔有名'],
    hint: '庚金申月甲丁两透，多主雁塔有名'
  },
  {
    id: 'you-month-geng-jia-ding-first',
    label: '庚日酉月先丁次甲规则',
    description: '庚金生酉月，金旺极而刚，需丁火锻炼、甲木裁抑，方能成器。',
    priority: 120,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金酉月，先丁次甲'
  },
  {
    id: 'xu-month-geng-ding-jia-first',
    label: '庚日戌月先丁后甲壬规则',
    description: '庚金生戌月，秋深气寒，需丁火温暖、甲木裁抑、壬水洗涤，方能成器。',
    priority: 120,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '水'],
    hint: '庚金戌月，先丁后甲壬'
  },
  {
    id: 'hai-month-geng-bing-jia-first',
    label: '庚日亥月先丁后甲规则',
    description: '庚金生亥月，水冷金寒，传统多以丁火为先、甲木为佐，暖局锻链。',
    priority: 121,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金亥月，先丁后甲'
  },
  {
    id: 'zi-month-geng-bing-ding-all',
    label: '庚日子月丙丁甲全透极品规则',
    description: '庚金生子月，寒冬金冷，若丙丁甲三者全透，多主富贵极品。',
    priority: 126,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['丙', '丁', '甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    traceHints: ['取用层次:丙丁甲三者全透', '成格层次:富贵极品'],
    hint: '庚金子月丙丁甲三者全透，富贵极品'
  },
  {
    id: 'zi-month-geng-bing-first',
    label: '庚日子月先丙后甲丁规则',
    description: '庚金生子月，金寒水冷，传统多以丙火解冻为先、丁火次之、甲木佐助。',
    priority: 121,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金子月，先丙后丁甲'
  },
  {
    id: 'chou-month-geng-bing-first',
    label: '庚日丑月先丁后甲规则',
    description: '庚金生丑月，湿寒交加，传统多以丁火解冻、甲木疏土为用，较冬金寒土更细。',
    priority: 121,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金丑月，先丁后甲'
  },
  // 壬日穷通宝鉴规则
  {
    id: 'yin-month-ren-geng-bing-first',
    label: '壬日寅月先庚次丙规则',
    description: '壬水生寅月，失令而寒，传统多先取庚金发源，次取丙火除寒，较单用金水更完整。',
    priority: 120,
    months: ['寅'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    hint: '壬水寅月，先庚次丙'
  },
  {
    id: 'yin-month-ren-bing-geng-jia',
    label: '壬日寅月丙庚甲全透显达规则',
    description: '壬水生寅月，若丙庚甲三者全透，较合原文"身强才旺有根，丙庚甲三者全透，定主雁塔有名"。',
    priority: 124,
    months: ['寅'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['丙', '庚', '甲'],
    usefulWuxing: '金',
    favorableOrder: ['金', '火', '木'],
    traceHints: ['取用层次:丙庚甲三者全透', '成格层次:雁塔有名'],
    hint: '壬水寅月丙庚甲三者全透，多主雁塔有名'
  },
  {
    id: 'yin-month-ren-geng-first-bing-assist',
    label: '壬日寅月庚金为先丙火为佐规则',
    description: '壬水生寅月，庚金发源为主，丙火除寒为佐，较简单金水扶抑更贴合原法。',
    priority: 120,
    months: ['寅'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '火'],
    hint: '壬水寅月，庚金为先，丙火为佐'
  },
  {
    id: 'mao-month-ren-bing-jia-all',
    label: '壬日卯月丙甲两透科甲规则',
    description: '壬水生卯月，若丙甲两透，较合原文"壬水生卯月，身强才旺有根，丙甲两透，定主雁塔有名"。',
    priority: 123,
    months: ['卯'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['丙', '甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    traceHints: ['取用层次:丙甲两透', '成格层次:雁塔有名'],
    hint: '壬水卯月丙甲两透，多主雁塔有名'
  },
  {
    id: 'mao-month-ren-bing-first',
    label: '壬日卯月先丙后甲规则',
    description: '壬水生卯月，卯木泄水生火，传统多以丙火为君、甲木为臣，先暖后发。',
    priority: 118,
    months: ['卯'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '壬水卯月，先丙后甲'
  },
  {
    id: 'si-month-ren-bing-jia-first',
    label: '壬日巳月先丙后甲规则',
    description: '壬水生巳月，火旺水弱，传统多先取丙火调候，次甲木疏通，较单用比肩更完整。',
    priority: 110,
    months: ['巳'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '壬水巳月，先丙后甲'
  },
  {
    id: 'si-month-ren-bing-jia-xin-all',
    label: '壬日巳月丙甲辛全透极品规则',
    description: '壬水生巳月，丙甲辛三者全透，较合原文"壬水生巳月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['巳'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['丙', '甲', '辛'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲辛三者全透', '成格层次:鼎甲可期'],
    hint: '壬水巳月丙甲辛三者全透，鼎甲可期'
  },
  {
    id: 'wu-month-ren-bing-first',
    label: '壬日午月先丙后辛规则',
    description: '壬水生午月，丁火司权，传统多以丙火制刃为先、辛金发源为佐，较夏水泛化更细。',
    priority: 120,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    hint: '壬水午月，先丙后辛'
  },
  {
    id: 'wu-month-ren-bing-xin-all',
    label: '壬日午月丙辛两透富贵规则',
    description: '壬水生午月，若丙辛两透，较合原文"壬水生午月，身强才旺有根，丙辛两透，定主雁塔有名"。',
    priority: 123,
    months: ['午'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['丙', '辛'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    traceHints: ['取用层次:丙辛两透', '成格层次:雁塔有名'],
    hint: '壬水午月丙辛两透，多主雁塔有名'
  },
  {
    id: 'shen-month-ren-wu-ding-first',
    label: '壬日申月先戊后丁规则',
    description: '壬水生申月，源远流长，传统多以戊土制水为先、丁火为佐，不宜仍按秋水清润一概论。',
    priority: 120,
    months: ['申'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    hint: '壬水申月，先戊后丁'
  },
  {
    id: 'shen-month-ren-wu-ding-jia-all',
    label: '壬日申月戊丁甲全透极品规则',
    description: '壬水生申月，戊丁甲三者全透，较合原文"壬水生申月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['申'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['戊', '丁', '甲'],
    usefulWuxing: '土',
    favorableOrder: ['土', '火', '木'],
    traceHints: ['取用层次:戊丁甲三者全透', '成格层次:鼎甲可期'],
    hint: '壬水申月戊丁甲三者全透，鼎甲可期'
  },
  {
    id: 'you-month-ren-bing-jia-first',
    label: '壬日酉月先丙后甲规则',
    description: '壬水生酉月，金白水清，传统多以丙火调候、甲木疏土为用，不宜只按秋水喜金概论。',
    priority: 110,
    months: ['酉'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '壬水酉月，先丙后甲'
  },
  {
    id: 'you-month-ren-bing-jia-geng-all',
    label: '壬日酉月丙甲庚全透极品规则',
    description: '壬水生酉月，丙甲庚三者全透，较合原文"壬水生酉月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['酉'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '壬水酉月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'xu-month-ren-bing-jia-first',
    label: '壬日戌月先丙后甲规则',
    description: '壬水生戌月，秋深金衰，传统多以丙火调候、甲木疏通，较秋水泛化更合原法。',
    priority: 120,
    months: ['戌'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '壬水戌月，先丙后甲'
  },
  {
    id: 'xu-month-ren-bing-jia-xin-all',
    label: '壬日戌月丙甲辛全透极品规则',
    description: '壬水生戌月，丙甲辛三者全透，较合原文"壬水生戌月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['戌'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['丙', '甲', '辛'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲辛三者全透', '成格层次:鼎甲可期'],
    hint: '壬水戌月丙甲辛三者全透，鼎甲可期'
  },
  // 乙日穷通宝鉴规则
  {
    id: 'si-month-yi-bing-gui-first',
    label: '乙日巳月先丙后癸规则',
    description: '乙木生巳月，火旺木焚，传统多以丙火为先、癸水次之，先制火护木。',
    priority: 121,
    months: ['巳'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木巳月，先丙后癸'
  },
  {
    id: 'si-month-yi-bing-gui-geng-all',
    label: '乙日巳月丙癸庚全透极品规则',
    description: '乙木生巳月，丙癸庚三者全透，较合原文"乙木生巳月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['巳'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '乙木巳月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'si-month-yi-bing-gui-second',
    label: '乙日巳月丙火为先癸水为次规则',
    description: '乙木生巳月，丙火司权制刃，传统以丙火为君、癸水为臣，较夏木泛化更细。',
    priority: 120,
    months: ['巳'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木巳月，丙火为先，癸水为次'
  },
  {
    id: 'wei-month-yi-bing-gui-first',
    label: '乙日未月先癸后丙规则',
    description: '乙木生未月，燥土司令，传统多以癸水为先、丙火次之，先润后暖。',
    priority: 120,
    months: ['未'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '乙木未月，先癸后丙'
  },
  {
    id: 'wei-month-yi-gui-bing-geng-all',
    label: '乙日未月癸丙庚全透极品规则',
    description: '乙木生未月，癸丙庚三者全透，较合原文"乙木生未月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['未'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    requiredVisibleStems: ['癸', '丙', '庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '金'],
    traceHints: ['取用层次:癸丙庚三者全透', '成格层次:鼎甲可期'],
    hint: '乙木未月癸丙庚三者全透，鼎甲可期'
  },
  {
    id: 'shen-month-yi-bing-gui-first',
    label: '乙日申月先丙后癸规则',
    description: '乙木生申月，金旺木弱，传统多以丙火制金、癸水滋木，先后有序。',
    priority: 120,
    months: ['申'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木申月，先丙后癸'
  },
  {
    id: 'shen-month-yi-bing-gui-geng-all',
    label: '乙日申月丙癸庚全透极品规则',
    description: '乙木生申月，丙癸庚三者全透，较合原文"乙木生申月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['申'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '乙木申月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'xu-month-yi-bing-gui-first',
    label: '乙日戌月先丙后癸规则',
    description: '乙木生戌月，秋深气凉，传统多以丙火调候、癸水滋扶，先暖后润。',
    priority: 120,
    months: ['戌'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木戌月，先丙后癸'
  },
  {
    id: 'xu-month-yi-bing-gui-geng-all',
    label: '乙日戌月丙癸庚全透极品规则',
    description: '乙木生戌月，丙癸庚三者全透，较合原文"乙木生戌月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['戌'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '乙木戌月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'hai-month-yi-bing-gui-first',
    label: '乙日亥月先丙后癸规则',
    description: '乙木生亥月，水冷木寒，传统多以丙火解冻、癸水滋扶，先暖后润。',
    priority: 121,
    months: ['亥'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木亥月，先丙后癸'
  },
  {
    id: 'hai-month-yi-bing-gui-geng-all',
    label: '乙日亥月丙癸庚全透极品规则',
    description: '乙木生亥月，丙癸庚三者全透，较合原文"乙木生亥月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['亥'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '乙木亥月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'zi-month-yi-bing-gui-first',
    label: '乙日子月先丙后癸规则',
    description: '乙木生子月，寒冬木冻，传统多以丙火解冻、癸水滋扶，先暖后润。',
    priority: 121,
    months: ['子'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '乙木子月，先丙后癸'
  },
  {
    id: 'zi-month-yi-bing-gui-xin-all',
    label: '乙日子月丙癸辛全透极品规则',
    description: '乙木生子月，丙癸辛三者全透，较合原文"乙木生子月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['子'],
    dayMasters: ['木'],
    dayStems: ['乙'],
    requiredVisibleStems: ['丙', '癸', '辛'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸辛三者全透', '成格层次:鼎甲可期'],
    hint: '乙木子月丙癸辛三者全透，鼎甲可期'
  },
  // 丁日穷通宝鉴规则
  {
    id: 'yin-month-ding-bing-jia-first',
    label: '丁日寅月先丙后甲规则',
    description: '丁火生寅月，木火相生，传统多以甲木为君、丙火为臣，先发后暖。',
    priority: 118,
    months: ['寅'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    hint: '丁火寅月，先丙后甲'
  },
  {
    id: 'yin-month-ding-jia-geng-all',
    label: '丁日寅月甲庚两透显达规则',
    description: '丁火生寅月，若甲庚两透，较合原文"身强才旺有根，甲庚两透，定主雁塔有名"。',
    priority: 123,
    months: ['寅'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['甲', '庚'],
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    traceHints: ['取用层次:甲庚两透', '成格层次:雁塔有名'],
    hint: '丁火寅月甲庚两透，多主雁塔有名'
  },
  {
    id: 'mao-month-ding-jia-geng-first',
    label: '丁日卯月先甲后庚规则',
    description: '丁火生卯月，印星当令，传统多以甲木泄秀、庚金裁抑，先后有序。',
    priority: 118,
    months: ['卯'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    hint: '丁火卯月，先甲后庚'
  },
  {
    id: 'chen-month-ding-geng-jia-first',
    label: '丁日辰月先庚后甲规则',
    description: '丁火生辰月，土旺泄火，传统多以庚金发源、甲木生扶，先后有序。',
    priority: 119,
    months: ['辰'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木'],
    hint: '丁火辰月，先庚后甲'
  },
  {
    id: 'si-month-ding-geng-jia-first',
    label: '丁日巳月先庚后甲规则',
    description: '丁火生巳月，火旺金熔，传统多以庚金发源、甲木生扶，先后有序。',
    priority: 119,
    months: ['巳'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木'],
    hint: '丁火巳月，先庚后甲'
  },
  {
    id: 'si-month-ding-geng-jia-ren-all',
    label: '丁日巳月庚甲壬全透极品规则',
    description: '丁火生巳月，庚甲壬三者全透，较合原文"丁火生巳月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['巳'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '甲', '壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木', '水'],
    traceHints: ['取用层次:庚甲壬三者全透', '成格层次:鼎甲可期'],
    hint: '丁火巳月庚甲壬三者全透，鼎甲可期'
  },
  {
    id: 'wei-month-ding-geng-jia-first',
    label: '丁日未月先庚后甲规则',
    description: '丁火生未月，火气余烈，传统多以庚金发源、甲木生扶，先后有序。',
    priority: 119,
    months: ['未'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木'],
    hint: '丁火未月，先庚后甲'
  },
  {
    id: 'wei-month-ding-geng-jia-ren-all',
    label: '丁日未月庚甲壬全透极品规则',
    description: '丁火生未月，庚甲壬三者全透，较合原文"丁火生未月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['未'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '甲', '壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木', '水'],
    traceHints: ['取用层次:庚甲壬三者全透', '成格层次:鼎甲可期'],
    hint: '丁火未月庚甲壬三者全透，鼎甲可期'
  },
  {
    id: 'shen-month-ding-geng-jia-first',
    label: '丁日申月先庚后甲规则',
    description: '丁火生申月，金旺火衰，传统多以庚金发源、甲木生扶，先后有序。',
    priority: 119,
    months: ['申'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木'],
    hint: '丁火申月，先庚后甲'
  },
  {
    id: 'shen-month-ding-geng-jia-ren-all',
    label: '丁日申月庚甲壬全透极品规则',
    description: '丁火生申月，庚甲壬三者全透，较合原文"丁火生申月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['申'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '甲', '壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木', '水'],
    traceHints: ['取用层次:庚甲壬三者全透', '成格层次:鼎甲可期'],
    hint: '丁火申月庚甲壬三者全透，鼎甲可期'
  },
  {
    id: 'xu-month-ding-geng-jia-first',
    label: '丁日戌月先庚后甲规则',
    description: '丁火生戌月，火入库而衰，传统多以庚金发源、甲木生扶，先后有序。',
    priority: 119,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木'],
    hint: '丁火戌月，先庚后甲'
  },
  {
    id: 'xu-month-ding-geng-jia-ren-all',
    label: '丁日戌月庚甲壬全透极品规则',
    description: '丁火生戌月，庚甲壬三者全透，较合原文"丁火生戌月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['戌'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '甲', '壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木', '水'],
    traceHints: ['取用层次:庚甲壬三者全透', '成格层次:鼎甲可期'],
    hint: '丁火戌月庚甲壬三者全透，鼎甲可期'
  },
  {
    id: 'hai-month-ding-geng-jia-first',
    label: '丁日亥月先庚后甲规则',
    description: '丁火生亥月，水冷火寒，传统多以庚金发源、甲木生扶，先后有序。',
    priority: 119,
    months: ['亥'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木'],
    hint: '丁火亥月，先庚后甲'
  },
  {
    id: 'hai-month-ding-geng-jia-ren-all',
    label: '丁日亥月庚甲壬全透极品规则',
    description: '丁火生亥月，庚甲壬三者全透，较合原文"丁火生亥月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['亥'],
    dayMasters: ['火'],
    dayStems: ['丁'],
    requiredVisibleStems: ['庚', '甲', '壬'],
    usefulWuxing: '金',
    favorableOrder: ['金', '木', '水'],
    traceHints: ['取用层次:庚甲壬三者全透', '成格层次:鼎甲可期'],
    hint: '丁火亥月庚甲壬三者全透，鼎甲可期'
  },
  // 己日穷通宝鉴规则
  {
    id: 'yin-month-ji-bing-jia-first',
    label: '己日寅月先丙后甲规则',
    description: '己土生寅月，春寒未尽，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 119,
    months: ['寅'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '己土寅月，先丙后甲'
  },
  {
    id: 'yin-month-ji-bing-jia-geng-all',
    label: '己日寅月丙甲庚全透极品规则',
    description: '己土生寅月，丙甲庚三者全透，较合原文"己土生寅月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['寅'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '己土寅月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'mao-month-ji-bing-jia-first',
    label: '己日卯月先丙后甲规则',
    description: '己土生卯月，春湿土润，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 119,
    months: ['卯'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '己土卯月，先丙后甲'
  },
  {
    id: 'chen-month-ji-bing-jia-first',
    label: '己日辰月先丙后甲规则',
    description: '己土生辰月，春深土湿，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 119,
    months: ['辰'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '己土辰月，先丙后甲'
  },
  {
    id: 'si-month-ji-bing-gui-first',
    label: '己日巳月先丙后癸规则',
    description: '己土生巳月，夏燥土焦，传统多以癸水润燥、丙火暖局，先后有序。',
    priority: 120,
    months: ['巳'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '己土巳月，先癸后丙'
  },
  {
    id: 'si-month-ji-gui-bing-xin-all',
    label: '己日巳月癸丙辛全透极品规则',
    description: '己土生巳月，癸丙辛三者全透，较合原文"己土生巳月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['巳'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['癸', '丙', '辛'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '金'],
    traceHints: ['取用层次:癸丙辛三者全透', '成格层次:鼎甲可期'],
    hint: '己土巳月癸丙辛三者全透，鼎甲可期'
  },
  {
    id: 'wu-month-ji-gui-bing-first',
    label: '己日午月先癸后丙规则',
    description: '己土生午月，夏燥正盛，传统多以癸水润燥为先、丙火暖局为佐。',
    priority: 120,
    months: ['午'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '己土午月，先癸后丙'
  },
  {
    id: 'wu-month-ji-gui-bing-xin-all',
    label: '己日午月癸丙辛全透极品规则',
    description: '己土生午月，癸丙辛三者全透，较合原文"己土生午月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['午'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['癸', '丙', '辛'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '金'],
    traceHints: ['取用层次:癸丙辛三者全透', '成格层次:鼎甲可期'],
    hint: '己土午月癸丙辛三者全透，鼎甲可期'
  },
  {
    id: 'shen-month-ji-bing-jia-first',
    label: '己日申月先丙后甲规则',
    description: '己土生申月，秋湿土凉，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 119,
    months: ['申'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '己土申月，先丙后甲'
  },
  {
    id: 'shen-month-ji-bing-jia-geng-all',
    label: '己日申月丙甲庚全透极品规则',
    description: '己土生申月，丙甲庚三者全透，较合原文"己土生申月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['申'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '己土申月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'xu-month-ji-bing-jia-first',
    label: '己日戌月先丙后甲规则',
    description: '己土生戌月，秋深土燥，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 119,
    months: ['戌'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '己土戌月，先丙后甲'
  },
  {
    id: 'xu-month-ji-bing-jia-geng-all',
    label: '己日戌月丙甲庚全透极品规则',
    description: '己土生戌月，丙甲庚三者全透，较合原文"己土生戌月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['戌'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '己土戌月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'hai-month-ji-bing-jia-first',
    label: '己日亥月先丙后甲规则',
    description: '己土生亥月，水冷土寒，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 120,
    months: ['亥'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '己土亥月，先丙后甲'
  },
  {
    id: 'hai-month-ji-bing-jia-geng-all',
    label: '己日亥月丙甲庚全透极品规则',
    description: '己土生亥月，丙甲庚三者全透，较合原文"己土生亥月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['亥'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '己土亥月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'zi-month-ji-bing-jia-first',
    label: '己日子月先丙后甲规则',
    description: '己土生子月，冬寒土冻，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 120,
    months: ['子'],
    dayMasters: ['土'],
    dayStems: ['己'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '己土子月，先丙后甲'
  },
  {
    id: 'zi-month-ji-bing-jia-geng-all',
    label: '己日子月丙甲庚全透极品规则',
    description: '己土生子月，丙甲庚三者全透，较合原文"己土生子月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['子'],
    dayMasters: ['土'],
    dayStems: ['己'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '己土子月丙甲庚三者全透，鼎甲可期'
  },
  // 甲日穷通宝鉴规则 - 补充缺失月份
  {
    id: 'mao-month-jia-bing-gui-first',
    label: '甲日卯月先丙后癸规则',
    description: '甲木生卯月，羊刃当令，传统多以丙火调候、癸水滋扶，先暖后润。',
    priority: 120,
    months: ['卯'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '甲木卯月，先丙后癸'
  },
  {
    id: 'mao-month-jia-bing-gui-wu-all',
    label: '甲日卯月丙癸戊全透极品规则',
    description: '甲木生卯月，丙癸戊三者全透，较合原文"甲木生卯月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['卯'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    requiredVisibleStems: ['丙', '癸', '戊'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '土'],
    traceHints: ['取用层次:丙癸戊三者全透', '成格层次:鼎甲可期'],
    hint: '甲木卯月丙癸戊三者全透，鼎甲可期'
  },
  {
    id: 'shen-month-jia-bing-gui-first',
    label: '甲日申月先丙后癸规则',
    description: '甲木生申月，金旺木弱，传统多以丙火制金、癸水滋扶，先后有序。',
    priority: 120,
    months: ['申'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '甲木申月，先丙后癸'
  },
  {
    id: 'shen-month-jia-bing-gui-geng-all',
    label: '甲日申月丙癸庚全透极品规则',
    description: '甲木生申月，丙癸庚三者全透，较合原文"甲木生申月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['申'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '甲木申月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'xu-month-jia-bing-gui-first',
    label: '甲日戌月先丙后癸规则',
    description: '甲木生戌月，秋深气凉，传统多以丙火调候、癸水滋扶，先暖后润。',
    priority: 120,
    months: ['戌'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '甲木戌月，先丙后癸'
  },
  {
    id: 'xu-month-jia-bing-gui-geng-all',
    label: '甲日戌月丙癸庚全透极品规则',
    description: '甲木生戌月，丙癸庚三者全透，较合原文"甲木生戌月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['戌'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '甲木戌月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'hai-month-jia-bing-gui-first',
    label: '甲日亥月先丙后癸规则',
    description: '甲木生亥月，水冷木寒，传统多以丙火解冻、癸水滋扶，先暖后润。',
    priority: 121,
    months: ['亥'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '甲木亥月，先丙后癸'
  },
  {
    id: 'hai-month-jia-bing-gui-geng-all',
    label: '甲日亥月丙癸庚全透极品规则',
    description: '甲木生亥月，丙癸庚三者全透，较合原文"甲木生亥月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['亥'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '甲木亥月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'zi-month-jia-bing-gui-first',
    label: '甲日子月先丙后癸规则',
    description: '甲木生子月，寒冬木冻，传统多以丙火解冻、癸水滋扶，先暖后润。',
    priority: 121,
    months: ['子'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '甲木子月，先丙后癸'
  },
  {
    id: 'zi-month-jia-bing-gui-geng-all',
    label: '甲日子月丙癸庚全透极品规则',
    description: '甲木生子月，丙癸庚三者全透，较合原文"甲木生子月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['子'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '甲木子月丙癸庚三者全透，鼎甲可期'
  },
  {
    id: 'chou-month-jia-bing-gui-first',
    label: '甲日丑月先丙后癸规则',
    description: '甲木生丑月，湿寒交加，传统多以丙火解冻、癸水滋扶，先暖后润。',
    priority: 121,
    months: ['丑'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水'],
    hint: '甲木丑月，先丙后癸'
  },
  {
    id: 'chou-month-jia-bing-gui-geng-all',
    label: '甲日丑月丙癸庚全透极品规则',
    description: '甲木生丑月，丙癸庚三者全透，较合原文"甲木生丑月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['丑'],
    dayMasters: ['木'],
    dayStems: ['甲'],
    requiredVisibleStems: ['丙', '癸', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '水', '金'],
    traceHints: ['取用层次:丙癸庚三者全透', '成格层次:鼎甲可期'],
    hint: '甲木丑月丙癸庚三者全透，鼎甲可期'
  },
  // 戊日穷通宝鉴规则 - 补充缺失月份
  {
    id: 'yin-month-wu-bing-jia-first',
    label: '戊日寅月先丙后甲规则',
    description: '戊土生寅月，春寒未尽，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 119,
    months: ['寅'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '戊土寅月，先丙后甲'
  },
  {
    id: 'yin-month-wu-bing-jia-geng-all',
    label: '戊日寅月丙甲庚全透极品规则',
    description: '戊土生寅月，丙甲庚三者全透，较合原文"戊土生寅月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['寅'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '戊土寅月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'mao-month-wu-bing-jia-first',
    label: '戊日卯月先丙后甲规则',
    description: '戊土生卯月，春湿土润，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 119,
    months: ['卯'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '戊土卯月，先丙后甲'
  },
  {
    id: 'mao-month-wu-bing-jia-geng-all',
    label: '戊日卯月丙甲庚全透极品规则',
    description: '戊土生卯月，丙甲庚三者全透，较合原文"戊土生卯月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['卯'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '戊土卯月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'si-month-wu-gui-bing-first',
    label: '戊日巳月先癸后丙规则',
    description: '戊土生巳月，夏燥土焦，传统多以癸水润燥、丙火暖局，先后有序。',
    priority: 120,
    months: ['巳'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '戊土巳月，先癸后丙'
  },
  {
    id: 'si-month-wu-gui-bing-xin-all',
    label: '戊日巳月癸丙辛全透极品规则',
    description: '戊土生巳月，癸丙辛三者全透，较合原文"戊土生巳月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['巳'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['癸', '丙', '辛'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '金'],
    traceHints: ['取用层次:癸丙辛三者全透', '成格层次:鼎甲可期'],
    hint: '戊土巳月癸丙辛三者全透，鼎甲可期'
  },
  {
    id: 'wu-month-wu-gui-bing-first',
    label: '戊日午月先癸后丙规则',
    description: '戊土生午月，夏燥正盛，传统多以癸水润燥为先、丙火暖局为佐。',
    priority: 120,
    months: ['午'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '戊土午月，先癸后丙'
  },
  {
    id: 'wu-month-wu-gui-bing-xin-all',
    label: '戊日午月癸丙辛全透极品规则',
    description: '戊土生午月，癸丙辛三者全透，较合原文"戊土生午月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['午'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['癸', '丙', '辛'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火', '金'],
    traceHints: ['取用层次:癸丙辛三者全透', '成格层次:鼎甲可期'],
    hint: '戊土午月癸丙辛三者全透，鼎甲可期'
  },
  {
    id: 'hai-month-wu-bing-jia-first',
    label: '戊日亥月先丙后甲规则',
    description: '戊土生亥月，水冷土寒，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 120,
    months: ['亥'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '戊土亥月，先丙后甲'
  },
  {
    id: 'hai-month-wu-bing-jia-geng-all',
    label: '戊日亥月丙甲庚全透极品规则',
    description: '戊土生亥月，丙甲庚三者全透，较合原文"戊土生亥月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['亥'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '戊土亥月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'zi-month-wu-bing-jia-first',
    label: '戊日子月先丙后甲规则',
    description: '戊土生子月，冬寒土冻，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 120,
    months: ['子'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '戊土子月，先丙后甲'
  },
  {
    id: 'zi-month-wu-bing-jia-geng-all',
    label: '戊日子月丙甲庚全透极品规则',
    description: '戊土生子月，丙甲庚三者全透，较合原文"戊土生子月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['子'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '戊土子月丙甲庚三者全透，鼎甲可期'
  },
  {
    id: 'chou-month-wu-bing-jia-first',
    label: '戊日丑月先丙后甲规则',
    description: '戊土生丑月，湿寒交加，传统多以丙火暖局、甲木疏土，先后有序。',
    priority: 121,
    months: ['丑'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '戊土丑月，先丙后甲'
  },
  {
    id: 'chou-month-wu-bing-jia-geng-all',
    label: '戊日丑月丙甲庚全透极品规则',
    description: '戊土生丑月，丙甲庚三者全透，较合原文"戊土生丑月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['丑'],
    dayMasters: ['土'],
    dayStems: ['戊'],
    requiredVisibleStems: ['丙', '甲', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木', '金'],
    traceHints: ['取用层次:丙甲庚三者全透', '成格层次:鼎甲可期'],
    hint: '戊土丑月丙甲庚三者全透，鼎甲可期'
  },
  // 癸日穷通宝鉴规则 - 补充缺失月份
  {
    id: 'si-month-gui-bing-xin-first',
    label: '癸日巳月先丙后辛规则',
    description: '癸水生巳月，火旺水弱，传统多以丙火调候、辛金发源，先后有序。',
    priority: 120,
    months: ['巳'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    hint: '癸水巳月，先丙后辛'
  },
  {
    id: 'si-month-gui-bing-xin-geng-all',
    label: '癸日巳月丙辛庚全透极品规则',
    description: '癸水生巳月，丙辛庚三者全透，较合原文"癸水生巳月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['巳'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredVisibleStems: ['丙', '辛', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    traceHints: ['取用层次:丙辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '癸水巳月丙辛庚三者全透，鼎甲可期'
  },
  {
    id: 'shen-month-gui-bing-xin-first',
    label: '癸日申月先丙后辛规则',
    description: '癸水生申月，金白水清，传统多以丙火调候、辛金发源，先后有序。',
    priority: 120,
    months: ['申'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    hint: '癸水申月，先丙后辛'
  },
  {
    id: 'shen-month-gui-bing-xin-geng-all',
    label: '癸日申月丙辛庚全透极品规则',
    description: '癸水生申月，丙辛庚三者全透，较合原文"癸水生申月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['申'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredVisibleStems: ['丙', '辛', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    traceHints: ['取用层次:丙辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '癸水申月丙辛庚三者全透，鼎甲可期'
  },
  {
    id: 'xu-month-gui-bing-xin-first',
    label: '癸日戌月先丙后辛规则',
    description: '癸水生戌月，秋深金衰，传统多以丙火调候、辛金发源，先后有序。',
    priority: 120,
    months: ['戌'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    hint: '癸水戌月，先丙后辛'
  },
  {
    id: 'xu-month-gui-bing-xin-geng-all',
    label: '癸日戌月丙辛庚全透极品规则',
    description: '癸水生戌月，丙辛庚三者全透，较合原文"癸水生戌月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['戌'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredVisibleStems: ['丙', '辛', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    traceHints: ['取用层次:丙辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '癸水戌月丙辛庚三者全透，鼎甲可期'
  },
  {
    id: 'hai-month-gui-bing-xin-first',
    label: '癸日亥月先丙后辛规则',
    description: '癸水生亥月，水冷金寒，传统多以丙火解冻、辛金发源，先后有序。',
    priority: 121,
    months: ['亥'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    hint: '癸水亥月，先丙后辛'
  },
  {
    id: 'hai-month-gui-bing-xin-geng-all',
    label: '癸日亥月丙辛庚全透极品规则',
    description: '癸水生亥月，丙辛庚三者全透，较合原文"癸水生亥月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['亥'],
    dayMasters: ['水'],
    dayStems: ['癸'],
    requiredVisibleStems: ['丙', '辛', '庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    traceHints: ['取用层次:丙辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '癸水亥月丙辛庚三者全透，鼎甲可期'
  },
  // 丙日穷通宝鉴规则 - 补充缺失月份
  {
    id: 'shen-month-bing-wu-xin-first',
    label: '丙日申月先壬后辛规则',
    description: '丙火生申月，金旺火衰，传统多以壬水通根、辛金发源，先后有序。',
    priority: 120,
    months: ['申'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    hint: '丙火申月，先壬后辛'
  },
  {
    id: 'shen-month-bing-wu-xin-geng-all',
    label: '丙日申月壬辛庚全透极品规则',
    description: '丙火生申月，壬辛庚三者全透，较合原文"丙火生申月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['申'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬', '辛', '庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '丙火申月壬辛庚三者全透，鼎甲可期'
  },
  {
    id: 'hai-month-bing-wu-xin-first',
    label: '丙日亥月先壬后辛规则',
    description: '丙火生亥月，水冷火寒，传统多以壬水通根、辛金发源，先后有序。',
    priority: 121,
    months: ['亥'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    hint: '丙火亥月，先壬后辛'
  },
  {
    id: 'hai-month-bing-wu-xin-geng-all',
    label: '丙日亥月壬辛庚全透极品规则',
    description: '丙火生亥月，壬辛庚三者全透，较合原文"丙火生亥月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['亥'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬', '辛', '庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '丙火亥月壬辛庚三者全透，鼎甲可期'
  },
  {
    id: 'zi-month-bing-wu-xin-first',
    label: '丙日子月先壬后辛规则',
    description: '丙火生子月，寒冬火弱，传统多以壬水通根、辛金发源，先后有序。',
    priority: 121,
    months: ['子'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    hint: '丙火子月，先壬后辛'
  },
  {
    id: 'zi-month-bing-wu-xin-geng-all',
    label: '丙日子月壬辛庚全透极品规则',
    description: '丙火生子月，壬辛庚三者全透，较合原文"丙火生子月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['子'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬', '辛', '庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '丙火子月壬辛庚三者全透，鼎甲可期'
  },
  {
    id: 'chou-month-bing-wu-xin-first',
    label: '丙日丑月先壬后辛规则',
    description: '丙火生丑月，湿寒交加，传统多以壬水通根、辛金发源，先后有序。',
    priority: 121,
    months: ['丑'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    hint: '丙火丑月，先壬后辛'
  },
  {
    id: 'chou-month-bing-wu-xin-geng-all',
    label: '丙日丑月壬辛庚全透极品规则',
    description: '丙火生丑月，壬辛庚三者全透，较合原文"丙火生丑月，三者全透，鼎甲可期"。',
    priority: 126,
    months: ['丑'],
    dayMasters: ['火'],
    dayStems: ['丙'],
    requiredVisibleStems: ['壬', '辛', '庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '金'],
    traceHints: ['取用层次:壬辛庚三者全透', '成格层次:鼎甲可期'],
    hint: '丙火丑月壬辛庚三者全透，鼎甲可期'
  },

  // ==================== 庚日穷通宝鉴规则 ====================

  {
    id: 'yin-month-geng-bing-jia',
    label: '庚日寅月丙甲并用规则',
    description: '庚金生寅月，寒金用丙暖为君，甲木疏土引丁为佐。丙甲两透，科甲定然，不应仍按普通春金扶抑泛断。',
    priority: 119,
    months: ['寅'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金寅月，丙暖为君，甲为佐，丙甲两透科甲定然'
  },
  {
    id: 'mao-month-geng-bing-ding',
    label: '庚日卯月丙丁并用规则',
    description: '庚金生卯月，木旺金衰，丙暖丁炼并用。丙丁两透，富贵双全，不宜仍泛以春金扶抑概之。',
    priority: 118,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金卯月，丙丁并用，两透则富贵'
  },
  {
    id: 'mao-month-geng-ding-only',
    label: '庚日卯月丁透无丙异路功名规则',
    description: '庚金生卯月，若丁火透干而丙火不出，较合原文"有丁无丙，异路功名"；不应仍按丙丁并用富贵上断。',
    priority: 122,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['丁'],
    maxStemTotalCounts: { 丙: 0 },
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    traceHints: ['取用层次:有丁无丙', '成格层次:异路功名'],
    hint: '庚金卯月丁透而丙不出，多主异路功名'
  },
  {
    id: 'mao-month-geng-no-fire-ordinary',
    label: '庚日卯月无火常人规则',
    description: '庚金生卯月，木旺金绝，火为锻炼之要；若丙丁全无，较合原文"无丙丁者，常人"；不应仍泛以春金扶抑概之。',
    priority: 121,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    maxStemTotalCounts: { 丙: 0, 丁: 0 },
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:丙丁全无', '成格层次:常人'],
    hint: '庚金卯月丙丁俱无，多作常人'
  },
  {
    id: 'mao-month-geng-wood-formation-ding',
    label: '庚日卯月木局丁透名臣规则',
    description: '庚金生卯月，若地支成木局，本属财旺身弱；但丁火出干炼金，较合原文"支成木局，有丁出干，名臣之格"。',
    priority: 123,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredFormationWuxings: ['木'],
    requiredVisibleStems: ['丁'],
    usefulWuxing: '火',
    favorableOrder: ['火', '金'],
    traceHints: ['取用层次:支成木局而丁火出干', '成格层次:名臣之格'],
    hint: '庚金卯月木局成势而丁火出干，多主名臣之格'
  },
  {
    id: 'mao-month-geng-water-formation-wu',
    label: '庚日卯月水局戊透制水平人规则',
    description: '庚金生卯月，若地支成水局，泄金太过；得戊土出干制水，较合原文"支成水局，有戊制之，衣禄无亏，无戊平人"。',
    priority: 122,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredFormationWuxings: ['水'],
    requiredVisibleStems: ['戊'],
    usefulWuxing: '土',
    favorableOrder: ['土', '金'],
    traceHints: ['取用层次:支成水局，戊土制水', '成格层次:衣禄无亏'],
    hint: '庚金卯月水局成势而戊透制水，衣禄无亏'
  },
  {
    id: 'mao-month-geng-water-formation-no-wu',
    label: '庚日卯月水局无戊平人规则',
    description: '庚金生卯月，若地支成水局而戊土不出，泄金太过而无可堤防，较合原文"无戊平人"。',
    priority: 121.5,
    months: ['卯'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredFormationWuxings: ['水'],
    maxStemTotalCounts: { 戊: 0 },
    usefulWuxing: '土',
    favorableOrder: ['土', '金'],
    traceHints: ['破格因素:支成水局而无戊制', '成格层次:平人'],
    hint: '庚金卯月水局成势而无戊，多作平人'
  },
  {
    id: 'chen-month-geng-jia-bing',
    label: '庚日辰月甲先丙后规则',
    description: '庚金生辰月，土旺金相，甲先疏土、丙后暖金。甲丙两透，科甲可期，不宜仍按春金一概先火。',
    priority: 119,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    hint: '庚金辰月，先甲疏土，后丙暖金，甲丙两透科甲'
  },
  {
    id: 'chen-month-geng-jia-no-bing',
    label: '庚日辰月有甲无丙异路规则',
    description: '庚金生辰月，甲木疏土为急；若甲透而丙不出，较合原文"有甲无丙，异路功名"；不应仍按甲丙两透科甲论。',
    priority: 122,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredVisibleStems: ['甲'],
    maxStemTotalCounts: { 丙: 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    traceHints: ['取用层次:有甲无丙', '成格层次:异路功名'],
    hint: '庚金辰月甲透而丙不出，多主异路功名'
  },
  {
    id: 'chen-month-geng-no-jia-bing',
    label: '庚日辰月无甲丙常人规则',
    description: '庚金生辰月，土厚金埋，甲疏丙暖缺一不可；若甲丙俱无，较合原文"甲丙俱无，常人"；不应仍泛以土旺扶抑概之。',
    priority: 121,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    maxStemTotalCounts: { 甲: 0, 丙: 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    traceHints: ['破格因素:甲丙俱无', '成格层次:常人'],
    hint: '庚金辰月甲丙俱无，多作常人'
  },
  {
    id: 'chen-month-geng-water-formation-wu',
    label: '庚日辰月水局见戊清贵规则',
    description: '庚金生辰月，若地支成水局而戊土出干制水，金水得以清平，较合原文"支成水局，得戊制水，清贵"。',
    priority: 122,
    months: ['辰'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    requiredFormationWuxings: ['水'],
    requiredVisibleStems: ['戊'],
    usefulWuxing: '土',
    favorableOrder: ['土', '金'],
    traceHints: ['取用层次:支成水局，得戊制水', '成格层次:清贵'],
    hint: '庚金辰月水局成势而戊透制水，多主清贵'
  },
  {
    id: 'si-month-geng-ren-bing',
    label: '庚日巳月壬丙并用规则',
    description: '庚金生巳月，火旺金熔，壬水制火为要，丙火又不可缺。壬丙两透，富贵双全，不宜直接泛化为金印为先。',
    priority: 120,
    months: ['巳'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '庚金巳月，壬制火为要，丙不可缺，壬丙两透富贵'
  },
  {
    id: 'wu-month-geng-ren-ding',
    label: '庚日午月壬透丁佐规则',
    description: '庚金生午月，火烈金熔，壬水为救，丁火炼金为佐。壬透丁佐，科甲可期，不宜仍按夏金泛化扶抑。',
    priority: 119,
    months: ['午'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '水',
    favorableOrder: ['水', '火'],
    hint: '庚金午月，壬水为救，丁火佐之，壬透丁佐科甲'
  },
  {
    id: 'wei-month-geng-jia-ren',
    label: '庚日未月甲壬并用规则',
    description: '庚金生未月，土旺金埋，甲木疏土为先，壬水洗金为后。甲壬两透，科甲可期，不宜仍按土旺扶抑泛论。',
    priority: 119,
    months: ['未'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    hint: '庚金未月，甲先疏土，壬后洗金，甲壬两透科甲'
  },
  {
    id: 'shen-month-geng-ding-jia',
    label: '庚日申月丁甲并用规则',
    description: '庚金生申月，金旺得令，丁火炼金为用，甲木引丁为佐。丁甲两透，科甲定然，不宜仍按秋金清润一概论之。',
    priority: 119,
    months: ['申'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金申月，丁火炼金，甲木引丁，丁甲两透科甲'
  },
  {
    id: 'you-month-geng-ding-jia',
    label: '庚日酉月丁甲并用规则',
    description: '庚金生酉月，金气最旺，丁火为先，甲木佐之。丁甲两透，富贵可期，不宜只按秋金喜水泛论。',
    priority: 118,
    months: ['酉'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金酉月，丁火为先，甲木佐之，丁甲两透富贵'
  },
  {
    id: 'xu-month-geng-jia-ren',
    label: '庚日戌月甲壬并用规则',
    description: '庚金生戌月，土厚金埋，甲木疏土为先，壬水洗金为后。甲壬两透，科甲可期，不宜仍按秋金泛断。',
    priority: 119,
    months: ['戌'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '木',
    favorableOrder: ['木', '水'],
    hint: '庚金戌月，甲先壬后，甲壬两透科甲'
  },
  {
    id: 'hai-month-geng-bing-jia',
    label: '庚日亥月丙甲并用规则',
    description: '庚金生亥月，寒金喜暖，丙火为先，甲木佐之。丙甲两透，富贵可期，不宜仍按冬金只取火概之。',
    priority: 118,
    months: ['亥'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金亥月，丙暖为先，甲木佐之，丙甲两透富贵'
  },
  {
    id: 'zi-month-geng-bing-ding',
    label: '庚日子月丙丁并用规则',
    description: '庚金生子月，寒极喜暖，丙丁并用。丙丁两透，富贵双全，不宜仍按冬金泛化扶抑。',
    priority: 119,
    months: ['子'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金子月，丙丁并用，两透则富贵'
  },
  {
    id: 'chou-month-geng-bing-jia',
    label: '庚日丑月丙甲并用规则',
    description: '庚金生丑月，寒冻之极，丙火解冻为先，甲木佐之。丙甲两透，富贵可期，不宜仍只按冬金取火。',
    priority: 119,
    months: ['丑'],
    dayMasters: ['金'],
    dayStems: ['庚'],
    usefulWuxing: '火',
    favorableOrder: ['火', '木'],
    hint: '庚金丑月，丙火为先，甲木佐之，丙甲两透富贵'
  },

  // ==================== 壬日穷通宝鉴规则补充 ====================

  {
    id: 'mao-month-ren-wu-xin',
    label: '壬日卯月戊辛并用规则',
    description: '壬水生卯月，木旺泄水，戊土止流为君，辛金发源为佐。戊辛两透，富贵可期，不宜只按春水泛化扶抑。',
    priority: 117,
    months: ['卯'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '土',
    favorableOrder: ['土', '金'],
    hint: '壬水卯月，戊土止流，辛金发源，戊辛两透富贵'
  },
  {
    id: 'chen-month-ren-jia-geng',
    label: '壬日辰月甲庚并用规则',
    description: '壬水生辰月，土旺水衰，甲木疏土为先，庚金发源为后。甲庚两透，科甲可期，不宜仍按春水扶抑泛断。',
    priority: 118,
    months: ['辰'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    hint: '壬水辰月，甲先庚后，甲庚两透科甲'
  },
  {
    id: 'you-month-ren-jia-wu',
    label: '壬日酉月甲戊并用规则',
    description: '壬水生酉月，金白水清，忌戊土浊而喜甲木制土。甲戊并用，清贵可期，不宜只按秋水喜金泛论。',
    priority: 117,
    months: ['酉'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    hint: '壬水酉月，甲制戊土保清，甲透则清贵'
  },
  {
    id: 'xu-month-ren-jia-bing',
    label: '壬日戌月甲丙并用规则',
    description: '壬水生戌月，土厚水弱，甲木疏土为先，丙火暖局为后。甲丙两透，富贵可期，不宜仍按秋水泛断。',
    priority: 118,
    months: ['戌'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    hint: '壬水戌月，甲先丙后，甲丙两透富贵'
  },
  {
    id: 'hai-month-ren-wu-bing',
    label: '壬日亥月戊丙并用规则',
    description: '壬水生亥月，水旺需堤，戊土为岸为先，丙火佐暖为后。戊丙两透，富贵可期，不宜仍按冬水泛取火概之。',
    priority: 118,
    months: ['亥'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    hint: '壬水亥月，戊土为堤，丙火佐暖，戊丙两透富贵'
  },
  {
    id: 'hai-month-ren-wu-no-bing',
    label: '壬日亥月有戊无丙异路规则',
    description: '壬水生亥月，若戊透而丙不出，虽能止流却不能暖局，较合原文"有戊无丙，异路功名"；不应仍按戊丙两透富贵上断。',
    priority: 122,
    months: ['亥'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['戊'],
    maxStemTotalCounts: { 丙: 0 },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['取用层次:有戊无丙', '成格层次:异路功名'],
    hint: '壬水亥月戊透而丙不出，多主异路功名'
  },
  {
    id: 'hai-month-ren-no-wu-bing',
    label: '壬日亥月戊丙俱无奔流规则',
    description: '壬水生亥月，水旺无堤无暖，泛滥奔流，较合原文"戊丙俱无，奔流下贱"；不应仍按冬水泛取火概之。',
    priority: 121,
    months: ['亥'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    maxStemTotalCounts: { 戊: 0, 丙: 0 },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['破格因素:戊丙俱无', '成格层次:奔流下贱'],
    hint: '壬水亥月戊丙俱无，多作奔流之命'
  },
  {
    id: 'hai-month-ren-wood-formation-wu',
    label: '壬日亥月木局戊透衣禄规则',
    description: '壬水生亥月，若地支成木局，泄水太过；得戊土出干止流，较合原文"支成木局，有戊制之，衣禄可求"。',
    priority: 122,
    months: ['亥'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredFormationWuxings: ['木'],
    requiredVisibleStems: ['戊'],
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['取用层次:支成木局而戊土出干', '成格层次:衣禄可求'],
    hint: '壬水亥月木局成势而戊透，衣禄可求'
  },
  {
    id: 'zi-month-ren-wu-bing',
    label: '壬日子月戊丙并用规则',
    description: '壬水生子月，寒旺需堤，戊土止流为先，丙火暖局为后。戊丙两透，富贵可期，不宜仍按冬水只取火概之。',
    priority: 118,
    months: ['子'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    hint: '壬水子月，戊土止流，丙火暖局，戊丙两透富贵'
  },
  {
    id: 'zi-month-ren-wu-no-bing',
    label: '壬日子月有戊无丙富真贵假规则',
    description: '壬水生子月，若戊透而丙不出，虽能止流却寒气不解，较合原文"有戊无丙，富真贵假"；不应仍按戊丙两透富贵上断。',
    priority: 122,
    months: ['子'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['戊'],
    maxStemTotalCounts: { 丙: 0 },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['取用层次:有戊无丙', '成格层次:富真贵假'],
    hint: '壬水子月戊透而丙不出，多主富真贵假'
  },
  {
    id: 'zi-month-ren-bing-no-wu',
    label: '壬日子月有丙无戊虚名规则',
    description: '壬水生子月，若丙透而戊不出，虽能暖局却无堤防，较合原文"有丙无戊，虚名虚利"；不应仍按戊丙两透富贵论。',
    priority: 122,
    months: ['子'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['丙'],
    maxStemTotalCounts: { 戊: 0 },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['取用层次:有丙无戊', '成格层次:虚名虚利'],
    hint: '壬水子月丙透而戊不出，多主虚名虚利'
  },
  {
    id: 'zi-month-ren-no-wu-bing',
    label: '壬日子月戊丙俱无泛滥规则',
    description: '壬水生子月，水旺无堤无暖，泛滥成灾，较合原文"戊丙俱无，泛滥无依"；不应仍按冬水泛化处理。',
    priority: 121,
    months: ['子'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    maxStemTotalCounts: { 戊: 0, 丙: 0 },
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['破格因素:戊丙俱无', '成格层次:泛滥无依'],
    hint: '壬水子月戊丙俱无，多作泛滥无依之命'
  },
  {
    id: 'zi-month-ren-water-formation-no-fire',
    label: '壬日子月水局无火润下贫寒规则',
    description: '壬水生子月，若地支成水局而丙丁全无，水势纯旺无制，较合原文"支成水局，无丙丁出干，润下格贫寒"；不应仍按水旺喜火泛断。',
    priority: 123,
    months: ['子'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredFormationWuxings: ['水'],
    maxStemTotalCounts: { 丙: 0, 丁: 0 },
    usefulWuxing: '火',
    favorableOrder: ['火', '土'],
    traceHints: ['破格因素:支成水局而无丙丁', '成格层次:润下格贫寒'],
    hint: '壬水子月水局成势而无丙丁，多作润下贫寒'
  },
  {
    id: 'zi-month-ren-fire-formation-wu',
    label: '壬日子月火局戊透富贵规则',
    description: '壬水生子月，若地支成火局而戊土透干，水火既济、财官有根，较合原文"支成火局，有戊出干，富贵双全"。',
    priority: 124,
    months: ['子'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredFormationWuxings: ['火'],
    requiredVisibleStems: ['戊'],
    usefulWuxing: '土',
    favorableOrder: ['土', '火'],
    traceHints: ['取用层次:支成火局而戊土出干', '成格层次:富贵双全'],
    hint: '壬水子月火局成势而戊透，多主富贵双全'
  },
  {
    id: 'chen-month-ren-jia-geng',
    label: '壬日辰月甲庚并用规则',
    description: '壬水生辰月，土旺水衰，甲木疏土为先，庚金发源为后。甲庚两透，科甲可期，不宜仍按春水扶抑泛断。',
    priority: 118,
    months: ['辰'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    hint: '壬水辰月，甲先庚后，甲庚两透科甲'
  },
  {
    id: 'chen-month-ren-jia-no-geng',
    label: '壬日辰月甲透无庚异路规则',
    description: '壬水生辰月，甲木疏土为急；若甲透而庚不出，疏土有余而发源不足，较合原文"有甲无庚，异路功名"。',
    priority: 122,
    months: ['辰'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['甲'],
    maxStemTotalCounts: { 庚: 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    traceHints: ['取用层次:有甲无庚', '成格层次:异路功名'],
    hint: '壬水辰月甲透而庚不出，多主异路功名'
  },
  {
    id: 'chen-month-ren-no-jia-geng',
    label: '壬日辰月甲庚俱无常人规则',
    description: '壬水生辰月，土厚水弱，甲疏庚源缺一不可；若甲庚俱无，较合原文"甲庚俱无，常人"。',
    priority: 121,
    months: ['辰'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    maxStemTotalCounts: { 甲: 0, 庚: 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    traceHints: ['破格因素:甲庚俱无', '成格层次:常人'],
    hint: '壬水辰月甲庚俱无，多作常人'
  },
  {
    id: 'chen-month-ren-water-formation-wu',
    label: '壬日辰月水局戊透制水平人规则',
    description: '壬水生辰月，若地支成水局而戊土出干制水，虽可免泛滥，仍较合原文"支成水局，有戊制之，衣禄无亏"。',
    priority: 122,
    months: ['辰'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredFormationWuxings: ['水'],
    requiredVisibleStems: ['戊'],
    usefulWuxing: '土',
    favorableOrder: ['土', '金'],
    traceHints: ['取用层次:支成水局，得戊制水', '成格层次:衣禄无亏'],
    hint: '壬水辰月水局成势而戊透制水，衣禄无亏'
  },
  {
    id: 'wei-month-ren-jia-xin-gui',
    label: '壬日未月甲辛并用规则',
    description: '壬水生未月，土旺水衰，甲木疏土为先，辛金发源为佐。甲辛两透，富贵可期，不宜仍按土旺扶抑泛论。',
    priority: 118,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    hint: '壬水未月，甲先辛后，甲辛两透富贵'
  },
  {
    id: 'wei-month-ren-jia-no-xin',
    label: '壬日未月甲透无辛异路规则',
    description: '壬水生未月，甲木疏土为急；若甲透而辛不出，疏土有余而发源不足，较合原文"有甲无辛，异路功名"。',
    priority: 122,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredVisibleStems: ['甲'],
    maxStemTotalCounts: { 辛: 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    traceHints: ['取用层次:有甲无辛', '成格层次:异路功名'],
    hint: '壬水未月甲透而辛不出，多主异路功名'
  },
  {
    id: 'wei-month-ren-no-jia-xin',
    label: '壬日未月甲辛俱无常人规则',
    description: '壬水生未月，土厚水弱，甲疏辛源缺一不可；若甲辛俱无，较合原文"甲辛俱无，常人"。',
    priority: 121,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    maxStemTotalCounts: { 甲: 0, 辛: 0 },
    usefulWuxing: '木',
    favorableOrder: ['木', '金'],
    traceHints: ['破格因素:甲辛俱无', '成格层次:常人'],
    hint: '壬水未月甲辛俱无，多作常人'
  },
  {
    id: 'wei-month-ren-fire-formation-jia',
    label: '壬日未月火局甲透反贵规则',
    description: '壬水生未月，若地支成火局，财旺身弱；但甲木出干化水生火、流通有情，较合原文"支成火局，有甲出干，反主富贵"。',
    priority: 123,
    months: ['未'],
    dayMasters: ['水'],
    dayStems: ['壬'],
    requiredFormationWuxings: ['火'],
    requiredVisibleStems: ['甲'],
    usefulWuxing: '木',
    favorableOrder: ['木', '火'],
    traceHints: ['取用层次:支成火局而甲木出干', '成格层次:反主富贵'],
    hint: '壬水未月火局成势而甲透，反主富贵'
  }
]

export const STRENGTH_HINT_RULES: StrengthHintRule[] = [
  {
    id: 'strength-strong-stagnation',
    label: '身强壅滞病药提示',
    description: '身强多壅，宜疏泄流通。',
    strengths: ['身强', '偏强', '极强'],
    hint: '病在壅滞，宜疏泄流通'
  },
  {
    id: 'strength-weak-deficiency',
    label: '身弱不足病药提示',
    description: '身弱多虚，宜扶助培元。',
    strengths: ['身弱', '偏弱', '极弱'],
    hint: '病在不足，宜扶助培元'
  }
]

export const THERAPEUTIC_PRIORITY_RULES: TherapeuticPriorityRule[] = [
  {
    id: 'earth-month-release-output',
    label: '土月疏泄病药规则',
    description: '辰戌丑未月土日主身强而土重壅滞时，优先取食伤以疏泄。',
    priority: 80,
    months: ['辰', '戌', '丑', '未'],
    strengths: ['身强', '偏强', '极强'],
    dayMasters: ['土'],
    useGeneratedElement: true
  }
]
