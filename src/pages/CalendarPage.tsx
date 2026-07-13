import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiAddLine, RiCalendarLine } from 'react-icons/ri';
import { calendarApi } from '../api/calendar.api';
import type { Calendar } from '../types/calendar.types';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';

const DAY_LABELS: Record<string, string> = {
  monday: 'L', tuesday: 'Ma', wednesday: 'Me', thursday: 'J', friday: 'V', saturday: 'S', sunday: 'D',
};

function DayChip({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center w-[22px] h-[22px] rounded-md text-[0.6875rem] font-bold',
        active ? 'bg-primary-light text-primary' : 'bg-canvas text-faint',
      ].join(' ')}
    >
      {label}
    </span>
  );
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calendarApi.getAll()
      .then(setCalendars)
      .catch(() => setCalendars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Calendriers"
        subtitle="Périodes de service et jours d'exploitation"
        actions={<Button size="sm" onClick={() => navigate('/calendar/create')}><RiAddLine /> Nouveau</Button>}
      />
      <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6">
        <div className="bg-surface border border-border rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border text-sm font-semibold text-ink">Tous les calendriers ({calendars.length})</div>
          {loading ? (
            <div className="text-center text-muted p-12">Chargement…</div>
          ) : calendars.length === 0 ? (
            <div className="text-center text-muted p-12">
              <RiCalendarLine className="text-[2rem] mb-2 opacity-40 mx-auto" />
              <p>Aucun calendrier enregistré.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm [&_th]:bg-[#F7F7FA] [&_th]:px-5 [&_th]:py-2.5 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-muted [&_th]:border-b [&_th]:border-border [&_td]:px-5 [&_td]:py-3 [&_td]:align-middle [&_td]:border-b [&_td]:border-[#F0F0F5] [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-[#FAFAFD]">
                <thead>
                  <tr>
                    <th className="text-left">Service</th>
                    <th className="text-left">Jours</th>
                    <th className="text-left">Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {calendars.map((c) => (
                    <tr key={c.serviceId}>
                      <td className="font-semibold">#{c.serviceId}</td>
                      <td>
                        <div className="flex gap-[3px]">
                          {Object.entries(DAY_LABELS).map(([key, label]) => (
                            <DayChip key={key} active={c[key as keyof Calendar] as boolean} label={label} />
                          ))}
                        </div>
                      </td>
                      <td className="text-muted text-[0.8125rem]">
                        {new Date(c.endDate).toLocaleDateString('fr-FR')}
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
