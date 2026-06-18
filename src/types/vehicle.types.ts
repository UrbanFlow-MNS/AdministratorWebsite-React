export interface Vehicle {
  id: string;
  agencyId: string;
  licensePlate?: string;
  capacity?: number;
  model?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface CreateVehiclePayload {
  agencyId: string;
  licensePlate?: string;
  capacity?: number;
  model?: string;
}

export interface UpdateVehiclePayload extends Partial<CreateVehiclePayload> {
  status?: 'active' | 'inactive' | 'maintenance';
}
