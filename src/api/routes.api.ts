import type { CompleteRoute, CreateRoutePayload, Route, RouteFilters, UpdateRoutePayload } from '../types/route.types';
import client from './client';

export const routesApi = {
  getAll: () => client.get<Route[]>('/routes/all').then((r) => r.data),
  getAllComplete: () =>
    client.get<CompleteRoute[]>('/routes/getAllCompleteRoutes').then((r) => r.data),
  getDetails: (id: number) =>
    client.get<CompleteRoute[]>(`/routes/getDetails/${id}`).then((r) => r.data),
  filter: (filters: RouteFilters) =>
    client.get<CompleteRoute[]>('/routes', { params: filters }).then((r) => r.data),
  create: (payload: CreateRoutePayload) =>
    client.post<{ message: string }>('/routes/create', payload).then((r) => r.data),
  update: (id: number, payload: UpdateRoutePayload) =>
    client.put<{ message: string }>(`/routes/update/${id}`, payload).then((r) => r.data),
  delete: (id: number) =>
    client.delete<{ message: string }>(`/routes/delete/${id}`).then((r) => r.data),
};
