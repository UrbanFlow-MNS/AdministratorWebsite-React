import { observer } from 'mobx-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiRouteLine } from 'react-icons/ri';
import { routesStore } from '../../stores/routes.store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Header } from '../../components/layout/Header';

interface FormState {
  shortName: string;
  longName: string;
  agencyId: string;
  routeTypeId: string;
}

interface FormErrors {
  shortName?: string;
  longName?: string;
  agencyId?: string;
  routeTypeId?: string;
}

const defaultForm: FormState = { shortName: '', longName: '', agencyId: '', routeTypeId: '' };

export const CreateRouteContainer = observer(() => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.shortName.trim()) next.shortName = 'Le code court est obligatoire.';
    if (!form.longName.trim()) next.longName = 'Le nom complet est obligatoire.';
    if (!form.agencyId.trim() || isNaN(parseInt(form.agencyId))) next.agencyId = "L'identifiant d'agence est obligatoire.";
    if (!form.routeTypeId.trim() || isNaN(parseInt(form.routeTypeId))) next.routeTypeId = "Le type de ligne est obligatoire.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await routesStore.create({
        agencyId: parseInt(form.agencyId, 10),
        routeShortName: form.shortName.trim(),
        routeLongName: form.longName.trim(),
        routeTypeId: parseInt(form.routeTypeId, 10),
      });
      navigate('/routes');
    } catch {
      setErrors({ shortName: 'Erreur lors de la création.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Nouvelle ligne"
        subtitle="Définissez les informations de la ligne de transport"
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate('/routes')}>
            <RiArrowLeftLine /> Retour
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6">
        <div className="max-w-[560px]">
          <div className="card">
            <div className="card-header">Informations de la ligne</div>
            <div className="card-body flex flex-col gap-[18px]">

              {/* Preview badge */}
              {(form.shortName || form.longName) && (
                <div className="flex items-center gap-3 px-4 py-3 bg-[#F7F7FA] rounded-[10px] border border-border">
                  <span className="inline-flex items-center justify-center min-w-[36px] px-2.5 h-8 rounded-lg text-sm font-bold shrink-0 bg-primary text-white">
                    {form.shortName || '—'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {form.longName || 'Nom de la ligne'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">Aperçu du badge</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-[1fr_2fr] gap-3.5">
                <Input
                  label="Code court"
                  placeholder="ex. L1"
                  value={form.shortName}
                  onChange={handleChange('shortName')}
                  error={errors.shortName}
                />
                <Input
                  label="Nom complet"
                  placeholder="ex. Ligne 1 – Centre-Ville ↔ Gare"
                  value={form.longName}
                  onChange={handleChange('longName')}
                  error={errors.longName}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <Input
                  label="Identifiant agence"
                  placeholder="ex. 1"
                  type="number"
                  value={form.agencyId}
                  onChange={handleChange('agencyId')}
                  error={errors.agencyId}
                />
                <Input
                  label="Type de ligne (ID)"
                  placeholder="ex. 3"
                  type="number"
                  value={form.routeTypeId}
                  onChange={handleChange('routeTypeId')}
                  error={errors.routeTypeId}
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/routes')}>
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" loading={submitting} onClick={handleSubmit as never}>
                  <RiRouteLine /> Créer la ligne
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
