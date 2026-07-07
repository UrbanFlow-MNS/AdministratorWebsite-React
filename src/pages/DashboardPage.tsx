import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMapPin2Line, RiRouteLine, RiTimeLine, RiArrowRightLine, RiAddLine } from 'react-icons/ri';
import { stopsStore } from '../stores/stops.store';
import { routesStore } from '../stores/routes.store';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';

function StatCard({ label, value, icon: Icon, bg, to }: { label: string; value: number | string; icon: React.ElementType; bg: string; to: string }) {
  const navigate = useNavigate();
  return (
    <div className="stat-card" onClick={() => navigate(to)}>
      <div className="stat-icon" style={{ background: bg }}><Icon /></div>
      <div className="flex-1 min-w-0">
        <p className="text-[2rem] font-bold text-ink leading-none">{value}</p>
        <p className="text-[0.8125rem] text-muted mt-1">{label}</p>
      </div>
      <RiArrowRightLine className="text-faint shrink-0 text-[1.1rem]" />
    </div>
  );
}

export const DashboardPage = observer(() => {
  const navigate = useNavigate();
  useEffect(() => { stopsStore.fetchAll(); routesStore.fetchAll(); }, []);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Tableau de bord"
        subtitle="Vue d'ensemble du réseau de transport"
        actions={<Button size="sm" onClick={() => navigate('/stops/create')}><RiAddLine /> Nouvel arrêt</Button>}
      />

      <div className="p-4 md:px-8 md:py-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Arrêts enregistrés" value={stopsStore.loading ? '…' : stopsStore.stops.length} icon={RiMapPin2Line} bg="#6912E2" to="/stops" />
          <StatCard label="Lignes actives" value={routesStore.loading ? '…' : routesStore.routes.length} icon={RiRouteLine} bg="#007AFF" to="/routes" />
          <StatCard label="Voyages planifiés" value="—" icon={RiTimeLine} bg="#34C759" to="/trips" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-md bg-primary-light flex items-center justify-center">
                  <RiMapPin2Line className="text-primary text-[0.8rem]" />
                </div>
                <span className="text-sm font-semibold text-ink">Derniers arrêts</span>
              </div>
              <button onClick={() => navigate('/stops')} className="flex items-center gap-1 text-xs font-medium text-primary cursor-pointer">
                Voir tout <RiArrowRightLine />
              </button>
            </div>
            {stopsStore.stops.length === 0 && !stopsStore.loading ? (
              <div className="px-5 py-7 text-center">
                <p className="text-sm text-faint">Aucun arrêt enregistré</p>
                <button onClick={() => navigate('/stops/create')} className="mt-2 text-[0.8125rem] font-medium text-primary cursor-pointer">
                  Créer le premier arrêt
                </button>
              </div>
            ) : stopsStore.stops.slice(-5).reverse().map((stop) => (
              <div key={stop.stopId} className="flex items-center gap-3 px-5 py-2.5 border-b border-[#F5F5F8]">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                  <RiMapPin2Line className="text-primary text-[0.875rem]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink overflow-hidden text-ellipsis whitespace-nowrap">{stop.stopName}</p>
                  <p className="text-xs text-faint font-mono mt-0.5">{stop.stopLat.toFixed(4)}, {stop.stopLong.toFixed(4)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-md bg-[#EBF5FF] flex items-center justify-center">
                  <RiRouteLine className="text-info text-[0.8rem]" />
                </div>
                <span className="text-sm font-semibold text-ink">Lignes actives</span>
              </div>
              <button onClick={() => navigate('/routes')} className="flex items-center gap-1 text-xs font-medium text-info cursor-pointer">
                Voir tout <RiArrowRightLine />
              </button>
            </div>
            {routesStore.routes.length === 0 && !routesStore.loading ? (
              <div className="px-5 py-7 text-center">
                <p className="text-sm text-faint">Aucune ligne enregistrée</p>
                <button onClick={() => navigate('/routes/create')} className="mt-2 text-[0.8125rem] font-medium text-info cursor-pointer">
                  Créer la première ligne
                </button>
              </div>
            ) : routesStore.routes.slice(0, 5).map((route) => (
              <div key={route.routeId} className="flex items-center gap-3 px-5 py-2.5 border-b border-[#F5F5F8]">
                <span className="inline-flex items-center justify-center min-w-[32px] px-2 h-7 rounded-md text-xs font-bold shrink-0 bg-primary text-white">
                  {route.routeShortName}
                </span>
                <p className="text-sm text-ink overflow-hidden text-ellipsis whitespace-nowrap">{route.routeLongName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
