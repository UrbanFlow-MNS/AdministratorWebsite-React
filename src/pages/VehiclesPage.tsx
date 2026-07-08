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
        <div className="card overflow-hidden p-0">
          <div className="card-header">Tous les véhicules ({vehicles.length})</div>
          {loading ? (
            <div className="card-body text-center text-muted p-12">Chargement…</div>
          ) : vehicles.length === 0 ? (
            <div className="card-body text-center text-muted p-12">
              <RiBusLine className="text-[2rem] mb-2 opacity-40 mx-auto" />
              <p>Aucun véhicule enregistré.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table w-full border-collapse">
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
                        <span className="badge bg-[#EBF5FF] text-info">
                          {v.status || 'actif'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v.id)} title="Supprimer">
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
