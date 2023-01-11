import { DocumentData, Timestamp } from "firebase/firestore"

export type UserType = {
  name?: string
  email: string
  password: string
}

export type NewAuctionItemType = {
  title: string
  subtitle: string
  imageURL?: string
}

export interface AuctionItemType extends NewAuctionItemType, DocumentData {
  itemId: string
  timestamp: Timestamp
  bidderId: string
}

export type BidType = {
  itemId: string
  bidAmount: number | string
}

export type AuctionListItemType = {
  itemId: string;
  image?: string;
  onClick: any;
  title: string;
}

export interface SelectedAuctionItemType extends Omit<AuctionListItemType, 'onClick'> {
  subtitle: string;
}