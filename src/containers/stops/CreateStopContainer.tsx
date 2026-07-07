import { observer } from 'mobx-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiMapPin2Line, RiCursorLine, RiKeyboardLine } from 'react-icons/ri';
import { stopsStore } from '../../stores/stops.store';
import { StopsMap } from '../../components/map/StopsMap';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Header } from '../../components/layout/Header';

interface FormState { name: string; latitude: string; longitude: string; agencyId: string; }
interface FormErrors { name?: string; latitude?: string; longitude?: string; agencyId?: string; }

const defaultForm: FormState = { name: '', latitude: '', longitude: '', agencyId: '' };

export const CreateStopContainer = observer(() => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [inputMode, setInputMode] = useState<'map' | 'manual'>('map');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pendingPin = form.latitude && form.longitude
    ? { lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }
    : null;

  const handleMapClick = (lat: number, lng: number) => {
    setForm((f) => ({ ...f, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    setErrors((e) => ({ ...e, latitude: undefined, longitude: undefined }));
  };

  const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Le nom est obligatoire.';
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (!form.latitude || isNaN(lat) || lat < -90 || lat > 90) next.latitude = 'Latitude invalide (−90 à 90).';
    if (!form.longitude || isNaN(lng) || lng < -180 || lng > 180) next.longitude = 'Longitude invalide.';
    if (!form.agencyId.trim() || isNaN(parseInt(form.agencyId))) next.agencyId = "L'identifiant d'agence est obligatoire.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await stopsStore.create({
        stopName: form.name.trim(),
        stopLat: parseFloat(form.latitude),
        stopLong: parseFloat(form.longitude),
        agencyId: parseInt(form.agencyId, 10),
      });
      setSuccessMessage(`Arrêt "${form.name.trim()}" créé avec succès.`);
      setForm(defaultForm);
    } catch {
      setErrors({ name: 'Erreur lors de la création. Veuillez réessayer.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Nouvel arrêt"
        subtitle="Cliquez sur la carte ou saisissez les coordonnées manuellement"
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate('/stops')}>
            <RiArrowLeftLine /> Retour
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden p-4 md:p-5 gap-4">
        <div className="relative h-[300px] md:h-auto flex-none md:flex-1">
          <div className="map-wrapper h-full">
            <StopsMap
              stops={stopsStore.stops}
              pendingPin={pendingPin}
              onMapClick={handleMapClick}
              className="h-full w-full"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 border border-border rounded-full px-4 py-[7px] text-[0.8125rem] text-muted flex items-center gap-1.5 pointer-events-none shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-[500]">
              <RiCursorLine className="text-primary shrink-0" />
              Cliquez sur la carte pour placer l'arrêt
            </div>
            {pendingPin && (
              <div className="absolute top-3 left-3 bg-primary text-white rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(105,18,226,0.35)] z-[500]">
                <RiMapPin2Line />
                {pendingPin.lat.toFixed(5)}, {pendingPin.lng.toFixed(5)}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[360px] md:flex-shrink-0 md:overflow-y-auto">
          <div className="card h-fit">
            <div className="card-header">Informations de l'arrêt</div>
            <div className="card-body flex flex-col gap-4">

              {successMessage && (
                <div className="bg-success/10 border border-success/40 rounded-lg px-3.5 py-2.5 text-sm font-medium text-success-ink">
                  {successMessage}
                </div>
              )}

              <Input
                label="Nom de l'arrêt"
                placeholder="ex. Hôtel de Ville"
                value={form.name}
                onChange={handleChange('name')}
                error={errors.name}
                autoFocus
              />

              <Input
                label="Identifiant agence"
                placeholder="ex. 1"
                type="number"
                value={form.agencyId}
                onChange={handleChange('agencyId')}
                error={errors.agencyId}
              />

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[0.8125rem] font-medium text-ink">Coordonnées GPS</span>
                  <div className="flex border-[1.5px] border-border rounded-lg overflow-hidden">
                    {(['map', 'manual'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setInputMode(mode)}
                        className={[
                          'flex items-center gap-1 px-2.5 py-[5px] text-xs font-medium cursor-pointer transition-colors',
                          inputMode === mode ? 'bg-primary text-white' : 'bg-transparent text-muted',
                        ].join(' ')}
                      >
                        {mode === 'map' ? <><RiCursorLine /> Carte</> : <><RiKeyboardLine /> Manuel</>}
                      </button>
                    ))}
                  </div>
                </div>

                {inputMode === 'map' ? (
                  <div className="border-[1.5px] border-dashed border-border-strong rounded-lg bg-[#F7F7FA] px-4 py-3 text-center">
                    {pendingPin ? (
                      <div>
                        <p className="text-xs font-semibold text-primary">Position sélectionnée</p>
                        <p className="text-xs text-muted mt-1 font-mono">
                          {pendingPin.lat.toFixed(6)}, {pendingPin.lng.toFixed(6)}
                        </p>
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, latitude: '', longitude: '' }))}
                          className="mt-1.5 text-xs text-error bg-transparent border-none cursor-pointer"
                        >
                          Réinitialiser
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-faint">Aucune position sélectionnée</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Input label="Latitude" placeholder="48.856600" type="number" step="any"
                      value={form.latitude} onChange={handleChange('latitude')} error={errors.latitude} />
                    <Input label="Longitude" placeholder="2.352200" type="number" step="any"
                      value={form.longitude} onChange={handleChange('longitude')} error={errors.longitude} />
                  </div>
                )}

                {inputMode === 'map' && (errors.latitude || errors.longitude) && (
                  <p className="field-error">Veuillez sélectionner un point sur la carte.</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/stops')}>
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" loading={submitting} onClick={handleSubmit as never}>
                  Créer l'arrêt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
