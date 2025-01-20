export interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: Date;
  userId: string;
  address: string;
  latitude: number;
  longitude: number;
  website?: string;
  phone?: string;
  email?: string;
  featuredImage: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: number;
  role: UserRole;
}
