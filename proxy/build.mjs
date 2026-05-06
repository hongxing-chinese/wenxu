// esbuild 构建脚本: 将 proxy/src 下的 TS 代码打包为单个 proxy/dist/index.js

import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';

// 读取 .env 文件中的环境变量
function loadEnvFile() {
  try {
    if (!existsSync(new URL('./.env', import.meta.url))) {
      return {};
    }
    const envPath = new URL('./.env', import.meta.url);
    const content = readFileSync(envPath, 'utf-8');
    const env = {};
    content.split('\n').forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
    return env;
  } catch {
    return {};
  }
}

// 优先使用 process.env（阿里云 ESA 构建环境变量），其次使用 .env 文件
const envFromFile = loadEnvFile();
const envVars = {
  LLM_API_KEY: process.env.LLM_API_KEY || envFromFile.LLM_API_KEY || '',
  LLM_BASE_URL: process.env.LLM_BASE_URL || envFromFile.LLM_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  LLM_MODEL: process.env.LLM_MODEL || envFromFile.LLM_MODEL || 'qwen-plus',
  KV_NAMESPACE: process.env.KV_NAMESPACE || envFromFile.KV_NAMESPACE || 'wenxu-kv',
  APP_ORIGIN: process.env.APP_ORIGIN || envFromFile.APP_ORIGIN || '',
};

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
    // 通过 define 注入环境变量（构建时替换）
    'process.env.LLM_API_KEY': JSON.stringify(envVars.LLM_API_KEY || ''),
    'process.env.LLM_BASE_URL': JSON.stringify(envVars.LLM_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'),
    'process.env.LLM_MODEL': JSON.stringify(envVars.LLM_MODEL || 'qwen-plus'),
    'process.env.KV_NAMESPACE': JSON.stringify(envVars.KV_NAMESPACE || 'wenxu-kv'),
    'process.env.APP_ORIGIN': JSON.stringify(envVars.APP_ORIGIN || ''),
  },
  external: [],
});

console.log('✓ proxy/dist/index.js built successfully');
console.log('  LLM_BASE_URL:', envVars.LLM_BASE_URL || '(未设置，使用默认)');
console.log('  LLM_MODEL:', envVars.LLM_MODEL || '(未设置，使用默认)');
console.log('  LLM_API_KEY:', envVars.LLM_API_KEY ? '(已设置)' : '(未设置)');
