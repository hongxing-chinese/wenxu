import { BASIC_MAPPINGS } from './baziDefinitions'

export interface RuleMatchContext {
  strengthStatus?: string;
  yearStem?: string;
  monthBranch?: string;
  hourBranch?: string;
  dayMaster?: string;
  dayStem?: string;
  pattern?: string;
  currentJieqi?: string;
  visibleStems?: string[];
  visibleStemSources?: VisibleStemSource[];
  hiddenStems?: string[];
  hiddenStemSources?: HiddenStemSource[];
  formationWuxings?: string[];
  wuxingCounts?: Record<string, number>;
}

export interface DistinctStemGroupCountRule {
  stems: string[];
  minDistinctCount?: number;
  maxDistinctCount?: number;
  scope?: 'visible' | 'hidden' | 'total';
}

export interface HiddenStemSource {
  pillar: 'year' | 'month' | 'day' | 'hour';
  branch: string;
  stems: string[];
}

export interface VisibleStemSource {
  pillar: 'year' | 'month' | 'day' | 'hour';
  stem: string;
}

export interface VisibleStemPillarPairRule {
  stem: string;
  pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
}

export interface VisibleStemBranchPairRule {
  stem: string;
  branch: string;
  pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
}

export interface VisibleStemDistancePairRule {
  stems: [string, string];
  minDistance?: number;
  maxDistance?: number;
  leftPillars?: Array<'year' | 'month' | 'day' | 'hour'>;
  rightPillars?: Array<'year' | 'month' | 'day' | 'hour'>;
}

export interface BranchPillarPairRule {
  branch: string;
  pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
}

export interface HiddenStemBranchPairRule {
  branch: string;
  stem: string;
  pillars?: Array<'year' | 'month' | 'day' | 'hour'>;
}

export interface MatchableRule {
  id: string;
  priority?: number;
  strengths?: string[];
  yearStems?: string[];
  months?: string[];
  hourBranches?: string[];
  dayMasters?: string[];
  dayStems?: string[];
  patterns?: string[];
  currentJieqi?: string[];
  requiredVisibleStems?: string[];
  optionalVisibleStems?: string[];
  forbiddenVisibleStems?: string[];
  requiredVisibleStemPillarPairs?: VisibleStemPillarPairRule[];
  optionalVisibleStemPillarPairs?: VisibleStemPillarPairRule[];
  forbiddenVisibleStemPillarPairs?: VisibleStemPillarPairRule[];
  requiredVisibleStemBranchPairs?: VisibleStemBranchPairRule[];
  optionalVisibleStemBranchPairs?: VisibleStemBranchPairRule[];
  forbiddenVisibleStemBranchPairs?: VisibleStemBranchPairRule[];
  requiredVisibleStemDistancePairs?: VisibleStemDistancePairRule[];
  forbiddenVisibleStemDistancePairs?: VisibleStemDistancePairRule[];
  minVisibleStemCounts?: Record<string, number>;
  maxVisibleStemCounts?: Record<string, number>;
  requiredHiddenStems?: string[];
  optionalHiddenStems?: string[];
  forbiddenHiddenStems?: string[];
  requiredBranchPillarPairs?: BranchPillarPairRule[];
  optionalBranchPillarPairs?: BranchPillarPairRule[];
  forbiddenBranchPillarPairs?: BranchPillarPairRule[];
  requiredHiddenStemBranchPairs?: HiddenStemBranchPairRule[];
  optionalHiddenStemBranchPairs?: HiddenStemBranchPairRule[];
  forbiddenHiddenStemBranchPairs?: HiddenStemBranchPairRule[];
  minHiddenStemCounts?: Record<string, number>;
  maxHiddenStemCounts?: Record<string, number>;
  minStemTotalCounts?: Record<string, number>;
  maxStemTotalCounts?: Record<string, number>;
  distinctStemGroupCounts?: DistinctStemGroupCountRule[];
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
}

function getStemWuxing(stem: string): string {
  const stemIndex = BASIC_MAPPINGS.HEAVENLY_STEMS.indexOf(stem as never)
  if (stemIndex === -1) {
    return ''
  }

  return BASIC_MAPPINGS.STEM_WUXING[stemIndex]
}

