"use client";
import {
  ButtonBase,
  IconButton,
  InputAdornment,
  Menu,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import React from "react";

import * as datefns from "date-fns";
import { EventOutlined } from "@mui/icons-material";
import {
  EtDatePickerProvider,
  EtDatePickerProviderProps,
} from "./EtDatePickerContext";
import { DateType, EthiopianDate } from "./util/EthiopianDateUtils";
import { DatePicker } from "@mui/x-date-pickers";
import EtGrDateCalendar from "./Components/EtGrDateCalendar";
import { useEtLocalization } from "./EtLocalizationProvider";

type CustomFieldProps = Omit<
  React.ComponentProps<typeof TextField>,
  "onChange" | "value" | "InputProps"
>;

export type EtDateFieldProps = Pick<
  React.ComponentProps<typeof DatePicker>,
  "disablePast" | "disableFuture"
> & { minDate?: Date; maxDate?: Date };

type EtDatePickerProps = {
  onClick?: () => void;
  isRange?: boolean;
  value?: Date | null | [Date | null, Date | null];
  onChange?: (date: Date | null | [Date | null, Date | null]) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Date;
  maxDate?: Date;
} & CustomFieldProps &
  EtDateFieldProps;
const EtDatePicker: React.FC<EtDatePickerProps> = ({
  onClick,
  value,
  onChange,
  isRange,
  minDate,
  maxDate,
  disableFuture,
  disablePast,

  ...props
}) => {
  const { localType, getLocalMonthName } = useEtLocalization();
  const [dateType, setDateType] = useState<DateType>(localType);
  const [date, setDate] = useState<Date | null | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    if (isRange && (!startDate || !endDate)) return;
    setAnchorEl(null);
  };

  const handleDateChange: EtDatePickerProviderProps["onChange"] = (
    newValue,
  ) => {
    if (isRange) {
      const [sDate, eDate] = newValue as [Date | null, Date | null];
      setStartDate(sDate);
      setEndDate(eDate);
      onChange?.([sDate, eDate]);

      // Close the modal if both start and end dates are selected
      if (sDate && eDate) {
        setAnchorEl(null);
      }
    } else {
      setDate(newValue as Date | null);
      onChange?.(newValue as Date | null);
      if (newValue instanceof Date) {
        setAnchorEl(null);
      }
    }
  };

  const handleDateTypeChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newDateType = dateType === "GC" ? localType : "GC";
    setDateType(newDateType);
    event.stopPropagation();
  };

  const { disableSwitcher } = useEtLocalization();

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
      if (value instanceof Date || value === null) {
        setDate(value);
      } else {
        setDate(undefined);
      }
    }
  }, [value, isRange]);

  return (
    <>
      <TextField
        {...props}
        value={
          isRange
            ? dateType === "GC"
              ? `${startDate ? datefns.format(startDate, "dd/MMM/yyyy") : "-"} - ${endDate ? datefns.format(endDate, "dd/MMM/yyyy") : "-"}`
              : `${startDate ? EthiopianDate.formatEtDate(EthiopianDate.toEth(startDate), localType, getLocalMonthName) : "-"} - ${endDate ? EthiopianDate.formatEtDate(EthiopianDate.toEth(endDate), localType, getLocalMonthName) : "-"}`
            : date
              ? dateType === "GC"
                ? datefns.format(date, "dd/MMM/yyyy")
                : EthiopianDate.formatEtDate(
                    EthiopianDate.toEth(date),
                    localType,
                    getLocalMonthName,
                  )
              : "-"
        }
        InputProps={{
          onClick: props.disabled
            ? undefined
            : (event) => {
                handleClick(event);
              },
          startAdornment: disableSwitcher ? undefined : (
            <InputAdornment position="start">
              <ButtonBase onClick={handleDateTypeChange}>
                <Typography fontWeight={700} color="primary">
                  {dateType === "CUSTOM" ? "CU" : dateType}
                </Typography>
              </ButtonBase>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClick} disabled={props.disabled}>
                <EventOutlined />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <EtDatePickerProvider
          onChange={handleDateChange}
          disableFuture={disableFuture}
          disablePast={disablePast}
          minDate={minDate}
          maxDate={maxDate}
          value={isRange ? [startDate, endDate] : date}
          dateType={
            dateType === "AO" || dateType === "CUSTOM" ? "GC" : dateType
          }
          isRange={isRange}
        >
          <EtGrDateCalendar />
        </EtDatePickerProvider>
      </Menu>
    </>
  );
};

export default EtDatePicker;
