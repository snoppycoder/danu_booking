export interface AddOperatorForm {
  name: string;
  slug: string;
  contact_phone: string;
  contact_email: string;
  extra_metadata: Record<string, string>;
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
export interface User {
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
}
export interface SeatExtraMetadata {
  type: "window" | "asile"; // or string if other types are possible
}

export interface Seat {
  id: string;
  seat_code: string;
  status: "available" | "booked" | "held";
  row: number;
  col: number;
  extra_metadata: SeatExtraMetadata;
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
  email: string;
  phone: string;
  id_number: string;
};
export interface Trip {
  trip_id: string;
  operator: {
    operator_id: string;
    operator_name: string;
  };
  departure_at: string;
  price: number;
  created_at: string;
  updated_at: string;
}
export type Item = Trip | Route;

export interface SearchRouteResponse {
  route_from: string;
  route_to: string;
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