function includesOrWildcard(values: string[] | undefined, target: string | undefined): boolean {
  if (!values || values.length === 0) {
    return true
  }

  if (!target) {
    return false
  }

  return values.includes(target)
}

function includesAll(values: string[] | undefined, targets: string[] | undefined): boolean {
  if (!values || values.length === 0) {
    return true
  }

  if (!targets || targets.length === 0) {
    return false
  }

  return values.every(value => targets.includes(value))
}

function includesAny(values: string[] | undefined, targets: string[] | undefined): boolean {
  if (!values || values.length === 0) {
    return true
  }

  if (!targets || targets.length === 0) {
    return false
  }

  return values.some(value => targets.includes(value))
}

function excludesAll(values: string[] | undefined, targets: string[] | undefined): boolean {
  if (!values || values.length === 0) {
    return true
  }

  if (!targets || targets.length === 0) {
    return true
  }

  return values.every(value => !targets.includes(value))
}

function hasHiddenStemBranchPair(
  pairRule: HiddenStemBranchPairRule,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!hiddenStemSources || hiddenStemSources.length === 0) {
    return false
  }

  return hiddenStemSources.some((source) => {
    if (source.branch !== pairRule.branch) {
      return false
    }

    if (pairRule.pillars && pairRule.pillars.length > 0 && !pairRule.pillars.includes(source.pillar)) {
      return false
    }

    return source.stems.includes(pairRule.stem)
  })
}

function hasBranchPillarPair(
  pairRule: BranchPillarPairRule,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!hiddenStemSources || hiddenStemSources.length === 0) {
    return false
  }

  return hiddenStemSources.some((source) => {
    if (source.branch !== pairRule.branch) {
      return false
    }

    if (pairRule.pillars && pairRule.pillars.length > 0 && !pairRule.pillars.includes(source.pillar)) {
      return false
    }

    return true
  })
}

function matchRequiredVisibleStemPillarPairs(
  pairRules: VisibleStemPillarPairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  if (!visibleStemSources || visibleStemSources.length === 0) {
    return false
  }

  return pairRules.every(pairRule => visibleStemSources.some(source => {
    if (source.stem !== pairRule.stem) {
      return false
    }
    if (pairRule.pillars && pairRule.pillars.length > 0 && !pairRule.pillars.includes(source.pillar)) {
      return false
    }
    return true
  }))
}

function matchOptionalVisibleStemPillarPairs(
  pairRules: VisibleStemPillarPairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  if (!visibleStemSources || visibleStemSources.length === 0) {
    return false
  }

  return pairRules.some(pairRule => visibleStemSources.some(source => {
    if (source.stem !== pairRule.stem) {
      return false
    }
    if (pairRule.pillars && pairRule.pillars.length > 0 && !pairRule.pillars.includes(source.pillar)) {
      return false
    }
    return true
  }))
}

function matchForbiddenVisibleStemPillarPairs(
  pairRules: VisibleStemPillarPairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  if (!visibleStemSources || visibleStemSources.length === 0) {
    return true
  }

  return pairRules.every(pairRule => visibleStemSources.every(source => {
    if (source.stem !== pairRule.stem) {
      return true
    }
    if (pairRule.pillars && pairRule.pillars.length > 0 && !pairRule.pillars.includes(source.pillar)) {
      return true
    }
    return false
  }))
}

function hasVisibleStemBranchPair(
  pairRule: VisibleStemBranchPairRule,
  visibleStemSources: VisibleStemSource[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!visibleStemSources || visibleStemSources.length === 0 || !hiddenStemSources || hiddenStemSources.length === 0) {
    return false
  }

  return visibleStemSources.some(visibleSource => {
    if (visibleSource.stem !== pairRule.stem) {
      return false
    }
    if (pairRule.pillars && pairRule.pillars.length > 0 && !pairRule.pillars.includes(visibleSource.pillar)) {
      return false
    }

    return hiddenStemSources.some(hiddenSource => {
      if (hiddenSource.pillar !== visibleSource.pillar) {
        return false
      }
      if (hiddenSource.branch !== pairRule.branch) {
        return false
      }
      if (pairRule.pillars && pairRule.pillars.length > 0 && !pairRule.pillars.includes(hiddenSource.pillar)) {
        return false
      }
      return true
    })
  })
}

