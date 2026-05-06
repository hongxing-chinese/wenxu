export function getManualChunk(id: string) {
  if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
    return 'react-vendor';
  }

  if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
    return 'router-vendor';
  }

  if (id.includes('node_modules/iztro')) {
    return 'iztro-vendor';
  }

  if (id.includes('node_modules/tyme4ts')) {
    return 'tyme-vendor';
  }

  if (
    id.includes('src/lib/iztro') ||
    id.includes('src/lib/ziwei-') ||
    id.includes('src/lib/full-chart-engine.ts') ||
    id.includes('src/types/analysis.ts')
  ) {
    return 'ziwei-core';
  }

  if (
    id.includes('src/lib/prompt-engine.ts') ||
    id.includes('src/utils/ai')
  ) {
    return 'prompt-engine';
  }

  if (
    id.includes('src/components/BaziFortuneTools.tsx') ||
    id.includes('src/utils/bazi/calendarTool.ts') ||
    id.includes('src/utils/bazi/fortuneSelection.ts') ||
    id.includes('src/utils/bazi/fortuneModalSelection.ts')
  ) {
    return 'bazi-fortune-ui';
  }

  if (
    id.includes('src/utils/bazi') ||
    id.includes('src/utils/dateUtils.ts')
  ) {
    return 'bazi-engine';
  }

  return undefined;
}
