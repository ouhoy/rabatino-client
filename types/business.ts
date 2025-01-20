
export interface BusinessPost {
  id: string;
  title: string;
  body: string;
  featuredImg: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}