// ============================================================
// Contact
// ============================================================

export interface Contact {
  type: string;        // phone | tg | etc
  value: string;
}

// ============================================================
// TripStop (Read)
// ============================================================

export interface TripStopRead {
  id: number;
  trip_id: number;

  city_name: string;
  arrival_time: string;   // ISO datetime string
  stop_order: number;
}

// ============================================================
// TripRead
// ============================================================

export interface TripRead {
  id: number;
  created_at: string;     // ISO datetime string

  contacts: Contact[];

  car?: string | null;

  platform_name: string;
  driver_id: number;

  departure_time: string

  has_cargo: boolean;
  has_child_seat: boolean;
  is_taxi: boolean;
  message_link?: string;

  raw_text?: string | null;

  stops: TripStopRead[];
}
