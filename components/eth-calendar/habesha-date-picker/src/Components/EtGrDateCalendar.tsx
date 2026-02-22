import { Box, Button, Divider, Typography } from "@mui/material";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";

import { useContext, useEffect, useState } from "react";
import EthiopianDateCalendar from "./EthiopianDateCalendar";
import { EtDatePickerContext } from "../EtDatePickerContext";
import React from "react";
import { styled } from "@mui/material/styles";
import { EthiopianDate } from "../util/EthiopianDateUtils";

interface CustomPickerDayProps extends PickersDayProps<Date> {
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  inRange?: boolean;
}

// Styled component for the date range
const StyledDay = styled(PickersDay as React.ComponentType<PickersDayProps<Date>>)<CustomPickerDayProps>(({ theme, isRangeStart, isRangeEnd, inRange }) => ({
  ...(inRange && {
    backgroundColor: theme.palette.action.selected, // A light background for dates within the range
    borderRadius: 0, // Make it a rectangle for continuous range
  }),
  ...(isRangeStart && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: '50%', // Round corners for start of range
    borderBottomLeftRadius: '50%',
  }),
  ...(isRangeEnd && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderTopRightRadius: '50%', // Round corners for end of range
    borderBottomRightRadius: '50%',
  }),
  // Override default PickersDay styles if needed
  '&:hover': {
    backgroundColor: isRangeStart || isRangeEnd ? theme.palette.primary.dark : inRange ? theme.palette.action.hover : undefined,
  },
}));

