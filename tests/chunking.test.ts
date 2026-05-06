import test from 'node:test';
import assert from 'node:assert/strict';
import { getManualChunk } from '../build/chunking';

test('React 与路由依赖会进入基础 vendor 分块', () => {
  assert.equal(
    getManualChunk('D:/project/node_modules/react-dom/client.js'),
    'react-vendor',
  );
  assert.equal(
    getManualChunk('D:/project/node_modules/react-router-dom/dist/index.mjs'),
    'router-vendor',
  );
});

test('紫微相关重型依赖会进入 ziwei-engine 分块', () => {
  assert.equal(
    getManualChunk('D:/project/node_modules/iztro/lib/index.js'),
    'iztro-vendor',
  );
  assert.equal(
    getManualChunk('D:/project/node_modules/tyme4ts/dist/index.js'),
    'tyme-vendor',
  );
  assert.equal(
    getManualChunk('D:/project/src/lib/iztro/runtime-helpers.ts'),
    'ziwei-core',
  );
  assert.equal(
    getManualChunk('D:/project/src/lib/full-chart-engine.ts'),
    'ziwei-core',
  );
});

test('八字相关模块会进入 bazi-engine 分块', () => {
  assert.equal(
    getManualChunk('D:/project/src/utils/bazi/baziCalculator.ts'),
    'bazi-engine',
  );
});

test('八字运势面板相关模块会进入独立异步分块', () => {
  assert.equal(
    getManualChunk('D:/project/src/components/BaziFortuneTools.tsx'),
    'bazi-fortune-ui',
  );
  assert.equal(
    getManualChunk('D:/project/src/utils/bazi/calendarTool.ts'),
    'bazi-fortune-ui',
  );
  assert.equal(
    getManualChunk('D:/project/src/utils/bazi/fortuneSelection.ts'),
    'bazi-fortune-ui',
  );
  assert.equal(
    getManualChunk('D:/project/src/utils/bazi/fortuneModalSelection.ts'),
    'bazi-fortune-ui',
  );
});

test('提示词生成模块会进入 prompt-engine 分块', () => {
  assert.equal(
    getManualChunk('D:/project/src/utils/ai/aiPromptBuilder.ts'),
    'prompt-engine',
  );
  assert.equal(
    getManualChunk('D:/project/src/lib/prompt-engine.ts'),
    'prompt-engine',
  );
});

test('无关模块保持默认分块策略', () => {
  assert.equal(
    getManualChunk('D:/project/src/pages/InputPage.tsx'),
    undefined,
  );
  assert.equal(
    getManualChunk('D:/project/src/lib/templates.ts'),
    undefined,
  );
  assert.equal(
    getManualChunk('D:/project/src/lib/synastry-prompts.ts'),
    undefined,
  );
});
