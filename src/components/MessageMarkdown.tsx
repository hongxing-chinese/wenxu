import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MessageMarkdown({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a target="_blank" rel="noopener noreferrer" {...props} />,
          table: (props) => (
            <div className="markdown-table-wrap">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