function matchRequiredVisibleStemBranchPairs(
  pairRules: VisibleStemBranchPairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.every(pairRule => hasVisibleStemBranchPair(pairRule, visibleStemSources, hiddenStemSources))
}

function matchOptionalVisibleStemBranchPairs(
  pairRules: VisibleStemBranchPairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.some(pairRule => hasVisibleStemBranchPair(pairRule, visibleStemSources, hiddenStemSources))
}

function matchForbiddenVisibleStemBranchPairs(
  pairRules: VisibleStemBranchPairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.every(pairRule => !hasVisibleStemBranchPair(pairRule, visibleStemSources, hiddenStemSources))
}

function getVisibleStemSourcePillarIndex(pillar: VisibleStemSource['pillar']): number {
  const order: Array<VisibleStemSource['pillar']> = ['year', 'month', 'day', 'hour']
  return order.indexOf(pillar)
}

function matchesVisibleStemDistancePairRule(
  pairRule: VisibleStemDistancePairRule,
  visibleStemSources: VisibleStemSource[]
): boolean {
  return visibleStemSources.some((leftSource, leftIndex) => {
    if (leftSource.stem !== pairRule.stems[0]) {
      return false
    }
    if (pairRule.leftPillars && pairRule.leftPillars.length > 0 && !pairRule.leftPillars.includes(leftSource.pillar)) {
      return false
    }

    return visibleStemSources.some((rightSource, rightIndex) => {
      if (leftIndex === rightIndex) {
        return false
      }
      if (rightSource.stem !== pairRule.stems[1]) {
        return false
      }
      if (pairRule.rightPillars && pairRule.rightPillars.length > 0 && !pairRule.rightPillars.includes(rightSource.pillar)) {
        return false
      }

      const distance = Math.abs(getVisibleStemSourcePillarIndex(leftSource.pillar) - getVisibleStemSourcePillarIndex(rightSource.pillar))
      if (typeof pairRule.minDistance === 'number' && distance < pairRule.minDistance) {
        return false
      }
      if (typeof pairRule.maxDistance === 'number' && distance > pairRule.maxDistance) {
        return false
      }

      return true
    })
  })
}

function matchRequiredVisibleStemDistancePairs(
  pairRules: VisibleStemDistancePairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  if (!visibleStemSources || visibleStemSources.length === 0) {
    return false
  }

  return pairRules.every(pairRule => matchesVisibleStemDistancePairRule(pairRule, visibleStemSources))
}

function matchForbiddenVisibleStemDistancePairs(
  pairRules: VisibleStemDistancePairRule[] | undefined,
  visibleStemSources: VisibleStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  if (!visibleStemSources || visibleStemSources.length === 0) {
    return true
  }

  return pairRules.every(pairRule => !matchesVisibleStemDistancePairRule(pairRule, visibleStemSources))
}

