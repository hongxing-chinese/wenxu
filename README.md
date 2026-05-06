# 问虚

八字命理 · 紫微斗数 · 六爻卜卦 · 梅花易数 · 奇门遁甲 · 大六壬 · 塔罗牌 · 灵签 —— AI 提示词生成工具。

输入出生信息或占卜问题，生成专业排盘数据与结构化提示词，可通过内置 Chat 直接与大模型对话解读命盘。

> **项目地址**：https://github.com/hongxing-chinese/wenxu

## 核心功能

### 命理排盘

- **八字排盘**：四柱八字、十神、藏干、神煞、大运流年
- **紫微斗数排盘**：基于 iztro 库的完整紫微盘，支持单盘/合盘分析

### 占卜术数

- **六爻卜卦**：京房八宫法完整排盘，含纳甲、六亲、六神、世应、动变、空亡
- **梅花易数**：时间起卦 / 数字起卦 / 随机起卦 / 外应起卦，含体用生克与四时旺衰
- **奇门遁甲**：时家奇门转盘法排盘，含天地人神四盘、值符值使、格局标签、宫位洞察
- **大六壬**：天盘/四课/三传/月将/贵人/旬空完整排盘，含格局标签与断课模板
- **塔罗牌**：78 张完整塔罗（大阿卡纳 + 四组小阿卡纳），9 种牌阵，洗牌抽牌逻辑
- **三山国王灵签**：100 签灵签，含签题、签诗、典故故事及十二分类详细解签

### AI 对话

- 内置 Chat 面板，排盘后直接与大模型对话解读命盘
- 支持两种模式：云端代理（IP 限流）、本地直连（自配 API Key）
- 云端模式：每个 IP 每天免费 15 次对话，超出后提示配置本地模型

### 历史记录

- 本地 localStorage 自动保存排盘和占卜历史
- 云端 Edge KV 同步历史记录（按 IP 隔离）

## 技术架构

```
┌─────────────────────────────────────────────────┐
│                   浏览器 (SPA)                    │
│  React 19 + TypeScript + Vite                    │
│  ┌───────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ 排盘引擎   │ │ Chat面板  │ │ 本地LLM配置    │  │
│  └───────────┘ └────┬─────┘ └────────────────┘  │
│                     │                             │
│  ┌──────────────────┴──────────────────────────┐ │
│  │         api-client.ts (SSE 流式解析)         │ │
│  └──────────────────┬──────────────────────────┘ │
└─────────────────────┼───────────────────────────┘
                      │
              ┌───────┴───────┐
              │  ESA Edge Fn  │  ← proxy/dist/index.js
              │  /api/chat/*  │  ← LLM 代理 + IP 限流
              │  /api/history │  ← Edge KV 历史 CRUD
              └───────┬───────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
    IP 限流计数   LLM API      Edge KV
   (每天15次/IP)  (通义千问等)  (历史记录)
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript 5.9 |
| 构建工具 | Vite 7 + esbuild |
| 路由 | React Router 7 |
| 历法计算 | tyme4ts / iztro |
| 边缘运行时 | Alibaba Cloud ESA Edge Functions (V8 Isolate) |
| 存储 | ESA Edge KV（IP 限流 + 云端历史） |
| LLM 代理 | SSE 流式转发，兼容 OpenAI API 格式 |

## 本地开发

### 前置条件

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

Vite 默认启动在 `http://localhost:5173`。

> **注意**：本地开发时边缘函数不会运行。Chat 功能需使用「本地 LLM」模式（在界面上配置你自己的 OpenAI-compatible API Key）。IP 限流和云端历史同步功能在本地不可用，需部署到 ESA 后使用。

## 构建

```bash
# 仅构建前端
npm run build

# 构建前端 + 边缘函数
npm run build:all
```

| 构建产物 | 路径 | 说明 |
|---------|------|------|
| 前端 SPA | `dist/` | HTML/CSS/JS 静态资源 |
| 边缘函数 | `proxy/dist/index.js` | 单文件 ESM |

## 环境变量说明

