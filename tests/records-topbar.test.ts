import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

function getFirstRuleBlock(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matched = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
  assert.ok(matched, `未找到选择器 ${selector}`);
  return matched[1];
}

test('页面顶部栏改为绝对定位返回按钮和纯居中标题，避免 900px 断点互相遮挡', () => {
  const topbarRule = getFirstRuleBlock('.page-topbar');
  const backButtonRule = getFirstRuleBlock('.page-topbar-back');
  const titleRule = getFirstRuleBlock('.page-topbar-title');

  assert.match(topbarRule, /position:\s*relative;/);
  assert.match(topbarRule, /display:\s*flex;/);
  assert.match(topbarRule, /justify-content:\s*center;/);
  assert.match(topbarRule, /padding:\s*0 72px;/);

  assert.match(backButtonRule, /position:\s*absolute;/);
  assert.match(backButtonRule, /left:\s*0;/);
  assert.match(backButtonRule, /top:\s*50%;/);
  assert.match(backButtonRule, /transform:\s*translateY\(-50%\);/);
  assert.match(backButtonRule, /z-index:\s*2;/);

  assert.match(titleRule, /pointer-events:\s*none;/);
});
