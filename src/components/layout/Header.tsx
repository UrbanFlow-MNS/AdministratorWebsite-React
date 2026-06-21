import { useOutletContext } from 'react-router-dom';
import { RiMenuLine } from 'react-icons/ri';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface OutletCtx {
  onMenuToggle: () => void;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const ctx = useOutletContext<OutletCtx | null>();

  return (
    <div className="page-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {ctx?.onMenuToggle && (
          <button className="menu-toggle" onClick={ctx.onMenuToggle} aria-label="Menu">
            <RiMenuLine />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h1>
          {subtitle && <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}
