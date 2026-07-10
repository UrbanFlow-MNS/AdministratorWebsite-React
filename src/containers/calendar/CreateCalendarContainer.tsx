import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiCalendarLine } from 'react-icons/ri';
import { calendarApi } from '../../api/calendar.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Header } from '../../components/layout/Header';

const DAYS = [
  { key: 'monday',    label: 'Lun' },
  { key: 'tuesday',   label: 'Mar' },
  { key: 'wednesday', label: 'Mer' },
  { key: 'thursday',  label: 'Jeu' },
  { key: 'friday',    label: 'Ven' },
  { key: 'saturday',  label: 'Sam' },
  { key: 'sunday',    label: 'Dim' },
] as const;

type DayKey = typeof DAYS[number]['key'];

interface FormState {
  startDate: string;
  endDate: string;
  days: Record<DayKey, boolean>;
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
}

const defaultForm: FormState = {
  startDate: '',
  endDate: '',
  days: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
};

export function CreateCalendarContainer() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleDay = (day: DayKey) =>
    setForm((f) => ({ ...f, days: { ...f.days, [day]: !f.days[day] } }));

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.startDate) next.startDate = 'La date de début est obligatoire.';
    if (!form.endDate) next.endDate = 'La date de fin est obligatoire.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await calendarApi.create({
        startDate: form.startDate,
        endDate: form.endDate,
        ...form.days,
      });
      setSuccess('Calendrier créé avec succès.');
      setForm(defaultForm);
    } catch {
      setErrors({ startDate: 'Erreur lors de la création.' });
    } finally {
      setSubmitting(false);
    }
  };

  const activeDays = DAYS.filter((d) => form.days[d.key]).map((d) => d.label);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Nouveau calendrier"
        subtitle="Définissez les jours de service et la période de validité"
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
            <RiArrowLeftLine /> Retour
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6">
        <div className="max-w-[520px]">
          <div className="bg-surface border border-border rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="px-5 py-3.5 border-b border-border text-sm font-semibold text-ink">Informations du calendrier</div>
            <div className="p-5 flex flex-col gap-[18px]">

              {success && (
                <div className="bg-success/10 border border-success/40 rounded-lg px-3.5 py-2.5 text-sm font-medium text-success-ink">
                  {success}
                </div>
              )}

              <div className="flex flex-col gap-[5px]">
                <label className="text-[0.8125rem] font-medium text-ink">Jours de service</label>
                <div className="flex gap-1.5 mt-0.5">
                  {DAYS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleDay(key)}
                      className={[
                        'flex-1 h-9 rounded-lg border-[1.5px] text-[0.8125rem] font-semibold cursor-pointer transition-all',
                        form.days[key]
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-surface text-muted',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {activeDays.length > 0 && (
                  <p className="text-xs text-muted mt-1.5">
                    Service actif : {activeDays.join(', ')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <Input label="Date de début" type="date" value={form.startDate} onChange={(e) => { setForm((f) => ({ ...f, startDate: e.target.value })); if (errors.startDate) setErrors((e) => ({ ...e, startDate: undefined })); }} error={errors.startDate} />
                <Input label="Date de fin" type="date" value={form.endDate} onChange={(e) => { setForm((f) => ({ ...f, endDate: e.target.value })); if (errors.endDate) setErrors((e) => ({ ...e, endDate: undefined })); }} error={errors.endDate} />
              </div>

              {form.startDate && form.endDate && (
                <div className="flex items-center gap-3 px-4 py-3 bg-[#F7F7FA] rounded-[10px] border border-border">
                  <div className="w-10 h-10 rounded-[10px] bg-[#FFF3E0] flex items-center justify-center shrink-0">
                    <RiCalendarLine className="text-warning text-[1.25rem]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">
                      {new Date(form.startDate).toLocaleDateString('fr-FR')} → {new Date(form.endDate).toLocaleDateString('fr-FR')}
                      {activeDays.length > 0 && ` · ${activeDays.join(', ')}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/calendar')}>Annuler</Button>
                <Button type="submit" className="flex-1" loading={submitting} onClick={handleSubmit as never}>
                  <RiCalendarLine /> Créer le calendrier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
