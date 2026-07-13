import type { CreateStopPayload, Stop, UpdateStopPayload } from '../types/stop.types';
import client from './client';

export const stopsApi = {
  getAll: () => client.get<Stop[]>('/stops/all').then((r) => r.data),
  create: (payload: CreateStopPayload) =>
    client.post<{ message: string }>('/stops/create', payload).then((r) => r.data),
  update: (id: number, payload: UpdateStopPayload) =>
    client.put<{ message: string }>(`/stops/update/${id}`, payload).then((r) => r.data),
  delete: (id: number) =>
    client.delete<{ message: string }>(`/stops/delete/${id}`).then((r) => r.data),
};
