import type { Calendar, CreateCalendarPayload } from '../types/calendar.types';
import client from './client';

export const calendarApi = {
  getAll: () => client.get<Calendar[]>('/calendar/all').then((r) => r.data),
  create: (payload: CreateCalendarPayload) =>
    client.post<{ message: string }>('/calendar/create', payload).then((r) => r.data),
};
