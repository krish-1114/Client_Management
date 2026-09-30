export type Status = 'Active' | 'Inactive';

export interface Client {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: Status;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientInput = Omit<Client, '_id' | 'createdAt' | 'updatedAt'>;

export type ActivityType = 'created' | 'updated' | 'note_added';

export interface Activity {
  _id: string;
  client: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}

export interface DashboardActivity extends Omit<Activity, 'client'> {
  client: { _id: string; name: string } | null;
}

export interface Paged<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  recentClients: Client[];
  recentActivities: DashboardActivity[];
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  created: 'Client created',
  updated: 'Information updated',
  note_added: 'Note added',
};
