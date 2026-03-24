import { searchResult } from "@/components/Query";

export interface AddOperatorForm {
  name: string;
  slug: string;
  contact_phone: string;
  contact_email: string;
  extra_metadata: Record<string, string>;
}

export interface History {
  booking_id: string;
  booking_ref: string;
  booked_at: string;
  booking_status: string;
  trip_id: string;
  route_from: string;
  route_to: string;
  departure_at: string;
  operator_id: string;
  operator_name: string;
  total_amount: 0;
  passenger_count: 0;
}
export interface Session {
  id: string;
  created_at?: string;
  user_agent: string;
  organization_id?: string;
  deviceType: "desktop" | "mobile" | "tablet";
  location: string;
  ip_address: string;
  last_seen_at: string;
  isCurrent: boolean;
}

export interface AddUserForm {
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  email: string;
}
export interface Agent {
  id?: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
  // type: string;
}

export interface Operator {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  slug: string;
  created_at: string;
  updated_at: string;
  // type: string;
}
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  refresh_expires_at: string;
  session_id: string;
  access_expires_at: string;
  csrf_token: string;
  user_info: User;
}
interface Address {
  country: string;
  region: string;
  city: string;
  sub_city: string;
  woreda: string;
  kebele: string;
  house_number: string;
}
export interface Role {
  name: string;
  slug: string;
}
export interface getLotteryListDTO {
  ticket_id: string;
  booking_id: string;
  booking_ref: string;
  lottery_number: string;
  passenger_name: string;
  trip_id: string;
  route_from: string;
  route_to: string;
  departure_at: string; // ISO string
  created_at: string; // ISO string
  status: string;
}

export type CreateTripPayload = {
  operator_id?: string;

  bus_id: string;
  driver_id: string;
  route_from: string;
  route_to: string;
  departure_at: string;
  price: number;
};

export interface OperatorAgent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  roles: {
    additionalProp1: {};
  };
  organization_id: string;
  verification: {
    additionalProp1: {};
  };
}
export interface RefundDetail {
  id: string;

  booking: {
    id: string;
    booking_ref: string;
    total_amount: number;
    passenger_count: number;

    passengers: {
      name: string;
      seat_code: string;
      fare: number;
    }[];
  };

  operator_id: string;
  agent_id: string;
  booked_by_id: string;
  booked_by_name: string;

  processed_amount: number;
  processed_by_id: string;
  processed_by_name: string;
  processed_at: string;

  method: string;
  notes: string;
  status: string;
  external_ref: string;

  created_at: string;
  updated_at: string;
}
export interface Refund {
  id: string;
  booking_id: string;
  booking_ref: string;
  passenger_name: string;
  total_amount: number;
  processed_amount: number;
  status: "pending" | "completed" | "failed" | "processing";
  method: string;
  created_at: string;
  processed_at: string;
  notes?: string;
}

export interface User {
  sub: string;
  roles: Role[];
  portal: string;
  first_name: string;
  last_name: string;
  id: string;
  phone?: string;
  organization_id?: string;
  phone_verified: boolean;
  email: string;
  email_verified: boolean;
  is_disabled: boolean;
  is_active: boolean;
  display_name: string;
  dob: string;
  gender: string;
  avatar_file_id: string;
  bio: string;
  address: Address;
  last_login_at?: string;
}
export interface SeatExtraMetadata {
  type: "window" | "asile"; // or string if other types are possible
}
export interface UseAuthUser {
  sub: string;
  roles: string[];
  portal: string;
  first_name: string;
  last_name: string;
  id: string;
  phone?: string;
  organization_id?: string;
  phone_verified: boolean;
  email: string;
  email_verified: boolean;
  is_disabled: boolean;
  is_active: boolean;
  display_name: string;
  dob: string;
  gender: string;
  avatar_file_id: string;
  bio: string;
  address: Address;
  last_login_at?: string;
}

export interface Seat {
  id: string;
  seat_code: string;
  status: "available" | "booked" | "held";
  row: number;
  col: number;
  fare?: number;
  extra_metadata?: SeatExtraMetadata;
}

export interface SeatTemplate {
  id: string;
  name: string;
  seats: Seat[];
  created_at: string; // ISO date string
}

export interface Bus {
  id: string;
  seat_template: SeatTemplate;
  operator_id: string;
  bus_status: string;
  plate_no: string;
  side_no: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}
export interface Driver {
  id: string;
  operator_id: string;
  first_name: string;
  last_name: string;
  license_no: string;
  created_at: string;
  updated_at: string;
}
export interface Route {
  route_id: string;
  operator: {
    operator_id: string;
    operator_name: string;
  };
  bus: Bus;
  driver: Driver;
  departure_at: string;
  price: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
}
export interface TripData {
  id: string;
  operator: Operator;
  bus: Bus;
  driver: Driver;
  route_from: string;
  route_to: string;
  available_seats: number;
  departure_at: string;
  price: number;
  created_at: string;
  updated_at: string;
}
export interface PopularRoute {
  route_from: string;
  route_to: string;
  trip_count: number;
}

export interface PopularRoutesResponse {
  routes: PopularRoute[];
  total: number;
}
export type Passenger = {
  name: string;
  email: string | null;
  phone: string;
  id_number: string | null;
};
export interface RouteDTO {
  id: string;
  route_from: string;
  route_to: string;
  distance_km: number;
  estimated_duration_minutes: number;
}

export interface Trip {
  id?: string;
  trip_id: string;
  available_seats: number;
  route_from?: string;
  route_to?: string;
  operator: {
    operator_id: string;
    operator_name: string;
  };
  driver?: {
    name: string;
  };
  operator_id?: string;
  bus_id?: string;
  driver_id?: string;
  departure_at: string;
  price: number;
  created_at: string;
  updated_at: string;
}
export type Item = Trip | Route | searchResult;

export interface SearchRouteResponse {
  route_from: string;
  route_to: string;
  available_seats: number;
  // items: Item[
  //   {
  //     route_id: string;
  //     operator: Operator;
  //     bus: Bus;
  //     driver: Driver;
  //     departure_at: string;
  //     price: 0;
  //     created_at: string;
  //     updated_at: string;
  //   },
  //   {
  //     trip_id: string;
  //     operator: {
  //       operator_id: string;
  //       operator_name: string;
  //     };
  //     departure_at: string;
  //     price: number;
  //     created_at: string;
  //     updated_at: string;
  //   }
  // ];
  total: number;
  page: number;
  items: Item[];
  per_page: number;
}

export interface KYCDocument {
  id: string;
  owner_type?: "operator" | "agent";
  owner_id?: string;
  operator_id?: string;
  operator_name?: string;
  agent_id?: string;
  agent_name?: string;
  document_type: string;
  document_name: string;
  file: File | null;
  document_url?: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  reviewed_at?: string;
  uploaded_by?: string;
}

export interface KYCUpload {
  document_name: string;
  document_type: string;
  file: File;
}
