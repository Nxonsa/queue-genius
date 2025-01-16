export interface Customer {
  id: string;
  name: string;
  phone: string;
  position: number;
  waitTime: number;
  marketingConsent: boolean;
  queueId: string;
  positionsPassed: number;
  serviceId?: string;
}