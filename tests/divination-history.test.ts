import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const historySource = readFileSync(new URL('../src/lib/history-records.ts', import.meta.url), 'utf8');
const recordsPageSource = readFileSync(new URL('../src/pages/RecordsPage.tsx', import.meta.url), 'utf8');

test('历史存储新增占卜记录的增删查能力', () => {
  assert.match(historySource, /const DIVINATION_HISTORY_STORAGE_KEY = 'prompt_studio_divination_history_v1';/);
  assert.match(historySource, /export type DivinationHistoryRecord = \{/);
  assert.match(historySource, /export function loadDivinationHistory\(\)/);
  assert.match(historySource, /export function addDivinationHistory\(draft: DivinationDraft, session: DivinationSession\)/);
  assert.match(historySource, /export function getDivinationHistoryById\(id: string\)/);
  assert.match(historySource, /export function removeDivinationHistory\(id: string\)/);
});

test('历史页新增占卜记录页签，并支持打开占卜历史', () => {
  assert.match(recordsPageSource, /type HistoryTab = 'personal' \| 'compatibility' \| 'divination';/);
  assert.match(recordsPageSource, /label: '占卜记录', value: 'divination' as const/);
  assert.match(recordsPageSource, /loadDivinationHistory/);
  assert.match(recordsPageSource, /navigate\(`\/\?mode=divination&record=\$\{record\.id\}`\)/);
  assert.match(recordsPageSource, /暂无匹配的占卜记录/);
});
