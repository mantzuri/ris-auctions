import React from "react";
import { Sheet, AspectRatio, ListItem, ListItemButton } from "@mui/joy";

interface AuctionListItemType {
  itemId: string;
  image: any;
  onClick: any;
}
const AuctionListItem = ({ itemId, image, onClick }: AuctionListItemType) => {
  return (
    <ListItem key={itemId}>
      <ListItemButton onClick={() => onClick(itemId)}>
        <Sheet sx={{ width: 60 }}>
          <AspectRatio>
            <img style={{ borderRadius: "md" }} src={image} alt="background" />
          </AspectRatio>
        </Sheet>
      </ListItemButton>
    </ListItem>
  );
};

export default AuctionListItem;