function matchRequiredHiddenStemBranchPairs(
  pairRules: HiddenStemBranchPairRule[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.every(pairRule => hasHiddenStemBranchPair(pairRule, hiddenStemSources))
}

function matchRequiredBranchPillarPairs(
  pairRules: BranchPillarPairRule[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.every(pairRule => hasBranchPillarPair(pairRule, hiddenStemSources))
}

function matchOptionalBranchPillarPairs(
  pairRules: BranchPillarPairRule[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.some(pairRule => hasBranchPillarPair(pairRule, hiddenStemSources))
}

function matchForbiddenBranchPillarPairs(
  pairRules: BranchPillarPairRule[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.every(pairRule => !hasBranchPillarPair(pairRule, hiddenStemSources))
}

function matchOptionalHiddenStemBranchPairs(
  pairRules: HiddenStemBranchPairRule[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.some(pairRule => hasHiddenStemBranchPair(pairRule, hiddenStemSources))
}

function matchForbiddenHiddenStemBranchPairs(
  pairRules: HiddenStemBranchPairRule[] | undefined,
  hiddenStemSources: HiddenStemSource[] | undefined
): boolean {
  if (!pairRules || pairRules.length === 0) {
    return true
  }

  return pairRules.every(pairRule => !hasHiddenStemBranchPair(pairRule, hiddenStemSources))
}

function matchMinWuxingCounts(
  requiredCounts: Record<string, number> | undefined,
  actualCounts: Record<string, number> | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  if (!actualCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([wuxing, minCount]) => (actualCounts[wuxing] || 0) >= minCount)
}

function matchMaxWuxingCounts(
  requiredCounts: Record<string, number> | undefined,
  actualCounts: Record<string, number> | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  if (!actualCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([wuxing, maxCount]) => (actualCounts[wuxing] || 0) <= maxCount)
}

function matchDistinctStemGroupCounts(
  groupRules: DistinctStemGroupCountRule[] | undefined,
  visibleStems: string[] | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!groupRules || groupRules.length === 0) {
    return true
  }

  return groupRules.every((groupRule) => {
    if (!groupRule.stems || groupRule.stems.length === 0) {
      return true
    }

    const sourceStems = groupRule.scope === 'visible'
      ? (visibleStems || [])
      : groupRule.scope === 'hidden'
        ? (hiddenStems || [])
        : [...(visibleStems || []), ...(hiddenStems || [])]

    const distinctCount = new Set(sourceStems.filter(stem => groupRule.stems.includes(stem))).size

    if (typeof groupRule.minDistinctCount === 'number' && distinctCount < groupRule.minDistinctCount) {
      return false
    }

    if (typeof groupRule.maxDistinctCount === 'number' && distinctCount > groupRule.maxDistinctCount) {
      return false
    }

    return true
  })
}

function getStemTenGodCategory(dayStem: string, targetStem: string): string {
  const dayWuxing = getStemWuxing(dayStem)
  const targetWuxing = getStemWuxing(targetStem)

  if (!dayWuxing || !targetWuxing) {
    return ''
  }

  return getWuxingTenGodCategory(dayStem, targetWuxing)
}

function getWuxingTenGodCategory(dayStem: string, targetWuxing: string): string {
  const dayWuxing = getStemWuxing(dayStem)

  if (!dayWuxing || !targetWuxing) {
    return ''
  }

  if (targetWuxing === dayWuxing) {
    return '比劫'
  }

  if (BASIC_MAPPINGS.WUXING_SHENG[dayWuxing] === targetWuxing) {
    return '食伤'
  }

  if (BASIC_MAPPINGS.WUXING_KE[dayWuxing] === targetWuxing) {
    return '财星'
  }

  if (BASIC_MAPPINGS.WUXING_KE[targetWuxing] === dayWuxing) {
    return '官杀'
  }

  if (BASIC_MAPPINGS.WUXING_SHENG[targetWuxing] === dayWuxing) {
    return '印星'
  }

  return ''
}

function buildFormationTenGodCategories(
  dayStem: string | undefined,
  formationWuxings: string[] | undefined
): string[] | undefined {
  if (!dayStem || !formationWuxings || formationWuxings.length === 0) {
    return undefined
  }

  const categories = [...new Set(
    formationWuxings
      .map(wuxing => getWuxingTenGodCategory(dayStem, wuxing))
      .filter(Boolean)
  )]

  return categories.length > 0 ? categories : undefined
}

function buildTenGodCategoryCounts(
  dayStem: string | undefined,
  stems: string[] | undefined,
  excludeDayStemSelf: boolean
): Record<string, number> | null {
  if (!dayStem || !stems || stems.length === 0) {
    return null
  }

  const categoryCounts = stems.reduce<Record<string, number>>((counts, stem) => {
    const category = getStemTenGodCategory(dayStem, stem)
    if (category) {
      counts[category] = (counts[category] || 0) + 1
    }
    return counts
  }, {})

  if (excludeDayStemSelf && stems.includes(dayStem) && categoryCounts.比劫) {
    categoryCounts.比劫 = Math.max(categoryCounts.比劫 - 1, 0)
  }

  return categoryCounts
}

function mergeCategoryCounts(...countMaps: Array<Record<string, number> | null>): Record<string, number> | null {
  const validMaps = countMaps.filter((countMap): countMap is Record<string, number> => Boolean(countMap))
  if (validMaps.length === 0) {
    return null
  }

  return validMaps.reduce<Record<string, number>>((merged, current) => {
    Object.entries(current).forEach(([category, count]) => {
      merged[category] = (merged[category] || 0) + count
    })
    return merged
  }, {})
}

function buildTenGodCategoryDistinctStemSets(
  dayStem: string | undefined,
  stems: string[] | undefined,
  excludeDayStemSelf: boolean
): Record<string, Set<string>> | null {
  if (!dayStem || !stems || stems.length === 0) {
    return null
  }

  const categoryStemSets = stems.reduce<Record<string, Set<string>>>((sets, stem) => {
    if (excludeDayStemSelf && stem === dayStem) {
      return sets
    }

    const category = getStemTenGodCategory(dayStem, stem)
    if (!category) {
      return sets
    }

    if (!sets[category]) {
      sets[category] = new Set<string>()
    }
    sets[category].add(stem)
    return sets
  }, {})

  return Object.keys(categoryStemSets).length > 0 ? categoryStemSets : null
}

function buildTenGodCategoryDistinctStemCounts(
  dayStem: string | undefined,
  stems: string[] | undefined,
  excludeDayStemSelf: boolean
): Record<string, number> | null {
  const categoryStemSets = buildTenGodCategoryDistinctStemSets(dayStem, stems, excludeDayStemSelf)
  if (!categoryStemSets) {
    return null
  }

  return Object.entries(categoryStemSets).reduce<Record<string, number>>((counts, [category, stemSet]) => {
    counts[category] = stemSet.size
    return counts
  }, {})
}

function mergeDistinctCategoryCounts(
  ...setMaps: Array<Record<string, Set<string>> | null>
): Record<string, number> | null {
  const validMaps = setMaps.filter((setMap): setMap is Record<string, Set<string>> => Boolean(setMap))
  if (validMaps.length === 0) {
    return null
  }

  const categoryStemSets: Record<string, Set<string>> = {}

  validMaps.forEach((setMap) => {
    Object.entries(setMap).forEach(([category, stemSet]) => {
      if (!categoryStemSets[category]) {
        categoryStemSets[category] = new Set<string>()
      }

      stemSet.forEach(stem => categoryStemSets[category].add(stem))
    })
  })

  return Object.entries(categoryStemSets).reduce<Record<string, number>>((counts, [category, markerSet]) => {
    counts[category] = markerSet.size
    return counts
  }, {})
}

function matchMinTenGodCategoryVisibleCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const categoryCounts = buildTenGodCategoryCounts(dayStem, visibleStems, true)
  if (!categoryCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, minCount]) => (categoryCounts[category] || 0) >= minCount)
}

function matchMaxTenGodCategoryVisibleCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const categoryCounts = buildTenGodCategoryCounts(dayStem, visibleStems, true)
  if (!categoryCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, maxCount]) => (categoryCounts[category] || 0) <= maxCount)
}

function matchMinTenGodCategoryHiddenCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const categoryCounts = buildTenGodCategoryCounts(dayStem, hiddenStems, false)
  if (!categoryCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, minCount]) => (categoryCounts[category] || 0) >= minCount)
}

function matchMaxTenGodCategoryHiddenCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const categoryCounts = buildTenGodCategoryCounts(dayStem, hiddenStems, false)
  if (!categoryCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, maxCount]) => (categoryCounts[category] || 0) <= maxCount)
}

function matchMinTenGodCategoryTotalCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const categoryCounts = mergeCategoryCounts(
    buildTenGodCategoryCounts(dayStem, visibleStems, true),
    buildTenGodCategoryCounts(dayStem, hiddenStems, false)
  )
  if (!categoryCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, minCount]) => (categoryCounts[category] || 0) >= minCount)
}

function matchMaxTenGodCategoryTotalCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const categoryCounts = mergeCategoryCounts(
    buildTenGodCategoryCounts(dayStem, visibleStems, true),
    buildTenGodCategoryCounts(dayStem, hiddenStems, false)
  )
  if (!categoryCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, maxCount]) => (categoryCounts[category] || 0) <= maxCount)
}

function matchMinTenGodCategoryVisibleDistinctCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const distinctCounts = buildTenGodCategoryDistinctStemCounts(dayStem, visibleStems, true)
  if (!distinctCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, minCount]) => (distinctCounts[category] || 0) >= minCount)
}

