import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const modalSource = readFileSync(new URL('../src/components/QuestionInspirationModal.tsx', import.meta.url), 'utf8');
const resultPageSource = readFileSync(new URL('../src/pages/ResultPage.tsx', import.meta.url), 'utf8');
const stylesSource = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const divinationInspirationSource = readFileSync(
  new URL('../src/lib/divination/inspiration.ts', import.meta.url),
  'utf8',
);

test('通用问题灵感模态窗支持筛选、搜索和分组渲染', () => {
  assert.match(modalSource, /export function QuestionInspirationModal/);
  assert.match(modalSource, /question-inspiration-filters/);
  assert.match(modalSource, /question-inspiration-search/);
  assert.match(modalSource, /question-inspiration-section-title/);
  assert.match(modalSource, /question-inspiration-item/);
  assert.match(modalSource, /question-inspiration-close-btn/);
});

test('结果页改为复用通用问题灵感模态窗', () => {
  assert.match(resultPageSource, /QuestionInspirationModal/);
  assert.match(resultPageSource, /filteredQuestionInspirationSections/);
});

test('问题灵感模态窗在电脑端使用更紧凑的布局', () => {
  assert.match(stylesSource, /@media \(min-width: 769px\) \{[\s\S]*\.question-inspiration-modal \{[\s\S]*width: min\(760px, calc\(100vw - 48px\)\);/);
  assert.match(stylesSource, /@media \(min-width: 769px\) \{[\s\S]*\.question-inspiration-toolbar \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(220px, 232px\);/);
  assert.match(stylesSource, /@media \(min-width: 769px\) \{[\s\S]*\.question-inspiration-list \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(stylesSource, /@media \(min-width: 769px\) \{[\s\S]*\.question-inspiration-item \{[\s\S]*padding: 8px 10px;/);
  assert.match(stylesSource, /\.question-inspiration-modal-head \{[\s\S]*justify-content: space-between;/);
});

test('占卜问题灵感数据已迁移自 sydf，并保留塔罗牌阵专属问题', () => {
  assert.match(divinationInspirationSource, /export const DIVINATION_INSPIRATION_TABS/);
  assert.match(divinationInspirationSource, /heading: '情感发展'/);
  assert.match(divinationInspirationSource, /heading: '事业发展'/);
  assert.match(divinationInspirationSource, /heading: '财运趋势'/);
  assert.match(divinationInspirationSource, /heading: '社交模式'/);
  assert.match(divinationInspirationSource, /heading: '学业规划'/);
  assert.match(divinationInspirationSource, /export const TAROT_SPREAD_INSPIRATION_QUESTIONS/);
  assert.match(divinationInspirationSource, /'我和TA的感情会如何发展？'/);
});
