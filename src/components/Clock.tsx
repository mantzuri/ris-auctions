import React from 'react';

import { intervalToDuration } from "date-fns";
import { Sheet } from "@mui/joy";
import TimeBlock from "./TimeBlock.tsx";
import { useEffect, useState } from "react";

const Clock = () => {
  const [t, setT] = useState<Duration>();

  useEffect(() => {
    setTimeout(() => setT(
      intervalToDuration({
        start: new Date(2022, 12, 2, 0, 0, 15),
        end: new Date(),
      })
    ), 1000);
  }, [t]);
  return (
    <Sheet sx={styles.clock}>
      <TimeBlock time={t?.days} text="days" end />
      <TimeBlock time={t?.hours} text="hours" end />
      <TimeBlock time={t?.minutes} text="minutes" end />
      <TimeBlock time={t?.seconds} text="seconds" />
    </Sheet>
  );
};

export default Clock;

const styles = {
  clock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
};
