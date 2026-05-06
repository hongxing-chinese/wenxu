export type ScopeType =
  | 'origin'
  | 'decadal'
  | 'yearly'
  | 'monthly'
  | 'daily'
  | 'hourly';

export type MutagenName = '禄' | '权' | '科' | '忌';

export type AnalysisPayloadV1 = {
  payload_version: 'analysis_payload_v1';
  language: 'zh-CN';
  basic_info: BasicInfo;
  active_scope: ActiveScopeInfo;
  palaces: PalaceFact[];
  evidence_pool: EvidenceFact[];
};

export type BasicInfo = {
  gender: string;
  solar_date: string;
  lunar_date: string;
  chinese_date: string;
  birth_time_label: string;
  birth_time_range: string;
  zodiac: string;
  sign: string;
  five_elements_class: string;
  soul: string;
  body: string;
  soul_palace_branch: string;
  body_palace_branch: string;
};

export type ActiveScopeInfo = {
  scope: ScopeType;
  label: string;
  solar_date: string;
  lunar_date: string;
  nominal_age: number;
  palace_index?: number;
  heavenly_stem?: string;
  earthly_branch?: string;
  mutagen_map: ScopeMutagenItem[];
};

export type ScopeMutagenItem = {
  mutagen: MutagenName;
  star: string;
};

export type PalaceFact = {
  index: number;
  name: string;
  is_body_palace: boolean;
  is_original_palace: boolean;
  heavenly_stem: string;
  earthly_branch: string;
  major_stars: StarFact[];
  minor_stars: StarFact[];
  other_stars: StarFact[];
  scope_stars: StarFact[];
  changsheng12: string;
  boshi12: string;
  base_jiangqian12: string;
  base_suiqian12: string;
  yearly_jiangqian12?: string;
  yearly_suiqian12?: string;
  decadal_range: [number, number];
  ages: number[];
  dynamic_scope_name?: string;
  scope_hits: string[];
  empty_state: boolean;
  opposite_palace_index: number;
  surrounded_palace_indexes: number[];
  summary_tags: string[];
};

export type StarFact = {
  name: string;
  kind: string;
  brightness?: string;
  birth_mutagen?: MutagenName;
  active_scope_mutagen?: MutagenName;
};

export type EvidenceFact = {
  id: string;
  stable_key: string;
  type: string;
  title: string;
  scope: ScopeType;
  palace_indexes: number[];
  palace_names: string[];
  star_names: string[];
  mutagens: string[];
  description: string;
  priority: number;
};
