export type Plan = 'MONTHLY' | 'ANNUAL';

export type MembresiaStatus = 'PENDING' | 'ACTIVE' | 'CANCELED' | 'EXPIRED';

export interface Membresia {
  id: number;
  plan: Plan;
  status: MembresiaStatus;
  autoRenew: boolean;
  startsAt: string; // ISO date (Instant)
  endsAt: string;   // ISO date (Instant)
}
