export interface AddOperatorForm {
  name: string;
  slug: string;
  contact_phone: string;
  contact_email: string;
  extra_metadata: Record<string, string>;
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
