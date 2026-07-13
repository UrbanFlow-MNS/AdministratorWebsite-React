import { observer } from 'mobx-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiRouteLine, RiAddLine, RiSearchLine, RiPencilLine, RiDeleteBinLine } from 'react-icons/ri';
import { routesStore } from '../../stores/routes.store';
import { useRoutes } from '../../hooks/useRoutes';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/layout/Header';
import type { Route } from '../../types/route.types';

export const RoutesListContainer = observer(() => {
  useRoutes();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = routesStore.routes.filter(
    (r) =>
      r.routeShortName.toLowerCase().includes(search.toLowerCase()) ||
      r.routeLongName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (route: Route) => {
    if (!confirm(`Supprimer la ligne "${route.routeShortName} — ${route.routeLongName}" ?`)) return;
    setDeletingId(route.routeId);
    try {
      await routesStore.remove(route.routeId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Lignes"
        subtitle={`${routesStore.routes.length} ligne${routesStore.routes.length !== 1 ? 's' : ''}`}
        actions={
          <Button onClick={() => navigate('/routes/create')} size="sm">
            <RiAddLine /> Nouvelle ligne
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6 flex flex-col gap-4">
        <div className="relative max-w-xs">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <input
            className="h-[38px] w-full pl-[34px] pr-3 bg-surface border-[1.5px] border-border rounded-[10px] text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus:border-primary focus:shadow-[0_0_0_3px_rgba(105,18,226,0.12)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une ligne…"
          />
        </div>

        {routesStore.loading && (
          <div className="text-center py-12 text-muted text-sm">
            Chargement des lignes…
          </div>
        )}

        {!routesStore.loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
              <RiRouteLine className="text-primary text-[1.375rem]" />
            </div>
            <p className="text-sm font-medium text-ink">
              {search ? 'Aucune ligne ne correspond à votre recherche' : 'Aucune ligne enregistrée'}
            </p>
            {!search && (
              <Button variant="secondary" size="sm" onClick={() => navigate('/routes/create')}>
                Créer la première ligne
              </Button>
            )}
          </div>
        )}

        {!routesStore.loading && filtered.length > 0 && (
          <div className="bg-surface border border-border rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm [&_th]:bg-[#F7F7FA] [&_th]:px-5 [&_th]:py-2.5 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-muted [&_th]:border-b [&_th]:border-border [&_td]:px-5 [&_td]:py-3 [&_td]:align-middle [&_td]:border-b [&_td]:border-[#F0F0F5] [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-[#FAFAFD]">
                <thead>
                  <tr>
                    <th className="text-left">Ligne</th>
                    <th className="text-left">Nom complet</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Agence</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((route) => (
                    <tr
                      key={route.routeId}
                      className="cursor-pointer"
                      onClick={() => navigate(`/routes/${route.routeId}`)}
                    >
                      <td>
                        <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 h-[30px] rounded-lg text-[0.8125rem] font-bold bg-primary text-white">
                          {route.routeShortName}
                        </span>
                      </td>
                      <td className="font-semibold text-ink">{route.routeLongName}</td>
                      <td className="text-muted text-sm">{route.routeTypeName}</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBEBF0] text-muted">#{route.agencyId}</span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-[0.8125rem] font-medium rounded-[10px] cursor-pointer whitespace-nowrap border-none outline-none transition-[background-color,box-shadow,opacity] duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-muted enabled:hover:bg-primary-light enabled:hover:text-primary"
                            onClick={() => navigate(`/routes/${route.routeId}/edit`)}
                            title="Modifier"
                          >
                            <RiPencilLine />
                          </button>
                          <button
                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-[0.8125rem] font-medium rounded-[10px] cursor-pointer whitespace-nowrap border-none outline-none transition-[background-color,box-shadow,opacity] duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-muted enabled:hover:bg-error/10 enabled:hover:text-error"
                            onClick={() => handleDelete(route)}
                            disabled={deletingId === route.routeId}
                            title="Supprimer"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
