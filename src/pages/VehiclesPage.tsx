import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiAddLine, RiBusLine, RiDeleteBinLine } from 'react-icons/ri';
import { vehiclesApi } from '../api/vehicles.api';
import type { Vehicle } from '../types/vehicle.types';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehiclesApi.getStatus()
      .then(setVehicles)
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce véhicule ?')) return;
    await vehiclesApi.delete(id);
    setVehicles((v) => v.filter((x) => x.id !== id));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Véhicules"
        subtitle="Parc de véhicules de la flotte"
        actions={<Button size="sm" onClick={() => navigate('/vehicles/create')}><RiAddLine /> Ajouter</Button>}
      />
      <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6">
        <div className="bg-surface border border-border rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border text-sm font-semibold text-ink">Tous les véhicules ({vehicles.length})</div>
          {loading ? (
            <div className="text-center text-muted p-12">Chargement…</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center text-muted p-12">
              <RiBusLine className="text-[2rem] mb-2 opacity-40 mx-auto" />
              <p>Aucun véhicule enregistré.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm [&_th]:bg-[#F7F7FA] [&_th]:px-5 [&_th]:py-2.5 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-muted [&_th]:border-b [&_th]:border-border [&_td]:px-5 [&_td]:py-3 [&_td]:align-middle [&_td]:border-b [&_td]:border-[#F0F0F5] [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-[#FAFAFD]">
                <thead>
                  <tr>
                    <th className="text-left">Immatriculation</th>
                    <th className="text-left">Modèle</th>
                    <th className="text-left">Capacité</th>
                    <th className="text-left">Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td className="font-semibold">{v.licensePlate}</td>
                      <td className="text-muted">{v.model || '—'}</td>
                      <td className="text-muted">{v.capacity ? `${v.capacity} places` : '—'}</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF5FF] text-info">
                          {v.status || 'actif'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-[0.8125rem] font-medium rounded-[10px] cursor-pointer whitespace-nowrap border-none outline-none transition-[background-color,box-shadow,opacity] duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-muted enabled:hover:bg-canvas enabled:hover:text-ink" onClick={() => handleDelete(v.id)} title="Supprimer">
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
