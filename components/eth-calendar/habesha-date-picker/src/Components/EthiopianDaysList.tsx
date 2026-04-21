import { Box, Typography, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { EtDatePickerContext } from "../EtDatePickerContext";
import { EthiopianDate } from "../util/EthiopianDateUtils";
import { useEtLocalization } from "../EtLocalizationProvider";

type EthiopianDaysListProps = {
  month: number;
  year: number;
  isRange?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  hoveredEtDate?: EthiopianDate.EtDate | null;
  setHoveredEtDate?: (date: EthiopianDate.EtDate | null) => void;
  onDateChange: (date: Date | [Date | null, Date | null]) => void;
};

const EthiopianDaysList: React.FC<EthiopianDaysListProps> = ({
  month,
  year,
  isRange,
  startDate,
  endDate,
  hoveredEtDate,
  setHoveredEtDate,
  onDateChange,
}) => {
  const { localType } = useEtLocalization();
  const cellSize = "36px";
  const gap = 0.5;
  const days =
    localType === "EC" || localType === "GC"
      ? EthiopianDate.shortDays
      : EthiopianDate.englishShortDays;
  const today = EthiopianDate.toEth(new Date());
  const {
    onDateChange: contextOnDateChange,
    setGregDate,
    value,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
  } = useContext(EtDatePickerContext);

  const [selectedDate, setSelectedDate] = useState<EthiopianDate.EtDate | null>(
    value ? EthiopianDate.toEth(value) : null,
  );

  const getEtDate = (day: number): EthiopianDate.EtDate => {
    return { Day: day, Month: month, Year: year };
  };

  const isDisabled = (day: number): boolean => {
    const date = EthiopianDate.createEthiopianDateFromParts(day, month, year);
    if (disableFuture && EthiopianDate.compareDates(today, date) === -1) {
      return true;
    }
    if (disablePast && EthiopianDate.compareDates(today, date) === 1) {
      return true;
    }
    if (
      minDate &&
      (minDate instanceof Date || Boolean(new Date(minDate as string))) &&
      EthiopianDate.compareDates(
        EthiopianDate.toEth(
          minDate instanceof Date ? minDate : new Date(minDate as string),
        ),
        date,
      ) === 1
    ) {
      return true;
    }
    if (
      maxDate &&
      (maxDate instanceof Date || Boolean(new Date(maxDate as string))) &&
      EthiopianDate.compareDates(
        EthiopianDate.toEth(
          maxDate instanceof Date ? maxDate : new Date(maxDate as string),
        ),
        date,
      ) === -1
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (value && !isRange) setSelectedDate(EthiopianDate.toEth(value));
  }, [value, isRange]);

  const isSelectedDate = (day: number): boolean => {
    if (isRange) return false;
    return (
      day === selectedDate?.Day &&
      month === selectedDate?.Month &&
      year === selectedDate?.Year
    );
  };

  const isDayRangeStart = (day: number): boolean => {
    const currentDayGregorian = EthiopianDate.toGreg(getEtDate(day));
    return !!(
      isRange &&
      startDate &&
      currentDayGregorian.getTime() === startDate.getTime()
    );
  };

  const isDayRangeEnd = (day: number): boolean => {
    const currentDayGregorian = EthiopianDate.toGreg(getEtDate(day));
    return !!(
      isRange &&
      endDate &&
      currentDayGregorian.getTime() === endDate.getTime()
    );
  };

  const isDayInRange = (day: number): boolean => {
    if (!isRange || !startDate) return false;

    const currentDayGregorian = EthiopianDate.toGreg(getEtDate(day));
    const startMs = startDate.getTime();

    if (endDate) {
      const endMs = endDate.getTime();
      return (
        currentDayGregorian.getTime() > Math.min(startMs, endMs) &&
        currentDayGregorian.getTime() < Math.max(startMs, endMs)
      );
    } else if (hoveredEtDate) {
      const hoveredMs = EthiopianDate.toGreg(hoveredEtDate).getTime();
      return (
        currentDayGregorian.getTime() > Math.min(startMs, hoveredMs) &&
        currentDayGregorian.getTime() < Math.max(startMs, hoveredMs)
      );
    }
    return false;
  };

  // --- THE FIX: Calculate what day of the week the 1st of the month is ---
  const firstDayOfMonthGregorian = EthiopianDate.toGreg(getEtDate(1));

  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  // If your EthiopianDate.shortDays array starts on Sunday (Ehud), this works perfectly.
  // If it starts on Monday (Segno), you would change this to: const startDayOfWeek = (firstDayOfMonthGregorian.getDay() + 6) % 7;
  const startDayOfWeek = firstDayOfMonthGregorian.getDay();

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(7, ${cellSize})`,
          gap: gap,
          justifyContent: "center",
          alignItems: "center",
          mb: 1,
        }}
      >
        {days.map((day, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              justifySelf: "center",
              alignSelf: "center",
              color: "grey",
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(7, ${cellSize})`,
          gap: gap,
        }}
      >
        {/* THE FIX: Add empty placeholders before the 1st of the month */}
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <Box
            key={`empty-${index}`}
            sx={{ width: cellSize, height: cellSize }}
          />
        ))}

        {Array.from(
          {
            length: EthiopianDate.ethiopianMonthLength(month, year),
          },
          (_, index) => {
            const day = index + 1;
            const currentDayGregorian = EthiopianDate.toGreg(getEtDate(day));

            return (
              <IconButton
                key={index}
                disabled={isDisabled(day)}
                onClick={() => {
                  if (isRange) {
                    if (!startDate || (startDate && endDate)) {
                      onDateChange([currentDayGregorian, null]);
                    } else if (
                      currentDayGregorian.getTime() < startDate.getTime()
                    ) {
                      onDateChange([currentDayGregorian, startDate]);
                    } else {
                      onDateChange([startDate, currentDayGregorian]);
                    }
                  } else {
                    setSelectedDate(getEtDate(day));
                    contextOnDateChange(currentDayGregorian);
                    setGregDate(currentDayGregorian);
                  }
                  if (setHoveredEtDate) setHoveredEtDate(null); // Clear hovered date on selection
                }}
                onMouseEnter={() => {
                  if (isRange && startDate && !endDate && setHoveredEtDate) {
                    setHoveredEtDate(getEtDate(day));
                  }
                }}
                onMouseLeave={() => {
                  if (isRange && startDate && !endDate && setHoveredEtDate) {
                    setHoveredEtDate(null);
                  }
                }}
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: isDayRangeStart(day)
                    ? "primary.main"
                    : isDayRangeEnd(day)
                      ? "primary.main"
                      : isDayInRange(day)
                        ? "action.selected"
                        : isSelectedDate(day)
                          ? "primary.dark"
                          : "transparent",
                  borderRadius: isDayRangeStart(day)
                    ? "50% 0 0 50%"
                    : isDayRangeEnd(day)
                      ? "0 50% 50% 0"
                      : isDayInRange(day)
                        ? "0"
                        : "50%",
                  color:
                    isDayRangeStart(day) || isDayRangeEnd(day)
                      ? "white"
                      : isSelectedDate(day)
                        ? "white"
                        : "black",
                  border:
                    day === today.Day &&
                    month === today.Month &&
                    year === today.Year &&
                    !isSelectedDate(day) &&
                    !isDayRangeStart(day) &&
                    !isDayRangeEnd(day) &&
                    !isDayInRange(day)
                      ? `1px solid ${today.Month === month && today.Year === year ? "primary.main" : "transparent"}`
                      : "none",
                  "&:hover": {
                    backgroundColor:
                      isDayRangeStart(day) || isDayRangeEnd(day)
                        ? "primary.dark"
                        : isDayInRange(day)
                          ? "action.hover"
                          : undefined,
                    color:
                      isDayRangeStart(day) || isDayRangeEnd(day)
                        ? "white"
                        : isSelectedDate(day)
                          ? "white"
                          : "black",
                  },
                }}
              >
                <Typography variant="body2">{day}</Typography>
              </IconButton>
            );
          },
        )}
      </Box>
    </>
  );
};

export default EthiopianDaysList;
