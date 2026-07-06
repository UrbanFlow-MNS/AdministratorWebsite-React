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
        {/* Search */}
        <div className="relative max-w-xs">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <input
            className="input !pl-[34px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une ligne…"
          />
        </div>

        {/* Loading */}
        {routesStore.loading && (
          <div className="text-center py-12 text-muted text-sm">
            Chargement des lignes…
          </div>
        )}

        {/* Empty */}
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

        {/* Table */}
        {!routesStore.loading && filtered.length > 0 && (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="data-table w-full border-collapse">
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
                        <span className="badge badge-default">#{route.agencyId}</span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="btn btn-ghost btn-sm text-muted hover:!bg-primary-light hover:!text-primary"
                            onClick={() => navigate(`/routes/${route.routeId}/edit`)}
                            title="Modifier"
                          >
                            <RiPencilLine />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm text-muted hover:!bg-error/10 hover:!text-error"
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
