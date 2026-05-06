import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

test('桌面端运限选择器支持横向滚动，并默认一行显示12个', () => {
  assert.match(
    css,
    /\.fortune-container\s*\{[^}]*overflow-x:\s*scroll;[^}]*overflow-y:\s*hidden;[^}]*scrollbar-width:\s*thin;[^}]*\}/s,
  );
  assert.match(
    css,
    /\.fortune-item\s*\{[^}]*flex:\s*0 0 calc\(100% \/ 12\);[^}]*\}/s,
  );
  assert.match(
    css,
    /\.fortune-container::-webkit-scrollbar\s*\{[^}]*height:\s*8px;[^}]*\}/s,
  );
});