function matchMaxTenGodCategoryVisibleDistinctCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const distinctCounts = buildTenGodCategoryDistinctStemCounts(dayStem, visibleStems, true)
  if (!distinctCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, maxCount]) => (distinctCounts[category] || 0) <= maxCount)
}

function matchMinTenGodCategoryTotalDistinctCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const distinctCounts = mergeDistinctCategoryCounts(
    buildTenGodCategoryDistinctStemSets(dayStem, visibleStems, true),
    buildTenGodCategoryDistinctStemSets(dayStem, hiddenStems, false)
  )
  if (!distinctCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, minCount]) => (distinctCounts[category] || 0) >= minCount)
}

function matchMaxTenGodCategoryTotalDistinctCounts(
  requiredCounts: Record<string, number> | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const distinctCounts = mergeDistinctCategoryCounts(
    buildTenGodCategoryDistinctStemSets(dayStem, visibleStems, true),
    buildTenGodCategoryDistinctStemSets(dayStem, hiddenStems, false)
  )
  if (!distinctCounts) {
    return false
  }

  return Object.entries(requiredCounts).every(([category, maxCount]) => (distinctCounts[category] || 0) <= maxCount)
}

function matchMinVisibleStemCounts(
  requiredCounts: Record<string, number> | undefined,
  visibleStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  if (!visibleStems || visibleStems.length === 0) {
    return false
  }

  const stemCounts = visibleStems.reduce<Record<string, number>>((counts, stem) => {
    counts[stem] = (counts[stem] || 0) + 1
    return counts
  }, {})

  return Object.entries(requiredCounts).every(([stem, minCount]) => (stemCounts[stem] || 0) >= minCount)
}

function matchMinTotalStemCounts(
  requiredCounts: Record<string, number> | undefined,
  visibleStems: string[] | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const stemCounts = [...(visibleStems || []), ...(hiddenStems || [])].reduce<Record<string, number>>((counts, stem) => {
    counts[stem] = (counts[stem] || 0) + 1
    return counts
  }, {})

  return Object.entries(requiredCounts).every(([stem, minCount]) => (stemCounts[stem] || 0) >= minCount)
}

function matchMaxTotalStemCounts(
  requiredCounts: Record<string, number> | undefined,
  visibleStems: string[] | undefined,
  hiddenStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  if (!visibleStems && !hiddenStems) {
    return false
  }

  const stemCounts = [...(visibleStems || []), ...(hiddenStems || [])].reduce<Record<string, number>>((counts, stem) => {
    counts[stem] = (counts[stem] || 0) + 1
    return counts
  }, {})

  return Object.entries(requiredCounts).every(([stem, maxCount]) => (stemCounts[stem] || 0) <= maxCount)
}

function matchMaxVisibleStemCounts(
  requiredCounts: Record<string, number> | undefined,
  visibleStems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  if (!visibleStems) {
    return false
  }

  const stemCounts = visibleStems.reduce<Record<string, number>>((counts, stem) => {
    counts[stem] = (counts[stem] || 0) + 1
    return counts
  }, {})

  return Object.entries(requiredCounts).every(([stem, maxCount]) => (stemCounts[stem] || 0) <= maxCount)
}

function matchMinStemCounts(
  requiredCounts: Record<string, number> | undefined,
  stems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  if (!stems || stems.length === 0) {
    return false
  }

  const stemCounts = stems.reduce<Record<string, number>>((counts, stem) => {
    counts[stem] = (counts[stem] || 0) + 1
    return counts
  }, {})

  return Object.entries(requiredCounts).every(([stem, minCount]) => (stemCounts[stem] || 0) >= minCount)
}

