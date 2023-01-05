import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Sheet,
  AspectRatio,
  Typography,
  TextField,
  TypographySystem,
} from "@mui/joy";

import Clock from "./Clock";
import { formatDistanceToNow } from "date-fns";

interface AuctionSelectedType {
  itemId: string
};

const AuctionSelected = ({ itemId }: AuctionSelectedType) => {
  const [bid, setBid] = useState<number | string>("");
  const [intervalKey, setIntervalKey] = useState(0);
  const [maxBids, setMaxBids] = useState<{
    value: number | string;
    ts?: string;
  }[]>([]);

  const onBidClick = () => {
    if (!maxBids[0] || bid > maxBids[0].value) {
      setMaxBids(
        [{ value: bid, ts: new Date().toISOString() }, ...maxBids.slice(0, 3)]
      );
    }
  };

  useEffect(() => {
    let interval = setInterval(() => setIntervalKey(intervalKey + 1), 30 * 1000);
    return () => clearInterval(interval);
  }, [intervalKey])

  return (
    <Box sx={{ width: "100vw" }}>
      <Box sx={{ width: 520, mx: "auto" }}>
        <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
          Yosemite National Park
        </Typography>
        <Typography level="body2">April 24 to May 02, 2021</Typography>
        <Sheet sx={styles.imageContainer}>
          <AspectRatio>
            <img
              style={{ borderRadius: "md" }}
              src={`https://source.unsplash.com/random?sig=${itemId}`}
              alt="background"
            />
          </AspectRatio>
        </Sheet>
        <Clock />
        <Sheet sx={styles.bidBox}>
          <TextField
            startDecorator={"$"}
            type="number"
            value={bid}
            onChange={(value) => {
              setBid(Number(value.target.value) || "");
            }}
          />
          <Button
            sx={{ ml: 4 }}
            onClick={onBidClick}
            disabled={Boolean(!bid || (maxBids[0] && bid < maxBids[0].value))}
          >
            Bid
          </Button>
        </Sheet>
        <Sheet sx={styles.passBids}>
          <>
            {maxBids[0] &&
              maxBids.map((bid, index) => (
                <Typography
                  key={index + intervalKey}
                  level={`body${index + 1}` as keyof TypographySystem}
                  color={index === 0 ? "success" : "neutral"}
                >
                  {bid.ts ? formatDistanceToNow(new Date(bid.ts)) + " ago" : '-'} - $
                  {bid.value}
                </Typography>
              ))}
          </>
        </Sheet>
      </Box>
    </Box>
  );
};

const styles = {
  clock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bidBox: {
    display: "flex",
    flexDirection: "row",
    alignItem: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  passBids: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    paddingTop: 2,
  },
  imageContainer: {
    borderRadius: "md",
    overflow: "auto",
    my: 2,
  },
  list: {},
  thumbnail: {
    width: 60,
  },
};

export default AuctionSelected;
