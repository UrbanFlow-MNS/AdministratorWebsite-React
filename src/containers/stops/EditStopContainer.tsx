import { observer } from 'mobx-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import { stopsStore } from '../../stores/stops.store';
import { StopsMap } from '../../components/map/StopsMap';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Header } from '../../components/layout/Header';

interface FormErrors {
  name?: string;
  latitude?: string;
  longitude?: string;
}

export const EditStopContainer = observer(() => {
  const { id } = useParams<{ id: string }>();
  const stopId = id ? Number(id) : NaN;
  const navigate = useNavigate();

  const stop = stopsStore.stops.find((s) => s.stopId === stopId);

  const [name, setName] = useState(stop?.stopName ?? '');
  const [latitude, setLatitude] = useState(stop?.stopLat?.toString() ?? '');
  const [longitude, setLongitude] = useState(stop?.stopLong?.toString() ?? '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!stop && !stopsStore.loading) {
      stopsStore.fetchAll();
    }
  }, [stop]);

  useEffect(() => {
    if (stop) {
      setName(stop.stopName);
      setLatitude(stop.stopLat.toString());
      setLongitude(stop.stopLong.toString());
    }
  }, [stop]);

  const pendingPin =
    latitude && longitude
      ? { lat: parseFloat(latitude), lng: parseFloat(longitude) }
      : null;

  const handleMapClick = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setErrors((e) => ({ ...e, latitude: undefined, longitude: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Le nom est obligatoire.';
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!latitude || isNaN(lat) || lat < -90 || lat > 90)
      next.latitude = 'Latitude invalide.';
    if (!longitude || isNaN(lng) || lng < -180 || lng > 180)
      next.longitude = 'Longitude invalide.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || isNaN(stopId)) return;
    setSubmitting(true);
    try {
      await stopsStore.update(stopId, {
        stopName: name.trim(),
        stopLat: parseFloat(latitude),
        stopLong: parseFloat(longitude),
      });
      navigate('/stops');
    } catch {
      setErrors({ name: 'Erreur lors de la mise à jour.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!stop && stopsStore.loading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted">
        Chargement…
      </div>
    );
  }

  if (!stop) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm text-muted">Arrêt introuvable.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/stops')}>
          Retour aux arrêts
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title={`Modifier — ${stop.stopName}`}
        subtitle="Déplacez le marqueur ou modifiez les coordonnées"
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate('/stops')}>
            <RiArrowLeftLine />
            Retour
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden p-4 md:p-5 gap-4">
        <div className="relative h-[300px] md:h-auto flex-none md:flex-1">
          <div className="map-wrapper h-full">
            <StopsMap
              stops={stopsStore.stops.filter((s) => s.stopId !== stopId)}
              pendingPin={pendingPin}
              onMapClick={handleMapClick}
              center={[stop.stopLat, stop.stopLong]}
              zoom={15}
              className="h-full"
            />
          </div>
        </div>

        <div className="w-full md:w-[360px] md:flex-shrink-0 md:overflow-y-auto">
          <Card className="h-fit">
            <CardHeader>
              <h2 className="text-base font-semibold text-ink">Modifier l'arrêt</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nom de l'arrêt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    error={errors.latitude}
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    error={errors.longitude}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/stops')}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1" loading={submitting}>
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
});