function matchMaxStemCounts(
  requiredCounts: Record<string, number> | undefined,
  stems: string[] | undefined
): boolean {
  if (!requiredCounts || Object.keys(requiredCounts).length === 0) {
    return true
  }

  const stemCounts = (stems || []).reduce<Record<string, number>>((counts, stem) => {
    counts[stem] = (counts[stem] || 0) + 1
    return counts
  }, {})

  return Object.entries(requiredCounts).every(([stem, maxCount]) => (stemCounts[stem] || 0) <= maxCount)
}

function countExtraCompanionVisible(dayStem: string | undefined, visibleStems: string[] | undefined): number | null {
  if (!dayStem || !visibleStems || visibleStems.length === 0) {
    return null
  }

  const dayWuxing = getStemWuxing(dayStem)
  if (!dayWuxing) {
    return null
  }

  const sameWuxingCount = visibleStems.filter(stem => getStemWuxing(stem) === dayWuxing).length
  const sameDayStemCount = visibleStems.filter(stem => stem === dayStem).length

  return Math.max(sameDayStemCount - 1, 0) + (sameWuxingCount - sameDayStemCount)
}

function matchCompanionVisibleCount(
  minCount: number | undefined,
  maxCount: number | undefined,
  dayStem: string | undefined,
  visibleStems: string[] | undefined
): boolean {
  if (typeof minCount !== 'number' && typeof maxCount !== 'number') {
    return true
  }

  const companionCount = countExtraCompanionVisible(dayStem, visibleStems)
  if (companionCount === null) {
    return false
  }

  if (typeof minCount === 'number' && companionCount < minCount) {
    return false
  }

  if (typeof maxCount === 'number' && companionCount > maxCount) {
    return false
  }

  return true
}

