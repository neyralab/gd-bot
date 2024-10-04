export interface Friend {
  id: number;
  logo: string | null;
  points: number;
  second: number;
  telegram_id: number;
  username: string;
}

export interface LeadboardPerson {
  displayed_name: string;
  id: number;
  points: number;
  telegram_id: number;
  username: string;
}
