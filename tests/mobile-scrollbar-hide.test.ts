import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('移动端全局隐藏纵向和横向滚动条，但不禁用滚动', () => {
  assert.match(
    css,
    /@media \(max-width: 900px\)\s*\{[\s\S]*\*\s*\{[\s\S]*scrollbar-width:\s*none;[\s\S]*-ms-overflow-style:\s*none;[\s\S]*\}[\s\S]*\*::-webkit-scrollbar\s*\{[\s\S]*width:\s*0;[\s\S]*height:\s*0;[\s\S]*display:\s*none;[\s\S]*\}/,
  );
});
