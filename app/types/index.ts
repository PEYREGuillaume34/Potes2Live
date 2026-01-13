export type Concert = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  eventDate: Date;
  eventTime: string | null;
  price: number | null;
  ticketUrl: string | null;
  artist: {
    id: number;
    name: string;
    genre: string | null;
    imageUrl: string | null;
  };
  venue: {
    id: number;
    name: string;
    city: string;
    address: string | null;
  };
};

export type Group = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  isActive: boolean;
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
  memberCount: number;
};