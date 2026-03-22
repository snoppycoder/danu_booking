import {
  Operator,
  OperatorReportResponse,
  ReportSummary,
  Bus,
} from "./reports";

export const calculateReportSummary = (
  data: OperatorReportResponse,
): ReportSummary => {
  let totalTickets = 0;
  let totalRevenue = 0;
  let totalBuses = 0;
  let totalSellers = 0;

  data.items.forEach((operator: Operator) => {
    totalTickets += operator.Total_Ticket_Sales;
    totalRevenue += operator.Gross_Revenue;

    operator.Bus.forEach((bus: Bus) => {
      totalBuses += 1;
      totalTickets += bus.Total_Ticket_Sales;
      totalRevenue += bus.Gross_Revenue;

      if (bus.who_is_selling) {
        totalSellers += bus.who_is_selling.length;
      }
    });
  });

  return {
    totalOperators: data.items.length,
    totalBuses,
    totalSellers,
    totalTicketsSold: totalTickets,
    totalGrossRevenue: totalRevenue,
    averageRevenuePerBus: totalBuses > 0 ? totalRevenue / totalBuses : 0,
    averageTicketsPerBus: totalBuses > 0 ? totalTickets / totalBuses : 0,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
  }).format(amount);
};
export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(Math.round(num));
};

export const getOperatorMetrics = (operator: Operator) => {
  const busMetrics = operator.Bus.map((bus: Bus) => {
    const sellerCount = bus.who_is_selling?.length || 0;
    const avgRevenuePerSeller =
      sellerCount > 0 ? bus.Gross_Revenue / sellerCount : 0;

    return {
      busId: bus.bus_id,
      plateNo: bus.plate_no,
      sideNo: bus.side_no,
      capacity: bus.capacity,
      ticketsSold: bus.Total_Ticket_Sales,
      revenue: bus.Gross_Revenue,
      sellerCount,
      avgRevenuePerSeller,
      avgTicketsPerSeller:
        sellerCount > 0 ? bus.Total_Ticket_Sales / sellerCount : 0,
    };
  });

  return {
    operatorId: operator.operator_id,
    operatorName: operator.operator_name,
    totalTickets: operator.Total_Ticket_Sales,
    totalRevenue: operator.Gross_Revenue,
    busCount: operator.Bus.length,
    averageRevenuePerBus:
      operator.Bus.length > 0
        ? operator.Gross_Revenue / operator.Bus.length
        : 0,
    busMetrics,
  };
};

export const getTopPerformers = (data: OperatorReportResponse) => {
  const operatorPerformance = data.items.map((op: Operator) => ({
    name: op.operator_name,
    revenue: op.Gross_Revenue,
    tickets: op.Total_Ticket_Sales,
  }));

  return {
    topByRevenue: operatorPerformance
      .sort(
        (a: { revenue: number }, b: { revenue: number }) =>
          b.revenue - a.revenue,
      )
      .slice(0, 5),
    topByTickets: operatorPerformance
      .sort(
        (a: { tickets: number }, b: { tickets: number }) =>
          b.tickets - a.tickets,
      )
      .slice(0, 5),
  };
};
