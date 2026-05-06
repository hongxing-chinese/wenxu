import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/pages/ResultPage.tsx', import.meta.url), 'utf8');

test('AI 页自定义问题使用本地草稿态，避免输入时直接写 URL', () => {
  assert.match(source, /const PROMPT_DRAFT_STORAGE_PREFIX = 'result-prompt-draft';/);
  assert.match(source, /const \[baziQuestionDraft, setBaziQuestionDraft\] = useState\(\(\) =>/);
  assert.match(source, /const \[ziweiQuestionDraft, setZiweiQuestionDraft\] = useState\(\(\) =>/);
  assert.match(source, /readPromptDraft\(baziDraftStorageKey\)/);
  assert.match(source, /readPromptDraft\(ziweiDraftStorageKey\)/);
  assert.match(source, /writePromptDraft\(baziDraftStorageKey, baziQuestionDraft\)/);
  assert.match(source, /writePromptDraft\(ziweiDraftStorageKey, ziweiQuestionDraft\)/);
  assert.match(source, /value=\{baziQuestionDraft\}/);
  assert.match(source, /value=\{ziweiQuestionDraft\}/);
  assert.match(source, /onChange=\{\(event\) => setBaziQuestionDraft\(event\.target\.value\)\}/);
  assert.match(source, /onChange=\{\(event\) => setZiweiQuestionDraft\(event\.target\.value\)\}/);
  assert.doesNotMatch(source, /onBlur=\{\(\) => syncBaziQuestionDraft\(\)\}/);
  assert.doesNotMatch(source, /onBlur=\{\(\) => syncZiweiQuestionDraft\(\)\}/);
});
