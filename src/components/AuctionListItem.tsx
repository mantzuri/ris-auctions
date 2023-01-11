import {
  AspectRatio,
  ListItem,
  ListItemButton,
  Sheet,
  Typography
} from "@mui/joy";

import { AuctionListItemType } from "../types";

const AuctionListItem = ({ itemId, image, onClick, title }: AuctionListItemType) => {
  return (
    <ListItem key={itemId}>
      <ListItemButton onClick={() => onClick(itemId)}>
        <Sheet sx={{ width: 80 }}>
          <AspectRatio>
            <img style={{ borderRadius: "md" }} src={image} alt="background" />
          </AspectRatio>
          <Typography level="body4">{title}</Typography>
        </Sheet>
      </ListItemButton>
    </ListItem>
  );
};

export default AuctionListItem;
