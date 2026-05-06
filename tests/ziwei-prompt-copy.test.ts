import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ZIWEI_ANALYSIS_REQUIREMENT,
  ZIWEI_ANALYST_ROLE,
  ZIWEI_COMPATIBILITY_ROLE,
} from '../src/lib/ziwei-prompt-copy';

test('紫微角色文案具备明确角色设定', () => {
  assert.match(ZIWEI_ANALYST_ROLE, /资深紫微斗数命盘分析师/);
  assert.match(ZIWEI_ANALYST_ROLE, /命宫、身宫、十二宫/);
  assert.match(ZIWEI_ANALYST_ROLE, /格局/);
  assert.match(ZIWEI_ANALYST_ROLE, /自化/);
  assert.match(ZIWEI_ANALYST_ROLE, /飞化/);
  assert.match(ZIWEI_COMPATIBILITY_ROLE, /资深紫微斗数合盘分析师/);
  assert.match(ZIWEI_COMPATIBILITY_ROLE, /四化/);
  assert.match(ZIWEI_ANALYSIS_REQUIREMENT, /结论需对应盘面依据/);
  assert.match(ZIWEI_ANALYSIS_REQUIREMENT, /宫位、主星、四化/);
  assert.match(ZIWEI_ANALYSIS_REQUIREMENT, /运限触发/);
});
