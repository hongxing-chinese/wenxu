import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('全局禁用移动端默认蓝色点击高亮', () => {
  assert.match(css, /html\s*\{[\s\S]*-webkit-tap-highlight-color:\s*transparent;[\s\S]*\}/);
  assert.match(
    css,
    /a,\s*button,\s*input,\s*select,\s*textarea,\s*label,\s*summary,\s*\[role='button'\]\s*\{[\s\S]*-webkit-tap-highlight-color:\s*transparent;[\s\S]*\}/,
  );
});
