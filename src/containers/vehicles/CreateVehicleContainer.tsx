import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiBusLine } from 'react-icons/ri';
import { vehiclesApi } from '../../api/vehicles.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Header } from '../../components/layout/Header';

interface FormState {
  agencyId: string;
  licensePlate: string;
  model: string;
  capacity: string;
}

interface FormErrors {
  agencyId?: string;
  licensePlate?: string;
}

const defaultForm: FormState = { agencyId: '', licensePlate: '', model: '', capacity: '' };

export function CreateVehicleContainer() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) setErrors((e) => ({ ...e, [field]: undefined }));
    };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.agencyId.trim()) next.agencyId = "L'identifiant de l'agence est obligatoire.";
    if (!form.licensePlate.trim()) next.licensePlate = "L'immatriculation est obligatoire.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const v = await vehiclesApi.create({
        agencyId: form.agencyId.trim(),
        licensePlate: form.licensePlate.trim(),
        model: form.model.trim() || undefined,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
      });
      setSuccess(`Véhicule "${v.licensePlate}" créé avec succès.`);
      setForm(defaultForm);
    } catch {
      setErrors({ agencyId: 'Erreur lors de la création.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Nouveau véhicule"
        subtitle="Enregistrez un véhicule dans le parc"
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate('/vehicles')}>
            <RiArrowLeftLine /> Retour
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6">
        <div className="max-w-[520px]">
          <div className="card">
            <div className="card-header">Informations du véhicule</div>
            <div className="card-body flex flex-col gap-4">

              {success && (
                <div className="bg-success/10 border border-success/40 rounded-lg px-3.5 py-2.5 text-sm font-medium text-success-ink">
                  {success}
                </div>
              )}

              <Input label="Identifiant agence" placeholder="ex. AGC-001" value={form.agencyId} onChange={handleChange('agencyId')} error={errors.agencyId} />

              <Input label="Immatriculation" placeholder="ex. AA-123-BB" value={form.licensePlate} onChange={handleChange('licensePlate')} error={errors.licensePlate} />

              <div className="grid grid-cols-2 gap-3.5">
                <Input label="Modèle (optionnel)" placeholder="ex. Mercedes Citaro" value={form.model} onChange={handleChange('model')} />
                <Input label="Capacité (optionnel)" placeholder="ex. 80" type="number" min="1" value={form.capacity} onChange={handleChange('capacity')} />
              </div>

              {(form.licensePlate || form.model) && (
                <div className="flex items-center gap-3 px-4 py-3 bg-[#F7F7FA] rounded-[10px] border border-border">
                  <div className="w-10 h-10 rounded-[10px] bg-[#EBF5FF] flex items-center justify-center shrink-0">
                    <RiBusLine className="text-info text-[1.25rem]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{form.licensePlate || '—'}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {[form.model, form.capacity ? `${form.capacity} places` : ''].filter(Boolean).join(' · ') || 'Véhicule'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/vehicles')}>Annuler</Button>
                <Button type="submit" className="flex-1" loading={submitting} onClick={handleSubmit as never}>
                  <RiBusLine /> Ajouter le véhicule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
