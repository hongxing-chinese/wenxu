import { useNavigate } from 'react-router-dom';

export function WelcomePage() {
  const navigate = useNavigate();

  // 获取 UTC+8 所在时区的当前年份
  const currentYear = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })
  ).getFullYear();

  return (
    <div className="welcome-page">
      {/* 顶部导航栏 */}
      <header className="welcome-nav">
        <div className="welcome-nav-inner">
          <div className="welcome-brand">
            <div className="welcome-brand-icon">问</div>
            <span className="welcome-brand-name">问虚</span>
          </div>
          <nav className="welcome-nav-actions">
            <button
              type="button"
              className="welcome-nav-link"
              onClick={() => navigate('/app')}
            >
              进入排盘
            </button>
            <button
              type="button"
              className="welcome-nav-cta"
              onClick={() => navigate('/app')}
            >
              开始使用
            </button>
          </nav>
        </div>
      </header>

      {/* Hero 首屏 */}
      <section className="welcome-hero">
        <span className="welcome-hero-badge">强大的 AI 术数引擎</span>
        <h1 className="welcome-hero-title">
          一言一念<br />洞见天机
        </h1>
        <p className="welcome-hero-desc">
          输入出生信息或占卜问题，AI 即刻生成专业排盘数据与结构化深度解析。
        </p>
        <div className="welcome-hero-actions">
          <button
            type="button"
            className="welcome-btn-primary"
            onClick={() => navigate('/app')}
          >
            开始排盘
          </button>
          <button
            type="button"
            className="welcome-btn-secondary"
            onClick={() => {
              document.getElementById('welcome-features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            了解更多
          </button>
        </div>
      </section>

      {/* 核心功能卡片 */}
      <section className="welcome-section" id="welcome-features">
        <div className="welcome-features-card">
          <FeatureCard
            icon="&#x1F3B4;"
            title="八字命理 &amp; 紫微斗数"
            desc="精准真太阳时换算，四柱八字、紫微十二宫深度多维解析。"
          />
          <FeatureCard
            icon="&#x1FA99;"
            title="六爻 &amp; 梅花易数"
            desc="动静阴阳，变卦推演，解答您当下的困惑与抉择。"
          />
          <FeatureCard
            icon="&#x1F0CF;"
            title="塔罗牌 &amp; 灵签"
            desc="结合现代心理学与中西神秘学，提供直观的运势指引。"
          />
        </div>
      </section>

      {/* 步骤引导 */}
      <section className="welcome-section welcome-steps-section">
        <h2 className="welcome-section-title">只需三步，即刻解读</h2>
        <div className="welcome-steps">
          <StepItem
            step="01"
            title="选择模式"
            desc="根据您的需求，选择排盘（查一生）或占卜（问一事）。"
          />
          <StepItem
            step="02"
            title="输入信息"
            desc="支持公历/农历输入，系统自动校对真太阳时。"
          />
          <StepItem
            step="03"
            title="AI 深度交互"
            desc="排盘后进入大模型对话，AI 将为您层层剖析命理密码。"
          />
        </div>
      </section>

      {/* 关于我们 & 联系人工 */}
      <section className="welcome-section welcome-info-section">
        <div className="welcome-info-grid" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '0 20px' }}>
          
          {/* 关于我们 */}
          <div className="welcome-about-card" id="about-us" style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>关于我们</h2>
            <div style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
              <p>八字、紫薇、风水、六壬、六爻，这些中国传统术数神秘而智慧，本站是 WideSeek 项目组构建的基于国产前沿 AI 大模型及算法测试的免费网站，内容由 AI 生成，本站为每位用户每天提供15次免费测试计划，仅供娱乐参考。如果项目对你有帮助，可以将网站分享出去。</p>
              
              <h3 style={{ color: '#333', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '0.5rem' }}>免责声明</h3>
              <p>切记，AI 算命仅供娱乐。生成的内容完全基于 AI 模型的推理，不构成任何形式的建议......祝您好运！</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="welcome-footer-brand">问虚</div>
        <p className="welcome-footer-tagline">AI 驱动的现代术数解读平台</p>
        <div className="welcome-footer-links">
          <a href="#about-us">关于我们</a>
          <a href="https://www.wideseek.de" target="_blank" rel="noopener noreferrer">WideSeek 官网</a>
        </div>
        <p className="welcome-footer-copy">&copy; {currentYear} 问虚. Made By WideSeek All rights reserved.</p>
      </footer>
    </div>
  );
}

// 辅助组件：特性卡片
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="welcome-feature-item">
      <div className="welcome-feature-icon" dangerouslySetInnerHTML={{ __html: icon }} />
      <div className="welcome-feature-text">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}

// 辅助组件：步骤引导
function StepItem({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="welcome-step">
      <div className="welcome-step-index">{step}</div>
      <div className="welcome-step-content">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}