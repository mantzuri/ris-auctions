import { Button, List, Sheet } from "@mui/joy";
import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { logout, streamAuctionItems } from "../utils/firebase";

import { AuctionItemType } from "../types";
import AuctionListItem from "../components/AuctionListItem";
import AuctionSelected from "../components/AuctionSelected";
import NewAuctionModal from "./NewAuctionModal";
import { useEffect } from "react";
import { useState } from "react";

const COLLECTION_ID = "demo";

const Auction = () => {
  const [selectedItem, setSelectedItem] = useState<AuctionItemType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [auctionItems, setAuctionItems] = useState<AuctionItemType[]>([]);

  useEffect(
    () =>
      streamAuctionItems(
        COLLECTION_ID,
        (querySnapshot: QuerySnapshot) => {
          const updatedAuctionItems = querySnapshot.docs.map((doc) =>
            ({ ...doc.data(), itemId: doc.id })
          );
          setAuctionItems(updatedAuctionItems as AuctionItemType[]);
          setSelectedItem(updatedAuctionItems[0] as AuctionItemType);
        },
        (err: QuerySnapshot<DocumentData>) => {
          throw new Error("Failed to listen to changes");
        }
      ),
    []
  );

  return (
    <Sheet>
      <Button variant="plain" onClick={() => logout()}>
        Logout
      </Button>
      <NewAuctionModal open={modalOpen} onClose={setModalOpen} />
      <List
        row
        variant="outlined"
        sx={{ my: 2 }}
        style={{ height: "70px", overflow: "auto" }}
      >
        {auctionItems.map((item, index) => (
          <AuctionListItem
            key={index}
            itemId={item.itemId}
            title={item.title}
            onClick={() => setSelectedItem(item)}
            image={item.imageURL}
          />
        ))}
      </List>
      {selectedItem &&
        <AuctionSelected
          itemId={selectedItem.itemId}
          title={selectedItem.title}
          subtitle={selectedItem.subtitle}
          image={selectedItem.imageURL}
        />
      }
    </Sheet>
  );
};
export default Auction;
