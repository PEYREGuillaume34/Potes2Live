// ========================================
// TYPES UTILITAIRES
// ========================================

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ========================================
// TYPES UTILISATEUR
// ========================================

export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserBasic = {
  id: string;
  name: string;
  avatar_url?: string | null;
};

// ========================================
// TYPES ARTISTE
// ========================================

export type Artist = {
  id: number;
  name: string;
  genre: string | null;
  imageUrl: string | null;
  spotifyUrl?: string | null;
  instagramUrl?: string | null;
  bio?: string | null;
};

export type ArtistBasic = {
  name: string;
  genre: string | null;
  imageUrl: string | null;
};

// ========================================
// TYPES VENUE (SALLE)
// ========================================

export type Venue = {
  id: number;
  name: string;
  city: string;
  postalCode: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type VenueBasic = {
  name: string;
  city: string;
  postalCode: string | null;
};

// ========================================
// TYPES CONCERT / EVENT
// ========================================

export type Concert = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  imageUrl: string | null;
  eventDate: Date;
  eventTime?: string | null;
  price: number | null;
  ticketUrl?: string | null;
  artist: Artist;
  venue: Venue;
  groupCount?: number;
};

export type ConcertListItem = {
 id: number;
  slug: string;
  title: string;
  imageUrl: string | null;
  eventDate: Date;
  eventTime: string | null;
  price: number | null;
  artist: ArtistBasic;
  venue: VenueBasic;
  groupCount: number;
};

// ========================================
// TYPES PROPS COMPOSANTS - CONCERTS
// ========================================

export type ConcertsClientProps = {
  concerts: ConcertListItem[];
  initialCity?: string;  // Rendre optionnel
  initialPostalCode?: string;
};

export type ConcertCardProps = {
  slug: string;
  title: string;
  imageUrl: string | null;
  artistName: string;
  artistImageUrl: string | null;
  artistGenre: string | null;
  venueName: string;
  venueCity: string;
  venuePostalCode: string | null;
  date: Date;
  time: string | null;
  price: number | null;
  groupCount: number;
};

export type ConcertPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// ========================================
// TYPES GROUPE
// ========================================

export type Group = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  eventId: number;
  ownerId: string;
};

export type GroupWithMembers = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  createdAt: Date;
  ownerId: string;
  owner: UserBasic;
  memberCount: number;
};

export type GroupWithEvent = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  createdAt: Date;
  isOwner: boolean;
  memberRole: "owner" | "member";
  memberCount: number;
  event: {
    id: number;
    slug: string;
    title: string;
    imageUrl: string | null;
    eventDate: Date;
    eventTime: string | null;
  };
};

export type UserGroupStatus = {
  isMember: boolean;
  role: "owner" | "member" | null;
  status: "active" | "left" | null;
};

// ========================================
// TYPES PROPS COMPOSANTS - GROUPES
// ========================================

export type GroupsListProps = {
  eventId: number;
};

export type GroupCardProps = {
  group: GroupWithMembers;
  currentUserId: string | null;
  userStatus: UserGroupStatus | null;
  onUpdate?: () => void;
};

export type CreateGroupFormProps = {
  eventId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export type MyGroupCardProps = {
  group: GroupWithEvent;
  onUpdate?: () => void;
};

// ========================================
// TYPES MESSAGE
// ========================================

export type Message = {
  id: number;
  content: string;
  createdAt: Date;
  user: UserBasic;
};

// ========================================
// TYPES PROPS COMPOSANTS - MESSAGES
// ========================================

export type MessageItemProps = {
  message: Message;
  isOwnMessage: boolean;
};

export type MessageListProps = {
  messages: Message[];
  currentUserId: string;
};

export type MessageInputProps = {
  groupId: number;
};

export type ChatBoxProps = {
  groupId: number;
  messages: Message[];
  currentUserId: string;
};

// ========================================
// TYPES PAGES
// ========================================

export type GroupPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export type PageProps = {
  params: {
    slug: string;
  };
};