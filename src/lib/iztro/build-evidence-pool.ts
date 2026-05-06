import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { IFunctionalHoroscope } from 'iztro/lib/astro/FunctionalHoroscope';
import type { IFunctionalPalace } from 'iztro/lib/astro/FunctionalPalace';
import type { EvidenceFact, PalaceFact, ScopeType } from '../../types/analysis';

type EvidenceDraft = Omit<EvidenceFact, 'id'>;

function buildStableKey(parts: Array<string | number | undefined>) {
  return parts.filter(Boolean).join(':');
}

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

function resolveCurrentScopeLabel(
  horoscope: IFunctionalHoroscope,
  currentScope: ScopeType,
) {
  switch (currentScope) {
    case 'decadal':
      return horoscope.decadal.name || '大限';
    case 'yearly':
      return horoscope.yearly.name || '流年';
    case 'monthly':
      return horoscope.monthly.name || '流月';
    case 'daily':
      return horoscope.daily.name || '流日';
    case 'hourly':
      return horoscope.hourly.name || '流时';
    case 'origin':
    default:
      return mapScopeLabel(currentScope);
  }
}

function getPalaceNamesByIndexes(palaces: PalaceFact[], indexes: number[]) {
  return indexes
    .map((index) => palaces.find((item) => item.index === index)?.name)
    .filter(Boolean) as string[];
}

