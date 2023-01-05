import React from 'react';
import { Typography, Sheet, Box } from "@mui/joy";

interface TimeBlockType {
  time?: number;
  text?: string;
  end?: boolean;
}

export const TimeBlock = ({ time, text, end }: TimeBlockType) => {
  return (
    <Box sx={styles.container}>
      <>
        <Sheet sx={styles.time}>
          <Typography fontSize="xl" level="h1">
            {time || "00"}
          </Typography>
          <Typography fontSize="xs">{text}</Typography>
        </Sheet>
        <>
          {end ? (
            <Typography sx={styles.separator} level="h1" fontSize="xl">
              :
            </Typography>
          ) : null}
        </>
      </>
    </Box>
  );
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
  },
  time: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  separator: {
    px: 1,
    color: "orange",
    fontSize: 25,
    marginTop: -0.5,
  },
};
export default TimeBlock;
