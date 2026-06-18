import type { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from '../types/vehicle.types';
import client from './client';

export const vehiclesApi = {
  getByAgency: (agencyId: string) =>
    client.get<Vehicle[]>(`/vehicles/vehicles/${agencyId}`).then((r) => r.data),
  getStatus: () =>
    client.get<Vehicle[]>('/vehicles/status').then((r) => r.data),
  create: (payload: CreateVehiclePayload) =>
    client.post<Vehicle>('/vehicles', payload).then((r) => r.data),
  update: (id: string, payload: UpdateVehiclePayload) =>
    client.put<Vehicle>(`/vehicles/${id}`, payload).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    client.patch(`/vehicles/status/${id}`, { status }).then((r) => r.data),
  delete: (id: string) =>
    client.delete(`/vehicles/${id}`).then((r) => r.data),
};