function collectPalaceEvidence(params: {
  astrolabe: IFunctionalAstrolabe;
  currentScope: ScopeType;
  currentScopeLabel: string;
  palace: PalaceFact;
  palaces: PalaceFact[];
}): EvidenceDraft[] {
  const { astrolabe, currentScope, currentScopeLabel, palace, palaces } = params;
  const drafts: EvidenceDraft[] = [];
  const palaceObj = astrolabe.palace(palace.name as never) as
    | IFunctionalPalace
    | undefined;

  if (!palaceObj) return drafts;

  if (palace.major_stars.length > 0) {
    drafts.push({
      stable_key: buildStableKey([
        'major',
        palace.index,
        palace.major_stars.map((s) => s.name).join('|'),
      ]),
      type: 'palace_major_stars',
      title: `${palace.name}主星为${palace.major_stars.map((s) => s.name).join('、')}`,
      scope: 'origin',
      palace_indexes: [palace.index],
      palace_names: [palace.name],
      star_names: palace.major_stars.map((s) => s.name),
      mutagens: [],
      description: `${palace.name}的主星组合会直接影响该宫位主题的解读重点。`,
      priority: palace.name === '命宫' ? 100 : 60,
    });
  }

  if (palace.empty_state) {
    drafts.push({
      stable_key: buildStableKey(['empty', palace.index]),
      type: 'palace_empty',
      title: `${palace.name}为空宫`,
      scope: 'origin',
      palace_indexes: [palace.index],
      palace_names: [palace.name],
      star_names: [],
      mutagens: [],
      description: `${palace.name}没有主星，解读时要结合对宫和三方四正。`,
      priority: 50,
    });
  }

  const birthMutagenStars = [
    ...palace.major_stars,
    ...palace.minor_stars,
    ...palace.other_stars,
  ].filter((star) => !!star.birth_mutagen);

  birthMutagenStars.forEach((star) => {
    drafts.push({
      stable_key: buildStableKey([
        'birth-mutagen',
        palace.index,
        star.name,
        star.birth_mutagen,
      ]),
      type: 'palace_birth_mutagen',
      title: `${palace.name}见生年化${star.birth_mutagen}`,
      scope: 'origin',
      palace_indexes: [palace.index],
      palace_names: [palace.name],
      star_names: [star.name],
      mutagens: [star.birth_mutagen!],
      description: `${star.name}在${palace.name}带有生年化${star.birth_mutagen}。`,
      priority: 80,
    });
  });

  const activeScopeMutagenStars = [
    ...palace.major_stars,
    ...palace.minor_stars,
    ...palace.other_stars,
  ].filter((star) => !!star.active_scope_mutagen);

  activeScopeMutagenStars.forEach((star) => {
    drafts.push({
      stable_key: buildStableKey([
        'scope-mutagen',
        currentScope,
        palace.index,
        star.name,
        star.active_scope_mutagen,
      ]),
      type: 'palace_scope_mutagen',
      title: `${palace.name}见${currentScopeLabel}化${star.active_scope_mutagen}`,
      scope: currentScope,
      palace_indexes: [palace.index],
      palace_names: [palace.name],
      star_names: [star.name],
      mutagens: [star.active_scope_mutagen!],
      description: `${star.name}在当前运限下带有化${star.active_scope_mutagen}。`,
      priority: 85,
    });
  });

  if (palace.scope_hits.length > 0) {
    drafts.push({
      stable_key: buildStableKey([
        'scope-hit',
        palace.index,
        palace.scope_hits.join('|'),
      ]),
      type: 'palace_scope_hit',
      title: `${palace.scope_hits.join('、')}位于${palace.name}`,
      scope: currentScope,
      palace_indexes: [palace.index],
      palace_names: [palace.name],
      star_names: [],
      mutagens: [],
      description: `${palace.name}在当前参考时间下被一个或多个运限命中。`,
      priority: 70,
    });
  }

  const surrounded = astrolabe.surroundedPalaces(palace.name as never);

  if (surrounded.haveMutagen('忌' as never)) {
    drafts.push({
      stable_key: buildStableKey(['surrounded-mutagen-ji', palace.index]),
      type: 'surrounded_mutagen',
      title: `${palace.name}三方四正见化忌`,
      scope: 'origin',
      palace_indexes: palace.surrounded_palace_indexes,
      palace_names: getPalaceNamesByIndexes(
        palaces,
        palace.surrounded_palace_indexes,
      ),
      star_names: [],
      mutagens: ['忌'],
      description: `${palace.name}及其三方四正宫位中可见化忌信息。`,
      priority: 90,
    });
  }

  if (palaceObj.selfMutagedOneOf()) {
    drafts.push({
      stable_key: buildStableKey(['self-mutaged', palace.index]),
      type: 'palace_self_mutaged',
      title: `${palace.name}出现自化`,
      scope: 'origin',
      palace_indexes: [palace.index],
      palace_names: [palace.name],
      star_names: [],
      mutagens: [],
      description: `${palace.name}存在自化现象，解读时需要提高权重。`,
      priority: 75,
    });
  }

  if (currentScope !== 'origin' && palace.dynamic_scope_name) {
    drafts.push({
      stable_key: buildStableKey([
        'dynamic-name',
        currentScope,
        palace.index,
        palace.dynamic_scope_name,
      ]),
      type: 'scope_dynamic_name',
      title: `${currentScopeLabel}视角下${palace.name}转为${palace.dynamic_scope_name}`,
      scope: currentScope,
      palace_indexes: [palace.index],
      palace_names: [palace.name],
      star_names: [],
      mutagens: [],
      description: `在${currentScopeLabel}视角下，${palace.name}对应的动态宫名为${palace.dynamic_scope_name}。`,
      priority: 45,
    });
  }

  return drafts;
}

function finalizeEvidence(drafts: EvidenceDraft[]): EvidenceFact[] {
  const map = new Map<string, EvidenceDraft>();

  drafts.forEach((item) => {
    if (!map.has(item.stable_key)) {
      map.set(item.stable_key, item);
    }
  });

  return Array.from(map.values())
    .sort((a, b) => b.priority - a.priority)
    .map((item, index) => ({
      id: `E${index + 1}`,
      ...item,
    }));
}

export function buildEvidencePool(params: {
  astrolabe: IFunctionalAstrolabe;
  horoscope: IFunctionalHoroscope;
  currentScope: ScopeType;
  palaces: PalaceFact[];
}): EvidenceFact[] {
  const { astrolabe, horoscope, currentScope, palaces } = params;
  const currentScopeLabel = resolveCurrentScopeLabel(horoscope, currentScope);

  const drafts = palaces.flatMap((palace) =>
    collectPalaceEvidence({
      astrolabe,
      currentScope,
      currentScopeLabel,
      palace,
      palaces,
    }),
  );

  return finalizeEvidence(drafts);
}
