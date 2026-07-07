import { observer } from 'mobx-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMapPin2Line, RiPencilLine, RiDeleteBinLine, RiSearchLine, RiAddLine } from 'react-icons/ri';
import { stopsStore } from '../../stores/stops.store';
import { useStops } from '../../hooks/useStops';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/layout/Header';
import type { Stop } from '../../types/stop.types';

export const StopsListContainer = observer(() => {
  useStops();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = stopsStore.stops.filter((s) =>
    s.stopName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (stop: Stop) => {
    if (!confirm(`Supprimer l'arrêt "${stop.stopName}" ?`)) return;
    setDeletingId(stop.stopId);
    try {
      await stopsStore.remove(stop.stopId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Arrêts"
        subtitle={`${stopsStore.stops.length} arrêt${stopsStore.stops.length !== 1 ? 's' : ''} enregistré${stopsStore.stops.length !== 1 ? 's' : ''}`}
        actions={
          <Button onClick={() => navigate('/stops/create')} size="sm">
            <RiAddLine /> Nouvel arrêt
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6 flex flex-col gap-4">
        <div className="relative max-w-xs">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <input
            className="input !pl-[34px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un arrêt…"
          />
        </div>

        {stopsStore.loading && (
          <div className="text-center py-12 text-muted text-sm">
            Chargement des arrêts…
          </div>
        )}

        {stopsStore.error && (
          <div className="bg-error/5 border border-error/30 rounded-[10px] px-4 py-3 text-sm text-error">
            {stopsStore.error}
          </div>
        )}

        {!stopsStore.loading && !stopsStore.error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
              <RiMapPin2Line className="text-primary text-[1.375rem]" />
            </div>
            <p className="text-sm font-medium text-ink">
              {search ? 'Aucun arrêt ne correspond à votre recherche' : 'Aucun arrêt enregistré'}
            </p>
            {!search && (
              <Button variant="secondary" size="sm" onClick={() => navigate('/stops/create')}>
                Créer le premier arrêt
              </Button>
            )}
          </div>
        )}

        {!stopsStore.loading && filtered.length > 0 && (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="data-table w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left">Nom</th>
                    <th className="text-left">Coordonnées</th>
                    <th className="text-left">Agence</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((stop) => (
                    <tr key={stop.stopId}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-[30px] h-[30px] rounded-full bg-primary-light flex items-center justify-center shrink-0">
                            <RiMapPin2Line className="text-primary text-[0.875rem]" />
                          </div>
                          <span className="font-semibold text-ink">{stop.stopName}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-muted">
                        {stop.stopLat.toFixed(5)}, {stop.stopLong.toFixed(5)}
                      </td>
                      <td>
                        <span className="badge badge-default">#{stop.agencyId}</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="btn btn-ghost btn-sm text-muted hover:!bg-primary-light hover:!text-primary"
                            onClick={() => navigate(`/stops/${stop.stopId}/edit`)}
                            title="Modifier"
                          >
                            <RiPencilLine />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm text-muted hover:!bg-error/10 hover:!text-error"
                            onClick={() => handleDelete(stop)}
                            disabled={deletingId === stop.stopId}
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
