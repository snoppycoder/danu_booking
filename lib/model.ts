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
export interface User {
  sub: string;
  roles: string[];
  portal: string;
  first_name: string;
  last_name: string;
  id: string;
  phone?: string;
  phone_verified: boolean;
  email: string;
  email_verified: boolean;
  is_disabled: boolean;
  is_active: boolean;
}
