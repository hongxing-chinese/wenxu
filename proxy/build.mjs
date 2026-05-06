// esbuild 构建脚本: 将 proxy/src 下的 TS 代码打包为单个 proxy/dist/index.js

import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';

await mkdir(new URL('./dist', import.meta.url), { recursive: true });

await build({
  entryPoints: ['./proxy/src/index.ts'],
  bundle: true,
  outfile: './proxy/dist/index.js',
  format: 'esm',
  target: 'es2022',
  platform: 'browser',
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  define: {
    'process.env.NODE_ENV': '"production"',
    // 保留 process.env，不进行替换，让运行时读取实际环境变量
  },
  external: [],
});

console.log('✓ proxy/dist/index.js built successfully');
