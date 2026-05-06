import type { ReactNode } from 'react';

type PageTopbarProps = {
  title: string;
  onBack: () => void;
  wide?: boolean;
  rightAction?: ReactNode;
};

export function PageTopbar(props: PageTopbarProps) {
  const { title, onBack, wide = false, rightAction } = props;

  return (
    <div className={`page-topbar${wide ? ' page-topbar-wide' : ''}`}>
      <button type="button" className="page-topbar-back" onClick={onBack}>
        返回
      </button>
      <h1 className="page-topbar-title">{title}</h1>
      {rightAction ? <div className="page-topbar-right">{rightAction}</div> : null}
    </div>
  );
}
