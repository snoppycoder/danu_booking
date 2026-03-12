export interface Seller {
  seller_id: string;
  seller_name: string;
  seller_type: string;
  Total_Ticket_Sales: number;
  Gross_Revenue: number;
}

export interface Bus {
  bus_id: string;
  capacity: number;
  plate_no: string;
  side_no: string;
  Total_Ticket_Sales: number;
  Gross_Revenue: number;
  who_is_selling: Seller[];
}

export interface Operator {
  operator_name: string;
  operator_id: string;
  Total_Ticket_Sales: number;
  Gross_Revenue: number;
  Bus: Bus[];
}

export interface OperatorReportResponse {
  items: Operator[];
  total: number;
  page: number;
  per_page: number;
}

export interface ReportFilters {
  operator_id: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
}

export interface ReportSummary {
  totalOperators: number;
  totalBuses: number;
  totalSellers: number;
  totalTicketsSold: number;
  totalGrossRevenue: number;
  averageRevenuePerBus: number;
  averageTicketsPerBus: number;
}
