import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/pages/ResultPage.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('AI 页的提示词设置和提示词来源标题带有专用类，便于移动端隐藏', () => {
  assert.match(source, /<h2 className="prompt-settings-title">提示词设置<\/h2>/);
  assert.match(source, /<span className="prompt-source-title">提示词来源<\/span>/);
});

test('移动端隐藏 AI 页的提示词设置和提示词来源标题', () => {
  assert.match(
    css,
    /@media \(max-width: 900px\)\s*\{[\s\S]*\.prompt-settings-title,\s*\.prompt-source-title\s*\{[\s\S]*display:\s*none;[\s\S]*\}/,
  );
});

test('移动端同时隐藏 AI 页字段头，减少占位', () => {
  assert.match(
    css,
    /@media \(max-width: 900px\)\s*\{[\s\S]*\.workspace-grid \.field-header\s*\{[\s\S]*display:\s*none;[\s\S]*\}/,
  );
});
