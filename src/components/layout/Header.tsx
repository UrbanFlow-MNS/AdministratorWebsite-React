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
      <div className="flex items-center gap-2.5 min-w-0">
        {ctx?.onMenuToggle && (
          <button className="menu-toggle" onClick={ctx.onMenuToggle} aria-label="Menu">
            <RiMenuLine />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="overflow-hidden text-ellipsis whitespace-nowrap">{title}</h1>
          {subtitle && <p className="overflow-hidden text-ellipsis whitespace-nowrap">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}
