import React, { useState, createContext, ReactNode, useEffect } from "react";
import { EtDateFieldProps } from "./EtDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { set } from "date-fns";
import { DateType } from "./util/EthiopianDateUtils";

export type EtDatePickerContextValue = {
  value?: Date | null;
  monthValue?: Date | null;
  gregDate?: Date | null;
  setGregDate: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onDateChange: (date: Date | null | [Date | null, Date | null]) => void;
  dateType: "GC" | "EC" | "AO" | "CUSTOM";
  locale: "am" | "gc";
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isRange?: boolean;
  startDate: Date | null;
  endDate: Date | null;
} & EtDateFieldProps;

const EtDatePickerContext = React.createContext<EtDatePickerContextValue>({
  value: null,
  monthValue: null,
  gregDate: null,
  setGregDate: (date: Date) => {},
  onMonthChange: (date: Date) => {},
  onDateChange: (date: Date | null | [Date | null, Date | null]) => {},
  dateType: "GC",
  locale: "am",
  isRange: false,
  startDate: null,
  endDate: null,
});

export type EtDatePickerProviderProps = {
  children: ReactNode;
  onChange?: (date: Date | null | [Date | null, Date | null]) => void;
  value?: Date | null | [Date | null, Date | null];
  dateType?: "GC" | "EC" | "AO" | "CUSTOM";
  isRange?: boolean;
} & EtDateFieldProps;

const EtDatePickerProvider: React.FC<EtDatePickerProviderProps> = ({
  children,
  onChange,
  value,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  dateType,
  isRange,
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [monthValue, setMonthValue] = useState<Date | null>(null);
  const [gregDate, setGregDate] = useState<Date | null>(null);

  const onDateChange = (newDate: Date | null | [Date | null, Date | null]) => {
    if (isRange) {
      if (Array.isArray(newDate) && newDate.length === 2) {
        const [newStartDate, newEndDate] = newDate;
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        onChange?.([newStartDate, newEndDate]);
      } else if (newDate instanceof Date) {
        // If selecting the first date in a range
        setStartDate(newDate);
        setEndDate(null);
        onChange?.([newDate, null]);
      }
    } else {
      setDate(newDate as Date | null);
      onChange?.(newDate);
    }
  };

  const onMonthChange = (date: Date) => {
    setMonthValue(date);
  };

  useEffect(() => {
    if (isRange) {
      if (Array.isArray(value) && value.length === 2) {
        setStartDate(value[0]);
        setEndDate(value[1]);
      } else {
        setStartDate(null);
        setEndDate(null);
      }
    } else {
      setDate(value as Date | null);
      setGregDate(value as Date | null);
    }
  }, [value, isRange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <EtDatePickerContext.Provider
        value={{
          value: date,
          monthValue: monthValue,
          gregDate: gregDate,
          setGregDate,
          onMonthChange,
          onDateChange,
          disableFuture,
          disablePast,
          minDate,
          maxDate,
          dateType: dateType ?? "GC",
          locale: "am",
          isRange: isRange,
          startDate: startDate,
          endDate: endDate,
        }}
      >
        {children}
      </EtDatePickerContext.Provider>
    </LocalizationProvider>
  );
};

export { EtDatePickerProvider, EtDatePickerContext };
