export type PreferencesData = {
  budgetRange: [number, number];
  preferredAreas: string[];
  lifestyle: string;
  dealBreakers: string[];
  maxDistance: number;
  ageRange: [number, number];
  occupationPreferences: string[];
  vegetarianPreference: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  role: 'has_room' | 'seeking_room';
  photoUrls: string[];
  bio: string;
  location: { lat: number; lng: number };
  preferences: PreferencesData;
  verification: {
    idUploaded: boolean;
    workVerified: boolean;
  };
  startupCollaboration?: boolean;
  familyVisitAccommodation?: boolean;
  mutualPreference?: boolean;
  createdAt: string;
  isActive: boolean;
};

export type Match = {
  id: string;
  userId1: string;
  userId2: string;
  matchedAt: string;
  status: 'matched' | 'blocked' | 'pending';
  lastMessage: string;
  lastMessageAt: string;
};


