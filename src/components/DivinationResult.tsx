import { getSummaryBlocks } from './DivinationPanel';
import type { DivinationDraft, DivinationSession } from '@/lib/divination/engine';

type DivinationResultProps = {
  draft: DivinationDraft;
  session: DivinationSession;
};

export function DivinationResult({ draft, session }: DivinationResultProps) {
  const summary = getSummaryBlocks(session.method, session.data);

  return (
    <div className="workspace-grid divination-output-grid">
      <section className="panel divination-result-panel">
        <div className="panel-head">
          <h2>{summary.title}</h2>
        </div>
        <div className="divination-result-content">
          <div className="divination-result-tags">
            {summary.tags.map((tag, index) => (
              <span key={index} className="divination-result-tag">
                {tag}
              </span>
            ))}
          </div>
          {summary.lines.length > 0 ? (
            <div className="divination-result-lines">
              {summary.lines.map((line, index) =>
                line ? (
                  <div key={index} className="divination-result-line">
                    {line}
                  </div>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
