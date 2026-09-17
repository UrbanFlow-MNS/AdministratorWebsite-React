import type {
  CreateTripPayload,
  UpdateHourlyPayload,
  UpdateServicePayload,
} from '../types/trip.types';
import client from './client';

export const tripsApi = {
  create: (payload: CreateTripPayload) =>
    client.post<{ message: string }>('/trip/create', payload).then((r) => r.data),
  updateHourly: (stopId: number, tripId: number, payload: UpdateHourlyPayload) =>
    client
      .put<{ message: string }>(`/trip/updateHourly/${stopId}/${tripId}`, payload)
      .then((r) => r.data),
  updateService: (tripId: number, payload: UpdateServicePayload) =>
    client.put<{ message: string }>(`/trip/updateService/${tripId}`, payload).then((r) => r.data),
  deleteStopFromTrip: (stopId: number, tripId: number) =>
    client.delete<{ message: string }>(`/trip/delete/${stopId}/${tripId}`).then((r) => r.data),
  delete: (tripId: number) =>
    client.delete<{ message: string }>(`/trip/delete/${tripId}`).then((r) => r.data),
};
