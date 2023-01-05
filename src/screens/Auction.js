import { useState } from "react";
import { Button, Sheet, List } from "@mui/joy";
import AuctionListItem from "../components/AuctionListItem.tsx";
import AuctionSelected from "../components/AuctionSelected.tsx";

const Auction = () => {
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <Sheet>
      <Button variant="plain" onClick={() => {}}>
        Logout
      </Button>
      <List
        row
        variant="outlined"
        sx={{ my: 2 }}
        style={{ height: "70px", overflow: "auto" }}
      >
        {new Array(100).fill("").map((_, index) => (
          <AuctionListItem
            key={index}
            itemId={index}
            onClick={setSelectedItem}
            image={`https://source.unsplash.com/random?sig=${index}`}
          />
        ))}
      </List>
      <AuctionSelected itemId={selectedItem} />
    </Sheet>
  );
};
export default Auction;