export function matchesRule<T extends MatchableRule>(rule: T, context: RuleMatchContext): boolean {
  const formationTenGodCategories = buildFormationTenGodCategories(context.dayStem, context.formationWuxings)

  return includesOrWildcard(rule.strengths, context.strengthStatus) &&
    includesOrWildcard(rule.yearStems, context.yearStem) &&
    includesOrWildcard(rule.months, context.monthBranch) &&
    includesOrWildcard(rule.hourBranches, context.hourBranch) &&
    includesOrWildcard(rule.dayMasters, context.dayMaster) &&
    includesOrWildcard(rule.dayStems, context.dayStem) &&
    includesOrWildcard(rule.patterns, context.pattern) &&
    includesOrWildcard(rule.currentJieqi, context.currentJieqi) &&
    includesAll(rule.requiredFormationWuxings, context.formationWuxings) &&
    includesAll(rule.requiredFormationTenGodCategories, formationTenGodCategories) &&
    includesAny(rule.optionalFormationTenGodCategories, formationTenGodCategories) &&
    excludesAll(rule.forbiddenFormationTenGodCategories, formationTenGodCategories) &&
    includesAll(rule.requiredVisibleStems, context.visibleStems) &&
    includesAny(rule.optionalVisibleStems, context.visibleStems) &&
    excludesAll(rule.forbiddenVisibleStems, context.visibleStems) &&
    matchRequiredVisibleStemPillarPairs(rule.requiredVisibleStemPillarPairs, context.visibleStemSources) &&
    matchOptionalVisibleStemPillarPairs(rule.optionalVisibleStemPillarPairs, context.visibleStemSources) &&
    matchForbiddenVisibleStemPillarPairs(rule.forbiddenVisibleStemPillarPairs, context.visibleStemSources) &&
    matchRequiredVisibleStemBranchPairs(rule.requiredVisibleStemBranchPairs, context.visibleStemSources, context.hiddenStemSources) &&
    matchOptionalVisibleStemBranchPairs(rule.optionalVisibleStemBranchPairs, context.visibleStemSources, context.hiddenStemSources) &&
    matchForbiddenVisibleStemBranchPairs(rule.forbiddenVisibleStemBranchPairs, context.visibleStemSources, context.hiddenStemSources) &&
    matchRequiredVisibleStemDistancePairs(rule.requiredVisibleStemDistancePairs, context.visibleStemSources) &&
    matchForbiddenVisibleStemDistancePairs(rule.forbiddenVisibleStemDistancePairs, context.visibleStemSources) &&
    matchMinVisibleStemCounts(rule.minVisibleStemCounts, context.visibleStems) &&
    matchMaxVisibleStemCounts(rule.maxVisibleStemCounts, context.visibleStems) &&
    includesAll(rule.requiredHiddenStems, context.hiddenStems) &&
    includesAny(rule.optionalHiddenStems, context.hiddenStems) &&
    excludesAll(rule.forbiddenHiddenStems, context.hiddenStems) &&
    matchRequiredBranchPillarPairs(rule.requiredBranchPillarPairs, context.hiddenStemSources) &&
    matchOptionalBranchPillarPairs(rule.optionalBranchPillarPairs, context.hiddenStemSources) &&
    matchForbiddenBranchPillarPairs(rule.forbiddenBranchPillarPairs, context.hiddenStemSources) &&
    matchRequiredHiddenStemBranchPairs(rule.requiredHiddenStemBranchPairs, context.hiddenStemSources) &&
    matchOptionalHiddenStemBranchPairs(rule.optionalHiddenStemBranchPairs, context.hiddenStemSources) &&
    matchForbiddenHiddenStemBranchPairs(rule.forbiddenHiddenStemBranchPairs, context.hiddenStemSources) &&
    matchMinStemCounts(rule.minHiddenStemCounts, context.hiddenStems) &&
    matchMaxStemCounts(rule.maxHiddenStemCounts, context.hiddenStems) &&
    matchMinTotalStemCounts(rule.minStemTotalCounts, context.visibleStems, context.hiddenStems) &&
    matchMaxTotalStemCounts(rule.maxStemTotalCounts, context.visibleStems, context.hiddenStems) &&
    matchDistinctStemGroupCounts(rule.distinctStemGroupCounts, context.visibleStems, context.hiddenStems) &&
    matchCompanionVisibleCount(rule.minCompanionVisibleCount, rule.maxCompanionVisibleCount, context.dayStem, context.visibleStems) &&
    matchMinWuxingCounts(rule.minWuxingCounts, context.wuxingCounts) &&
    matchMaxWuxingCounts(rule.maxWuxingCounts, context.wuxingCounts) &&
    matchMinTenGodCategoryVisibleCounts(rule.minTenGodCategoryVisibleCounts, context.dayStem, context.visibleStems) &&
    matchMaxTenGodCategoryVisibleCounts(rule.maxTenGodCategoryVisibleCounts, context.dayStem, context.visibleStems) &&
    matchMinTenGodCategoryHiddenCounts(rule.minTenGodCategoryHiddenCounts, context.dayStem, context.hiddenStems) &&
    matchMaxTenGodCategoryHiddenCounts(rule.maxTenGodCategoryHiddenCounts, context.dayStem, context.hiddenStems) &&
    matchMinTenGodCategoryTotalCounts(rule.minTenGodCategoryTotalCounts, context.dayStem, context.visibleStems, context.hiddenStems) &&
    matchMaxTenGodCategoryTotalCounts(rule.maxTenGodCategoryTotalCounts, context.dayStem, context.visibleStems, context.hiddenStems) &&
    matchMinTenGodCategoryVisibleDistinctCounts(rule.minTenGodCategoryVisibleDistinctCounts, context.dayStem, context.visibleStems) &&
    matchMaxTenGodCategoryVisibleDistinctCounts(rule.maxTenGodCategoryVisibleDistinctCounts, context.dayStem, context.visibleStems) &&
    matchMinTenGodCategoryTotalDistinctCounts(rule.minTenGodCategoryTotalDistinctCounts, context.dayStem, context.visibleStems, context.hiddenStems) &&
    matchMaxTenGodCategoryTotalDistinctCounts(rule.maxTenGodCategoryTotalDistinctCounts, context.dayStem, context.visibleStems, context.hiddenStems)
}

export function matchFirstRule<T extends MatchableRule>(rules: T[], context: RuleMatchContext): T | undefined {
  return [...rules]
    .sort((left, right) => (right.priority || 0) - (left.priority || 0))
    .find(rule => matchesRule(rule, context))
}
