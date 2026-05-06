import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { IFunctionalHoroscope } from 'iztro/lib/astro/FunctionalHoroscope';
import type {
  ActiveScopeInfo,
  AnalysisPayloadV1,
  BasicInfo,
  PalaceFact,
  ScopeMutagenItem,
  ScopeType,
  StarFact,
} from '../../types/analysis';
import { buildEvidencePool } from './build-evidence-pool';

type HoroscopeScopeItem =
  | IFunctionalHoroscope['decadal']
  | IFunctionalHoroscope['yearly']
  | IFunctionalHoroscope['monthly']
  | IFunctionalHoroscope['daily']
  | IFunctionalHoroscope['hourly'];

function mapScopeLabel(scope: ScopeType): string {
  switch (scope) {
    case 'origin':
      return '本命';
    case 'decadal':
      return '大限';
    case 'yearly':
      return '流年';
    case 'monthly':
      return '流月';
    case 'daily':
      return '流日';
    case 'hourly':
      return '流时';
  }
}

function resolveScopeLabel(
  currentScope: ScopeType,
  currentScopeItem?: HoroscopeScopeItem,
) {
  if (currentScope !== 'origin' && currentScopeItem?.name) {
    return currentScopeItem.name;
  }

  return mapScopeLabel(currentScope);
}

function getCurrentScopeItem(
  horoscope: IFunctionalHoroscope,
  currentScope: ScopeType,
): HoroscopeScopeItem | undefined {
  switch (currentScope) {
    case 'decadal':
      return horoscope.decadal;
    case 'yearly':
      return horoscope.yearly;
    case 'monthly':
      return horoscope.monthly;
    case 'daily':
      return horoscope.daily;
    case 'hourly':
      return horoscope.hourly;
    case 'origin':
    default:
      return undefined;
  }
}

function mapScopeMutagenMap(stars: string[]): ScopeMutagenItem[] {
  const mutagens = ['禄', '权', '科', '忌'] as const;

  return stars.slice(0, 4).map((star, index) => ({
    mutagen: mutagens[index],
    star,
  }));
}

function mapStarFact(
  star: any,
  activeScopeMutagenMap: ScopeMutagenItem[],
): StarFact {
  const activeScopeMutagen = activeScopeMutagenMap.find(
    (item) => item.star === star.name,
  )?.mutagen;

  return {
    name: star.name,
    kind: star.type,
    brightness: star.brightness || undefined,
    birth_mutagen: star.mutagen || undefined,
    active_scope_mutagen: activeScopeMutagen,
  };
}

function buildBasicInfo(astrolabe: IFunctionalAstrolabe): BasicInfo {
  return {
    gender: astrolabe.gender,
    solar_date: astrolabe.solarDate,
    lunar_date: astrolabe.lunarDate,
    chinese_date: astrolabe.chineseDate,
    birth_time_label: astrolabe.time,
    birth_time_range: astrolabe.timeRange,
    zodiac: astrolabe.zodiac,
    sign: astrolabe.sign,
    five_elements_class: astrolabe.fiveElementsClass,
    soul: astrolabe.soul,
    body: astrolabe.body,
    soul_palace_branch: astrolabe.earthlyBranchOfSoulPalace,
    body_palace_branch: astrolabe.earthlyBranchOfBodyPalace,
  };
}

function buildActiveScope(params: {
  horoscope: IFunctionalHoroscope;
  currentScope: ScopeType;
  currentScopeItem?: HoroscopeScopeItem;
}): ActiveScopeInfo {
  const { horoscope, currentScope, currentScopeItem } = params;

  return {
    scope: currentScope,
    label: resolveScopeLabel(currentScope, currentScopeItem),
    solar_date: horoscope.solarDate,
    lunar_date: horoscope.lunarDate,
    nominal_age: horoscope.age.nominalAge,
    palace_index: currentScopeItem?.index,
    heavenly_stem: currentScopeItem?.heavenlyStem,
    earthly_branch: currentScopeItem?.earthlyBranch,
    mutagen_map: mapScopeMutagenMap(currentScopeItem?.mutagen ?? []),
  };
}

function buildScopeHits(
  horoscope: IFunctionalHoroscope,
  palaceIndex: number,
): string[] {
  const hits: string[] = [];
  const decadalLabel = horoscope.decadal.name || '大限';

  if (horoscope.decadal.index === palaceIndex) hits.push(`${decadalLabel}落宫`);
  if (horoscope.age.index === palaceIndex) hits.push('童限落宫');
  if (horoscope.yearly.index === palaceIndex) hits.push('流年落宫');
  if (horoscope.monthly.index === palaceIndex) hits.push('流月落宫');
  if (horoscope.daily.index === palaceIndex) hits.push('流日落宫');
  if (horoscope.hourly.index === palaceIndex) hits.push('流时落宫');

  return hits;
}

