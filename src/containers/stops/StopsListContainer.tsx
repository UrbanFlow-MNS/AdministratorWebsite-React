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
            className="h-[38px] w-full pl-[34px] pr-3 bg-surface border-[1.5px] border-border rounded-[10px] text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-faint focus:border-primary focus:shadow-[0_0_0_3px_rgba(105,18,226,0.12)]"
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
          <div className="bg-surface border border-border rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm [&_th]:bg-[#F7F7FA] [&_th]:px-5 [&_th]:py-2.5 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-muted [&_th]:border-b [&_th]:border-border [&_td]:px-5 [&_td]:py-3 [&_td]:align-middle [&_td]:border-b [&_td]:border-[#F0F0F5] [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-[#FAFAFD]">
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBEBF0] text-muted">#{stop.agencyId}</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-[0.8125rem] font-medium rounded-[10px] cursor-pointer whitespace-nowrap border-none outline-none transition-[background-color,box-shadow,opacity] duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-muted enabled:hover:bg-primary-light enabled:hover:text-primary"
                            onClick={() => navigate(`/stops/${stop.stopId}/edit`)}
                            title="Modifier"
                          >
                            <RiPencilLine />
                          </button>
                          <button
                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-[0.8125rem] font-medium rounded-[10px] cursor-pointer whitespace-nowrap border-none outline-none transition-[background-color,box-shadow,opacity] duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-muted enabled:hover:bg-error/10 enabled:hover:text-error"
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
