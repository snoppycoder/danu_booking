import {
  ArrowDropDown,
  ArrowDropUp,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import EthiopianYearList from "./EthiopianYearList";
import EthiopianDaysList from "./EthiopianDaysList";
import { EtDatePickerContext } from "../EtDatePickerContext";
import { EthiopianDate } from "../util/EthiopianDateUtils";
import { useEtLocalization } from "../EtLocalizationProvider";

interface EthiopianDateCalendarProps {
  isRange?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  initialViewDate?: Date | null;
  hoveredDate?: Date | null;
  setHoveredDate?: (date: Date | null) => void;
  onDateChange: (date: Date | [Date | null, Date | null]) => void;
  onMonthChange?: (date: Date) => void;
}

const EthiopianDateCalendar: React.FC<EthiopianDateCalendarProps> = ({
  isRange,
  startDate,
  endDate,
  initialViewDate,
  hoveredDate,
  setHoveredDate,
  onDateChange,
  onMonthChange,
}) => {
  const { value, monthValue, setGregDate, gregDate } =
    useContext(EtDatePickerContext);
  const today = EthiopianDate.toEth(new Date());
  const [ethDate, setEthDate] = useState<EthiopianDate.EtDate>(initialViewDate ? EthiopianDate.toEth(initialViewDate) : today);
  const [showYearList, setShowYearList] = useState(false);

  const { localType, getLocalMonthName } = useEtLocalization();

  const incrementMonth = () => {
    const gDate = EthiopianDate.toGreg({ ...ethDate, Day: 15 });

    if (ethDate.Month === 13) {
      const newEthDate = { ...ethDate, Month: 1, Year: ethDate.Year + 1, Day: 15 };
      setEthDate(newEthDate);
      onMonthChange?.(EthiopianDate.toGreg(newEthDate));
    } else {
      const newEthDate = { ...ethDate, Month: ethDate.Month + 1, Day: 15 };
      setEthDate(newEthDate);
      onMonthChange?.(EthiopianDate.toGreg(newEthDate));
    }

    if (!gregDate) return setGregDate(EthiopianDate.toGreg(ethDate));
    const newGregDate = new Date(gregDate);
    newGregDate.setMonth(newGregDate.getMonth() + 1);
    setGregDate(newGregDate);
  };

  const decrementMonth = () => {
    if (ethDate.Month === 1) {
      const newEthDate = { ...ethDate, Year: ethDate.Year - 1, Month: 13, Day: 15 };
      setEthDate(newEthDate);
      onMonthChange?.(EthiopianDate.toGreg(newEthDate));
    } else {
      const newEthDate = { ...ethDate, Month: ethDate.Month - 1, Day: 15 };
      setEthDate(newEthDate);
      onMonthChange?.(EthiopianDate.toGreg(newEthDate));
    }

    if (!gregDate) return setGregDate(EthiopianDate.toGreg(ethDate));
    const newGregDate = new Date(gregDate);
    newGregDate.setMonth(newGregDate.getMonth() - 1);
    setGregDate(newGregDate);
  };

  useEffect(() => {
    if (initialViewDate) {
      setEthDate(EthiopianDate.toEth(initialViewDate));
    } else if (value && !isRange) {
      setEthDate(EthiopianDate.toEth(value));
    }
  }, [value, isRange, initialViewDate]);

  useEffect(() => {
    if (!monthValue) return;

    const convertedDate = EthiopianDate.toGreg({ ...ethDate });
    const convertedMonth = convertedDate.getMonth();
    const convertedYear = convertedDate.getFullYear();

    const targetMonth = monthValue.getMonth();
    const targetYear = monthValue.getFullYear();

    const dateDifference = Math.abs(
      monthValue.getMonth() -
        EthiopianDate.toGreg({ ...ethDate, Day: 15 }).getMonth()
    );

    const isAfter =
      targetYear > convertedYear ||
      (targetYear === convertedYear && targetMonth > convertedMonth);

    const isBefore =
      targetYear < convertedYear ||
      (targetYear === convertedYear && targetMonth < convertedMonth);

    if (isAfter) {
      if (ethDate.Month === 12 || ethDate.Month === 13) {
        setEthDate({ ...ethDate, Month: 1, Year: ethDate.Year + 1 });
      } else {
        if (dateDifference === 2 || dateDifference === 10) {
          setEthDate((prev) => ({ ...prev, Month: prev.Month + 2, Day: 15 }));
          return;
        }
        setEthDate((prev) => ({ ...prev, Month: prev.Month + 1 }));
      }
    } else if (isBefore) {
      if (ethDate.Month === 1) {
        setEthDate({ ...ethDate, Year: ethDate.Year - 1, Month: 12 });
      } else {
        if (dateDifference === 0) {
          setEthDate((prev) => ({ ...prev, Month: prev.Month, Day: 15 }));
          return;
        }
        setEthDate((prev) => ({ ...prev, Month: prev.Month - 1 }));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthValue]);

  return (
    <Box mx={2}>
      <Stack
        direction="row"
        display="flex"
        justifyContent="space-between"
        m={2}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => setShowYearList(!showYearList)}
        >
          <Typography>{`${EthiopianDate.getEtMonthName(
            ethDate.Month,
            localType,
            getLocalMonthName
          )} ${ethDate.Year}`}</Typography>
          <IconButton size="small">
            {showYearList ? <ArrowDropUp /> : <ArrowDropDown />}
          </IconButton>
        </Box>
        <Box sx={{ display: "flex" }}>
          <IconButton size="small" onClick={decrementMonth}>
            <ChevronLeft />
          </IconButton>
          <IconButton size="small" onClick={incrementMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Stack>
      <Box>
        {showYearList ? (
          <EthiopianYearList
            onYearClick={(selectedYear) => {
              setEthDate({ ...ethDate, Year: selectedYear });
              setGregDate(
                EthiopianDate.toGreg({ ...ethDate, Year: selectedYear })
              );
              setShowYearList(false);
            }}
            startYear={ethDate.Year}
          />
        ) : (
          <EthiopianDaysList
            month={ethDate.Month}
            year={ethDate.Year}
            isRange={isRange}
            startDate={startDate}
            endDate={endDate}
            hoveredEtDate={hoveredDate ? EthiopianDate.toEth(hoveredDate) : null}
            setHoveredEtDate={(ethDate) => setHoveredDate && setHoveredDate(ethDate ? EthiopianDate.toGreg(ethDate) : null)}
            onDateChange={onDateChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default EthiopianDateCalendar;