function buildSummaryTags(params: {
  palace: any;
  horoscope: IFunctionalHoroscope;
  activeScopeMutagenMap: ScopeMutagenItem[];
  surrounded: any;
}): string[] {
  const { palace, horoscope, activeScopeMutagenMap, surrounded } = params;
  const tags: string[] = [];
  const decadalLabel = horoscope.decadal.name || '大限';

  if (palace.name === '命宫') tags.push('命宫');
  if (palace.isBodyPalace) tags.push('身宫');
  if (palace.isOriginalPalace) tags.push('来因宫');
  if (palace.isEmpty()) tags.push('空宫');

  if (palace.selfMutagedOneOf()) tags.push('有自化');
  if (surrounded.haveMutagen('忌' as never)) tags.push('三方四正见化忌');

  if (horoscope.decadal.index === palace.index) tags.push(`${decadalLabel}落宫`);
  if (horoscope.yearly.index === palace.index) tags.push('流年落宫');
  if (horoscope.monthly.index === palace.index) tags.push('流月落宫');
  if (horoscope.daily.index === palace.index) tags.push('流日落宫');
  if (horoscope.hourly.index === palace.index) tags.push('流时落宫');

  const allStars = [
    ...palace.majorStars,
    ...palace.minorStars,
    ...palace.adjectiveStars,
  ];

  if (allStars.some((star: any) => !!star.mutagen)) {
    tags.push('有生年四化');
  }

  if (
    allStars.some((star: any) =>
      activeScopeMutagenMap.some((item) => item.star === star.name),
    )
  ) {
    tags.push('有当前运限四化');
  }

  return tags;
}

function buildPalaceFacts(params: {
  astrolabe: IFunctionalAstrolabe;
  horoscope: IFunctionalHoroscope;
  currentScope: ScopeType;
  currentScopeItem?: HoroscopeScopeItem;
}): PalaceFact[] {
  const { astrolabe, horoscope, currentScopeItem } = params;
  const activeScopeMutagenMap = mapScopeMutagenMap(currentScopeItem?.mutagen ?? []);

  return astrolabe.palaces.map((palace: any) => {
    const surrounded = astrolabe.surroundedPalaces(palace.name as never);
    const scopeStarsRaw = currentScopeItem?.stars?.[palace.index] ?? [];

    return {
      index: palace.index,
      name: palace.name,
      is_body_palace: palace.isBodyPalace,
      is_original_palace: palace.isOriginalPalace,
      heavenly_stem: palace.heavenlyStem,
      earthly_branch: palace.earthlyBranch,
      major_stars: palace.majorStars.map((star: any) =>
        mapStarFact(star, activeScopeMutagenMap),
      ),
      minor_stars: palace.minorStars.map((star: any) =>
        mapStarFact(star, activeScopeMutagenMap),
      ),
      other_stars: palace.adjectiveStars.map((star: any) =>
        mapStarFact(star, activeScopeMutagenMap),
      ),
      scope_stars: scopeStarsRaw.map((star: any) =>
        mapStarFact(star, activeScopeMutagenMap),
      ),
      changsheng12: palace.changsheng12,
      boshi12: palace.boshi12,
      base_jiangqian12: palace.jiangqian12,
      base_suiqian12: palace.suiqian12,
      yearly_jiangqian12: horoscope.yearly.yearlyDecStar.jiangqian12[palace.index],
      yearly_suiqian12: horoscope.yearly.yearlyDecStar.suiqian12[palace.index],
      decadal_range: palace.decadal.range,
      ages: palace.ages,
      dynamic_scope_name: currentScopeItem?.palaceNames?.[palace.index],
      scope_hits: buildScopeHits(horoscope, palace.index),
      empty_state: palace.isEmpty(),
      opposite_palace_index: surrounded.opposite.index,
      surrounded_palace_indexes: [
        surrounded.target.index,
        surrounded.opposite.index,
        surrounded.wealth.index,
        surrounded.career.index,
      ],
      summary_tags: buildSummaryTags({
        palace,
        horoscope,
        activeScopeMutagenMap,
        surrounded,
      }),
    };
  });
}

export function buildAnalysisPayloadV1(params: {
  astrolabe: IFunctionalAstrolabe;
  horoscope: IFunctionalHoroscope;
  currentScope: ScopeType;
}): AnalysisPayloadV1 {
  const { astrolabe, horoscope, currentScope } = params;

  const currentScopeItem = getCurrentScopeItem(horoscope, currentScope);
  const basic_info = buildBasicInfo(astrolabe);
  const active_scope = buildActiveScope({
    horoscope,
    currentScope,
    currentScopeItem,
  });

  const palaces = buildPalaceFacts({
    astrolabe,
    horoscope,
    currentScope,
    currentScopeItem,
  });

  const evidence_pool = buildEvidencePool({
    astrolabe,
    horoscope,
    currentScope,
    palaces,
  });

  return {
    payload_version: 'analysis_payload_v1',
    language: 'zh-CN',
    basic_info,
    active_scope,
    palaces,
    evidence_pool,
  };
}
