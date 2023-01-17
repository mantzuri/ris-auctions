import {
  AspectRatio,
  Box,
  Button,
  Sheet,
  TextField,
  Typography,
  TypographySystem,
} from "@mui/joy";
import { AuctionItemType, SelectedAuctionItemType } from "../types";
import { DocumentData, QuerySnapshot } from "@firebase/firestore";
import { auth, bidOnItem, streamAuctionBids } from "../utils/firebase";
import { useEffect, useState } from "react";

import Alert from "./Alert";
import Clock from "./Clock";
import DeleteListingDialog from "../modals/DeleteListingModal";
import { formatDistanceToNow } from "date-fns";

const REFRESH_INTERVAL = 60000;

const AuctionSelected = ({ image, title, subtitle, itemId }: SelectedAuctionItemType) => {
  const [bidAmount, setBidAmount] = useState<number | string>("");
  const [intervalKey, setIntervalKey] = useState(0);
  const [bids, setBids] = useState<AuctionItemType[]>([]);

  useEffect(() =>
    streamAuctionBids(
      itemId || "",
      "demo-bids",
      (querySnapshot: QuerySnapshot) => {
        const updatedBids = querySnapshot.docs.map((doc) =>
          doc.data()
        );
        setBids(updatedBids as AuctionItemType[]);

      },
      (err: QuerySnapshot<DocumentData>) => {
        console.error(err);
        throw new Error("Failed to listen to bids");
      }
    )
    , [itemId]);

  const onBidClick = async () => {
    setBidAmount('');
    await bidOnItem({ itemId, bidAmount });
  };

  useEffect(() => {
    let interval = setInterval(() => setIntervalKey(intervalKey + 1), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [intervalKey])

  return (
    <Box sx={{ width: "100vw" }}>
      <Box sx={{ width: 520, mx: "auto" }}>
        <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography level="body2">{subtitle}</Typography>
        <Sheet sx={styles.imageContainer}>
          <AspectRatio>
            <img
              style={{ borderRadius: "md" }}
              src={image}
              alt="background"
            />
          </AspectRatio>
        </Sheet>
        <Clock />
        <Sheet sx={styles.bidBox}>
          <TextField
            startDecorator={"$"}
            type="number"
            value={bidAmount}
            onChange={(value) => {
              setBidAmount(Number(value.target.value) || "");
            }}
          />
          <Button
            sx={{ ml: 4 }}
            onClick={onBidClick}
            disabled={Boolean(!bidAmount || (bids[0] && bidAmount <= bids[0].bidAmount))}
          >
            Bid
          </Button>
        </Sheet>
        <Sheet sx={styles.passBids}>
          <>
            {bids[0] &&
              bids[0].bidderId === auth.currentUser?.uid &&
              <Alert title="Congratulation" subtitle="You are the highest bidder" />
            }
            {bids[0] &&
              bids.map((bid, index) => (
                <Typography
                  key={index + intervalKey}
                  level={`body${index + 1}` as keyof TypographySystem}
                  color={index === 0 ? "success" : "neutral"}
                >
                  ${bid.bidAmount} - {bid.timestamp ? formatDistanceToNow(new Date(bid.timestamp.seconds * 1000)) + " ago" : '-'}
                </Typography>
              ))}
          </>
        </Sheet>
        <DeleteListingDialog listingId={itemId} />

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
