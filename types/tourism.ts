import { type Post } from './shared'

export enum TourismType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  ATTRACTION = 'ATTRACTION',
  THEATER = 'THEATER',
  BANK = 'BANK'
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