| 变量名 | 必填 | 说明 | 示例 |
|--------|------|------|------|
| `KV_NAMESPACE` | 是 | ESA Edge KV 命名空间名称 | `wenxu-kv` |
| `APP_ORIGIN` | 是 | 应用完整域名（含协议，无尾斜杠） | `https://wenxu.example.com` |
| `LLM_BASE_URL` | 否 | LLM API 地址（兼容 OpenAI 格式） | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `LLM_MODEL` | 否 | 模型名称 | `qwen-plus` |
| `LLM_API_KEY` | 是 | LLM API 密钥 | `sk-xxx` |

## 部署到阿里云 ESA

### 第一步：创建 ESA 实例

1. 登录 [阿里云 ESA 控制台](https://esa.console.aliyun.com/)
2. 创建 ESA 实例，绑定你的域名
3. 按提示修改域名 DNS，将 CNAME 指向 ESA 分配的地址

### 第二步：创建 Edge KV 命名空间

1. 在 ESA 控制台 → **边缘存储** → **KV 存储**
2. 创建命名空间（名称如 `wenxu-kv`）
3. 记下命名空间名称，填入环境变量 `KV_NAMESPACE`

> **KV 用途**：
> - IP 限流计数（每个 IP 每天 15 次免费对话）
> - 云端历史记录同步

### 第三步：配置环境变量

在阿里云 ESA 有两种环境变量配置方式：

#### 方式一：ESA Pages 环境变量（推荐）

在 ESA 控制台 → **站点设置** → **环境变量** 中添加：

| 变量 | 值 |
|------|-----|
| `KV_NAMESPACE` | 第二步创建的命名空间名称 |
| `APP_ORIGIN` | `https://你的域名` |
| `LLM_BASE_URL` | `https://api.xiaomimimo.com/v1`（或其他兼容 API） |
| `LLM_MODEL` | `mimo-v2.5` |
| `LLM_API_KEY` | 你的大模型 API Key |

**注意**：这些是构建时环境变量，会在边缘函数运行时通过 `process.env` 访问。

#### 方式二：边缘函数环境变量

在 ESA 控制台 → **边缘函数** → **环境变量** 中添加相同的环境变量。此方式的环境变量通过函数参数传递。

### 第四步：部署

#### 方式一：ESA CLI 自动部署

```bash
# 安装 ESA CLI（如果没有）
npm install esa-cli -g

# 登录
esa-cli login

# 一键部署（自动执行 build:all + 上传）
esa-cli deploy
```

ESA 会读取根目录的 `esa.jsonc` 配置：
- 执行 `npm run build:all` 构建前端和边缘函数
- 将 `dist/` 作为 Pages 静态资源上传
- 将 `proxy/dist/index.js` 作为 Edge Function 入口绑定到 `/api/*`

#### 方式二：手动部署

```bash
# 1. 构建
npm run build:all

# 2. 在 ESA 控制台手动操作：
#    - 上传 dist/ 目录到 Pages
#    - 上传 proxy/dist/index.js 到 Edge Functions
#    - 配置路由规则：/api/* → Edge Function，其余 → Pages
```

### 第五步：验证

1. 访问 `https://你的域名`，确认页面正常加载
2. 在 Chat 面板发送问题，确认 LLM 流式响应正常
3. 测试 IP 限流：连续发送 6 次对话，第 6 次应返回 429 错误
4. 检查历史记录是否在本地和云端同步保存

## Chat 两种模式

| 模式 | 条件 | 说明 |
|------|------|------|
| **cloud** | 未配置本地 API Key | 通过边缘函数代理发送，IP 每天限 15 次 |
| **local** | 配置了本地 API Key | 浏览器直接调用用户自己的 LLM API，无限制 |

## 本地 LLM 配置

在界面右上角点击 ⚙ 按钮，配置：

| 字段 | 说明 |
|------|------|
| API 地址 | OpenAI-compatible API 地址 |
| 模型名称 | 如 `gpt-4o-mini`、`qwen-plus` |
| API Key | 你的 API 密钥 |

配置保存后，Chat 面板将自动切换到本地模式，绕过云端 IP 限流。

## ESA 边缘函数限制

| 限制项 | 值 |
|--------|------|
| 代码包大小 | 4MB |
| 单次执行超时 | 120 秒 |
| KV 单 key 大小 | 512 字节 |
| KV 单 value 大小 | 1.8MB |
| 运行时 | V8 Isolate (ES6+) |

## 项目结构

```
├── esa.jsonc                 # ESA 部署配置
├── proxy/                    # ESA 边缘函数
│   ├── build.mjs             # esbuild 构建脚本
│   ├── tsconfig.json
│   ├── dist/index.js         # 构建产物（单文件 ESM）
│   └── src/
│       ├── index.ts          # 入口：路由分发 + CORS
│       ├── lib/
│       │   └── kv.ts         # Edge KV 存储封装
│       └── routes/
│           ├── chat.ts       # LLM 代理 + IP 限流
│           └── history.ts    # 历史记录 CRUD
└── src/
    ├── components/
    │   ├── ChatPanel.tsx          # AI 对话面板
    │   ├── DivinationPanel.tsx    # 占卜表单
    │   ├── DivinationResult.tsx   # 占卜结果展示
    │   ├── LocalLLMConfigModal.tsx # 本地 LLM 配置弹窗
    │   └── ...
    ├── lib/
    │   ├── api-client.ts     # 前端 API 客户端
    │   ├── local-llm-config.ts # 本地 LLM 配置读写
    │   ├── history-records.ts # 本地历史记录（localStorage）
    │   └── ...
    └── pages/
        ├── InputPage.tsx      # 输入页（排盘/占卜表单）
        ├── ResultPage.tsx     # 结果页（含 Chat 面板）
        ├── RecordsPage.tsx    # 历史记录页
        └── ...
```

## 八字分析引擎

| 模块 | 文件 | 说明 |
|------|------|------|
| 旺衰得分 | `baziStrengthAnalyzer.ts` | 五维评分体系（月令+会局+根气+帮扶+克制） |
| 格局判定 | `baziPatternStrategy.ts` | 透干优先取格、建禄/阳刃/专旺/从格等 |
| 用神推导 | `baziUsefulGodStrategy.ts` | 扶抑→调候→病药→通关四层决策链 |
| 喜忌规则 | `baziUsefulGodRules.ts` | 规则引擎驱动的喜忌五行/十神匹配 |
| 穷通宝鉴 | `baziTherapeuticRules.ts` | 十日干×十二月令 × 700+ 条精细规则 |
| 病药/通关 | `baziEnhancement.ts` | 病药法、通关法、寒热燥湿分析 |
| 经典格局 | `baziEnhancement.ts` | 渊海子平格局：阳刃格、建禄格、曲直格等 + 化气格 |
| 神煞互参 | `baziShenSha.ts` | 40+ 神煞 + 十神互参（桃花+七杀、羊刃驾杀等） |
| 规则匹配 | `baziRuleMatcher.ts` | 通用规则引擎（天干/地支/五行/十神/柱位多维匹配） |
| 提示词拼装 | `baziPromptEnhancement.ts` | 场景化维度开关 + 结构化输出 |

## 占卜引擎

| 模块 | 文件 | 说明 |
|------|------|------|
| 占卜调度 | `lib/divination/engine.ts` | 统一调度六大算法，生成占卜会话与提示词 |
| 占卜配置 | `lib/divination/config.ts` | 六种占卜类型、牌阵、起卦方式、断课模板 |
| 六爻排盘 | `lib/divination/algorithms/liuyao.ts` | 京房八宫法，纳甲/六亲/六神/世应/动变/空亡 |
| 梅花排盘 | `lib/divination/algorithms/meihua.ts` | 四类起卦 + 体用生克 + 四时旺衰 |
| 奇门排盘 | `lib/divination/algorithms/qimen.ts` | 时家奇门转盘法，天地人神四盘 + 格局标签 |
| 大六壬排盘 | `lib/divination/algorithms/liuren.ts` | 四课三传 + 月将贵人 + 格局标签 |
| 灵签求签 | `lib/divination/algorithms/ssgw.ts` | 三山国王 100 签，模拟真实求签 |
| 塔罗牌 | `utils/tarot.ts` | 78 张牌 + 9 种牌阵 + 洗牌抽牌 |
| 六十四卦 | `utils/hexagram-data.ts` | 八宫卦序 + 爻辞 + 卦象数据 |
| 奇门引导 | `utils/qimen-guidance.ts` | 按问题类型推荐参考宫位与优先级 |