const EtGrDateCalendar = () => {
  const etDatePickerContext = useContext(EtDatePickerContext);
  const {
    onDateChange,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    onMonthChange,
    gregDate,
    setGregDate,
    dateType,
    isRange,
    startDate,
    endDate,
  } = etDatePickerContext;

  const [gregDatePicker, setGregDatePicker] = useState<Date | null>(gregDate || null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const [startMonth, setStartMonth] = useState<Date | null>(startDate || gregDate || new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(startDate ? new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1) : gregDate ? new Date(gregDate.getFullYear(), gregDate.getMonth() + 1, 1) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1));

  useEffect(() => {
    if (isRange && startDate) {
      setStartMonth(startDate);
      setEndMonth(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1));
    } else if (!isRange) {
      setGregDatePicker(gregDate || null);
    }
  }, [isRange, startDate, gregDate]);

  const handleTodayButtonClick = () => {
    if (isRange) {
      onDateChange([new Date(), null]);
    } else {
      onDateChange(new Date());
    }
  };

  const showEthiopianCalendar = dateType !== "GC";
  const showGregorianCalendar = dateType === "GC";

  return (
    <Box sx={{ minWidth: isRange ? 610 : undefined }}>
      <Box display={"flex"}>
        {isRange ? (
          // Range mode: Display two calendars
          (dateType === "EC" || dateType === "AO" || dateType === "CUSTOM") ? (
            // Ethiopian/Afan Oromo range pickers
            <>
              <Box width={295} display="flex" flexDirection="column" mr={1}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Start Date</Typography>
                <EthiopianDateCalendar
                  isRange={isRange}
                  startDate={startDate}
                  endDate={endDate}
                  hoveredDate={hoveredDate}
                  setHoveredDate={setHoveredDate}
                  onDateChange={onDateChange}
                  onMonthChange={setStartMonth}
                />
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box width={295} display="flex" flexDirection="column" ml={1} pr={4}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>End Date</Typography>
                <EthiopianDateCalendar
                  isRange={isRange}
                  startDate={startDate}
                  endDate={endDate}
                  initialViewDate={startDate ? EthiopianDate.toGreg(EthiopianDate.addMonth(EthiopianDate.toEth(startDate), 1)) : null}
                  hoveredDate={hoveredDate}
                  setHoveredDate={setHoveredDate}
                  onDateChange={onDateChange}
                  onMonthChange={setEndMonth}
                />
              </Box>
            </>
          ) : (
            // Gregorian range pickers (dateType === "GC")
            <>
              <Box width={295} display="flex" flexDirection="column" mr={1}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Start Date</Typography>
                <DateCalendar<Date>
                  monthsPerRow={3}
                  value={startDate}
                  onChange={(date) => {
                    if (date) {
                      if (!startDate || (startDate && endDate)) {
                        etDatePickerContext.onDateChange([date, null]);
                      } else if (date.getTime() < startDate.getTime()) {
                        etDatePickerContext.onDateChange([date, startDate]);
                      } else {
                        etDatePickerContext.onDateChange([startDate, date]);
                      }
                      setHoveredDate(null); // Clear hovered date on selection
                    }
                  }}
                  disableFuture={disableFuture}
                  onMonthChange={(date) => {
                    setStartMonth(date);
                    setHoveredDate(null); // Clear hovered date on month change
                  }}
                  disablePast={disablePast}
                  minDate={minDate}
                  maxDate={maxDate}
                  slots={{ day: StyledDay as React.ComponentType<PickersDayProps<Date>> }}
                  slotProps={{
                    day: (ownerState: any) => {
                      const isRangeStart = startDate && ownerState.day.getTime() === startDate.getTime();
                      const isRangeEnd = endDate && ownerState.day.getTime() === endDate.getTime();
                      const isInRange = (
                        startDate &&
                        (
                          (endDate && ownerState.day.getTime() > Math.min(startDate.getTime(), endDate.getTime()) && ownerState.day.getTime() < Math.max(startDate.getTime(), endDate.getTime())) ||
                          (!endDate && hoveredDate && ownerState.day.getTime() > Math.min(startDate.getTime(), hoveredDate.getTime()) && ownerState.day.getTime() < Math.max(startDate.getTime(), hoveredDate.getTime()))
                        )
                      );
                      return {
                        ...ownerState,
                        isRangeStart: isRangeStart,
                        isRangeEnd: isRangeEnd,
                        inRange: isInRange,
                        onMouseEnter: () => {
                          if (isRange && startDate && !endDate) {
                            setHoveredDate(ownerState.day);
                          }
                        },
                        onMouseLeave: () => {
                          if (isRange && startDate && !endDate) {
                            setHoveredDate(null);
                          }
                        },
                      };
                    },
                  }}
                  openTo="day"
                  views={['month', 'year', 'day']}
                />
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box width={295} display="flex" flexDirection="column" ml={1} pr={4}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>End Date</Typography>
                <DateCalendar<Date>
                  monthsPerRow={3}
                  value={endDate || endMonth}
                  onChange={(date) => {
                    if (date) {
                      if (!startDate || (startDate && endDate)) {
                        etDatePickerContext.onDateChange([date, null]);
                      } else if (date.getTime() < startDate.getTime()) {
                        etDatePickerContext.onDateChange([date, startDate]);
                      } else {
                        etDatePickerContext.onDateChange([startDate, date]);
                      }
                      setHoveredDate(null); // Clear hovered date on selection
                    }
                  }}
                  disableFuture={disableFuture}
                  onMonthChange={(date) => {
                    setEndMonth(date);
                    setHoveredDate(null); // Clear hovered date on month change
                  }}
                  disablePast={disablePast}
                  minDate={minDate}
                  maxDate={maxDate}
                  slots={{ day: StyledDay as React.ComponentType<PickersDayProps<Date>> }}
                  slotProps={{
                    day: (ownerState: any) => {
                      const isRangeStart = startDate && ownerState.day.getTime() === startDate.getTime();
                      const isRangeEnd = endDate && ownerState.day.getTime() === endDate.getTime();
                      const isInRange = (
                        startDate &&
                        (
                          (endDate && ownerState.day.getTime() > Math.min(startDate.getTime(), endDate.getTime()) && ownerState.day.getTime() < Math.max(startDate.getTime(), endDate.getTime())) ||
                          (!endDate && hoveredDate && ownerState.day.getTime() > Math.min(startDate.getTime(), hoveredDate.getTime()) && ownerState.day.getTime() < Math.max(startDate.getTime(), hoveredDate.getTime()))
                        )
                      );
                      return {
                        ...ownerState,
                        isRangeStart: isRangeStart,
                        isRangeEnd: isRangeEnd,
                        inRange: isInRange,
                        onMouseEnter: () => {
                          if (isRange && startDate && !endDate) {
                            setHoveredDate(ownerState.day);
                          }
                        },
                        onMouseLeave: () => {
                          if (isRange && startDate && !endDate) {
                            setHoveredDate(null);
                          }
                        },
                      };
                    },
                  }}
                  openTo="day"
                  views={['month', 'year', 'day']}
                />
              </Box>
            </>
          )
        ) : (
          // Single date mode
          <>
            {showEthiopianCalendar && (
              <Box
                width={295}
                display="flex"
                flexDirection="column"
                mr={showGregorianCalendar ? 1 : 0}
              >
                <EthiopianDateCalendar
                  isRange={isRange}
                  startDate={startDate}
                  endDate={endDate}
                  hoveredDate={hoveredDate}
                  setHoveredDate={setHoveredDate}
                  onDateChange={onDateChange}
                  onMonthChange={onMonthChange}
                />
              </Box>
            )}
            {showEthiopianCalendar && showGregorianCalendar && (
              <Divider orientation="vertical" flexItem />
            )}
            {showGregorianCalendar && (
              <Box width={295} mr={showEthiopianCalendar ? 0 : 2}>
                <Box width={295} pr={4}>
                  <DateCalendar<Date>
                    monthsPerRow={3}
                    value={gregDatePicker}
                    onChange={(date) => {
                      if (date) {
                        onDateChange(date);
                      }
                    }}
                    disableFuture={disableFuture}
                    onMonthChange={(date) => {
                      const newDate = new Date(date);
                      newDate.setDate(gregDate?.getDate() ?? 15);
                      onMonthChange(newDate);
                      setGregDate(newDate);
                    }}
                    disablePast={disablePast}
                    minDate={minDate}
                    maxDate={maxDate}
                    slots={{ day: StyledDay as React.ComponentType<PickersDayProps<Date>> }}
                    slotProps={{
                      day: (ownerState: any) => ({
                        ...ownerState,
                        isRangeStart: isRange && startDate && ownerState.day.getTime() === startDate.getTime(),
                        isRangeEnd: isRange && endDate && ownerState.day.getTime() === endDate.getTime(),
                        inRange: isRange && startDate && endDate && ownerState.day.getTime() > startDate.getTime() && ownerState.day.getTime() < endDate.getTime(),
                      }),
                    }}
                    openTo="day"
                    views={['month', 'year', 'day']}
                  />
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
      <Box>
        {/* Hide Today button if it is a range selection */}
        {!isRange && (
          <Button
            sx={{ ml: 2, mt: showGregorianCalendar && !isRange ? -7 : 0 }}
            onClick={handleTodayButtonClick}
          >
            Today
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EtGrDateCalendar;
