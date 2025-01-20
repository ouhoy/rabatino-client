export enum TourismType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  ATTRACTION = 'ATTRACTION',
  THEATER = 'THEATER',
  BANK = 'BANK'
}

export interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: Date;
  userId: string;
  address: string;  // Add this field
  latitude:number;  
  longitude:number;
  website?: string;
  phone?: string;
  email?: string;
  featuredImage: string;

}

export interface Tourism extends Post {
  isActive: boolean;
  rating: number;
  type: TourismType;
}

export interface TouristAttraction extends Tourism {
  attractionType: string;
  bestVisitTime: string;
  entryFee: number;
  openingHours: string;
  guideTours: boolean;
  
}

export interface Hotel extends Tourism {
    amenities: string[];
    priceRanges: string;
    totalRooms: number;
    roomTypes: string;
    checkInTime: string;
  }
  export interface Restaurant extends Tourism {
    cuisine: string;
    priceRanges: string;
    menus: string;
    openiningHours: string;
    takout: boolean;
    delivery: boolean;
  }
